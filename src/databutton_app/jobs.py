import asyncio
import json
import os
import signal
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from .notifications import NotifyLogsAsyncType
from .state import AppStateDep
from .utils import utc_now

JOB_RUNS_PATH = "/run/jobs"

# Create router for running user defined jobs.
# This router is mounted under /jobs.
jobs_router = APIRouter(prefix="/jobs", include_in_schema=False)


class CommandEnvironment(BaseModel):
    cmd: str
    args: list[str]
    cwd: Path
    env: dict[str, str]
    pidfile: Path


def is_process_running(pid: int) -> bool:
    try:
        # os.kill does not actually kill the process with signal 0
        os.kill(pid, 0)
    except OSError:
        # Process is not running or no permission to check
        return False
    else:
        return True


def kill_process(pid: int):
    try:
        # Going directly for the kill, graceful
        # termination isn't important in this context
        os.kill(pid, signal.SIGKILL)
    except OSError:
        pass


def kill_process_with_pidfile(pidfile: Path):
    pid = read_pidfile(pidfile)
    if pid is not None:
        kill_process(pid)
        pidfile.unlink(missing_ok=True)


async def stream_subprocess_output(
    notify: NotifyLogsAsyncType,
    reader: asyncio.StreamReader,
    level: Literal["debug", "info", "warning", "error"],
):
    """
    Stream output of a subprocess.
    """
    # TODO: Must handle logs differently in prod
    while line := await reader.readline():
        text = line.decode()  # TODO: Not strict?
        await notify(text, level)


async def start_command(
    command: CommandEnvironment,
) -> asyncio.subprocess.Process:
    return await asyncio.create_subprocess_exec(
        command.cmd,
        *command.args,
        cwd=command.cwd.as_posix(),
        env=command.env,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )


async def wait_command(
    notify: NotifyLogsAsyncType,
    process: asyncio.subprocess.Process,
) -> int | None:
    # Stream stdout and stderr simultaneously
    assert process.stdout is not None
    assert process.stderr is not None
    await asyncio.gather(
        stream_subprocess_output(notify, process.stdout, level="info"),
        stream_subprocess_output(notify, process.stderr, level="error"),
    )

    # Wait for process to complete
    await process.wait()

    return process.returncode


def job_cwd(app_root: str, job_name: str, run_id: str) -> Path:
    return Path(f"{app_root}/{JOB_RUNS_PATH}/{job_name}/{run_id}")


def job_pidfile(app_root: str, job_name: str, run_id: str) -> Path:
    return job_cwd(app_root, job_name, run_id) / "PIDFILE"


def job_pidfiles(*, app_root: str, job_name: str = "*") -> list[Path]:
    return list(Path(app_root).glob(f"{JOB_RUNS_PATH}/{job_name}/*/PIDFILE"))


def job_script_path(app_root: str, job_name: str) -> Path:
    return Path(f"{app_root}/src/jobs/{job_name}/main.py")


# TODO: Temporarily using backend codeblocks for initial testing:
def backend_script_path(app_root: str, job_name: str) -> Path:
    return Path(f"{app_root}/src/backends/{job_name}/__init__.py")


def job_env() -> dict[str, str]:
    # Jobs and capabilities should have the same environment
    return os.environ.copy()


def read_job_code(app_root: str, job_name: str, code: str | None) -> str:
    # TODO: We may not need both reading and passing,
    #      just being indecisive now and keeping options open

    # Use code if passed
    if code is not None:
        return code

    # Otherwise read it from existing job source file
    src_path = job_script_path(app_root, job_name)
    if src_path.exists():
        return src_path.read_text()

    # TODO: Temporarily falling back to backend codeblocks for initial testing:
    src_path = backend_script_path(app_root, job_name)
    if src_path.exists():
        return src_path.read_text()

    raise ValueError(f"Could not find code for job {job_name}")


def make_job_environment(
    app_root: str,
    job_name: str,
    run_id: str,
    code: str,
) -> CommandEnvironment:
    # Define a unique run dir for this run
    cwd = job_cwd(app_root, job_name, run_id)

    # Create run dir, should not exist already
    cwd.mkdir(parents=True, exist_ok=False)

    # Paths to files in run dir
    pidfile = cwd / "PIDFILE"
    script_path = cwd / "main.py"

    # Write code snapshot to run dir
    script_path.write_text(code)

    return CommandEnvironment(
        cmd="python",
        args=[script_path.as_posix()],
        cwd=cwd,
        env=job_env(),
        pidfile=pidfile,
    )


def read_pidfile(pidfile: Path) -> int | None:
    try:
        return int(pidfile.read_text())
    except FileNotFoundError:
        return None


def is_job_running(*, app_root: str, job_name: str, run_id: str) -> bool:
    pidfile = job_pidfile(
        app_root=app_root,
        job_name=job_name,
        run_id=run_id,
    )

    pid = read_pidfile(pidfile)

    if pid is None:
        return False

    return is_process_running(pid)


class RunJobRequest(BaseModel):
    # Name of the job module
    jobName: str | None = None

    # ID of the job
    jobId: str

    # ID of the schedule triggering the job if relevant
    scheduleId: str | None = None

    # ID of the run, not applicable for schedules
    runId: str | None = None

    # Code to run, if not passed will be read from job source file,
    # for use in dev
    code: str | None = None

    # If true, kill all other runs of this job,
    # for use in dev
    killOldRuns: bool = False


class RunJobResponse(BaseModel):
    exitcode: int | None


def make_run_id(payload: RunJobRequest) -> str:
    if payload.runId is not None:
        return payload.runId
    now = utc_now().strftime("%Y%m%dT%H%M%S")
    if payload.scheduleId is not None:
        return f"{payload.scheduleId}-{now}"
    return "noid-{now}"


def read_appconfig(app_root: str):
    p = Path(f"{app_root}/appconfig.json")
    if not p.exists():
        raise RuntimeError("Could not find appconfig.json")
    return json.loads(p.read_text())


def read_job_ids(app_root: str) -> dict[str, str]:
    # Read the app config to get job ids
    jobs = read_appconfig(app_root).get("jobs", [])
    return {j.get("jobId"): j.get("name") for j in jobs}


def job_name_from_id(app_root: str, job_id: str) -> str:
    return read_job_ids(app_root)[job_id]


job_semaphore = asyncio.Semaphore(1)


# TODO: Logging!
@jobs_router.post("/run")
async def handle_jobs_run(
    payload: RunJobRequest,
    app_state: AppStateDep,
) -> RunJobResponse:
    run_id = make_run_id(payload)
    app_root = app_state.cfg.DEVX_APP_ROOT_PATH
    job_name = payload.jobName or job_name_from_id(app_root, payload.jobId)
    notify = app_state.devx.notify_logs_async

    # Trying to combine KISS and race safety:
    # only one coroutine at a time is allowed to
    # kill the old processes and start a new process
    current_pidfile: Path | None = None
    async with job_semaphore:
        try:
            # TODO: Throw in some ids in a json encoded DATABUTTON_CONTEXT env var?
            command = make_job_environment(
                app_root=app_root,
                job_name=job_name,
                # job_id=payload.jobId,
                run_id=run_id,
                code=read_job_code(app_root, job_name, payload.code),
            )
        except OSError as e:
            raise HTTPException(
                status_code=409,
                detail="Job with this run id already started.",
            ) from e

        if payload.killOldRuns:
            # Kill the processes and remove the pidfiles for all runs of this job
            for pidfile in job_pidfiles(app_root=app_root, job_name=job_name):
                kill_process_with_pidfile(pidfile)

        # Launch new process, returns quickly
        process = await start_command(command)

        # Write pid file before releasing semaphore
        current_pidfile = command.pidfile
        current_pidfile.write_text(str(process.pid))

    # Wait for the job to finish, this can take a long time
    try:
        exitcode = await wait_command(notify, process)
    finally:
        # Delete pid file before returning
        if current_pidfile is not None:
            current_pidfile.unlink(missing_ok=True)

    # TODO: Should this be status 200 if exitcode is not 0?
    return RunJobResponse(exitcode=exitcode)


class KillJobRequest(BaseModel):
    jobName: str
    runId: str


class KillJobResponse(BaseModel):
    pass


@jobs_router.post("/kill")
async def handle_jobs_kill(
    payload: KillJobRequest,
    app_state: AppStateDep,
) -> KillJobResponse:
    app_root = app_state.cfg.DEVX_APP_ROOT_PATH
    pidfile = job_pidfile(
        app_root=app_root,
        job_name=payload.jobName,
        run_id=payload.runId,
    )
    kill_process_with_pidfile(pidfile)
    return KillJobResponse()
