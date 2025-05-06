import os
import io
import zipfile
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pathlib import Path

router = APIRouter()

# Define items to exclude from the zip archive
EXCLUDE_DIRS = {
    "node_modules",
    "__pycache__",
    ".git",
    ".idea",
    ".vscode",
    "dist",
    "build",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".next", # If using Next.js later
    ".angular", # If using Angular later
    "venv",
    ".venv",
    "env",
    ".env",
}
EXCLUDE_FILES = {
    ".DS_Store",
    "*.pyc",
    "*.log",
    ".env*", # Exclude all .env files
    "*.lock", # e.g., package-lock.json, yarn.lock, poetry.lock
}


@router.get("/export-project-zip", response_class=StreamingResponse, tags=["stream"])
def export_project_zip():
    """Creates a ZIP archive of the project source code and returns it for download."""
    project_root = Path("/app") # Root directory of the project in Databutton
    zip_buffer = io.BytesIO()

    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(project_root):
            # Modify dirs in-place to skip excluded directories
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            # Determine the relative path for files within the zip archive
            relative_path = Path(root).relative_to(project_root)

            for file in files:
                file_path = Path(root) / file
                # Check file exclusion based on name, extension, or if it starts with .env
                if (
                    file in EXCLUDE_FILES
                    or file_path.suffix in [".pyc", ".log", ".lock"]
                    or file.startswith(".env")
                ):
                    continue

                arcname = relative_path / file # Path inside the zip file
                try:
                    # Ensure we only add files, not directories that might slip through
                    if file_path.is_file():
                         zipf.write(file_path, arcname=arcname)
                except Exception as e:
                    # Log the error, but continue zipping other files
                    print(f"Error adding {file_path} to zip: {e}")

    zip_buffer.seek(0)

    headers = {
        "Content-Disposition": 'attachment; filename="SyncSage_project.zip"'
    }

    return StreamingResponse(zip_buffer, media_type="application/zip", headers=headers)
