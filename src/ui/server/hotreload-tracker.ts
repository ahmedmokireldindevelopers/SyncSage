import type { HmrContext, ModuleNode, Plugin } from "vite";

export interface ModuleRef {
  id: string | null;
  file: string | null;
  url: string;
  type: "js" | "css";
}

export interface ModuleProps {
  ref: ModuleRef;
  imports: Array<ModuleRef>;
  exports: string[] | null;
  hasDefaultExport: boolean | null;
}

// Note: Most of this seems to be too low level to be useful
export interface HotUpdatePayload {
  file: string;
  timestamp: number;
  modules: Array<ModuleProps>;
}

const extractModuleRefProps = (mod: ModuleNode): ModuleRef => {
  return {
    id: mod.id,
    file: mod.file,
    url: mod.url,
    type: mod.type,
  };
};

const extractModuleProps = (mod: ModuleNode): ModuleProps => {
  const ref = extractModuleRefProps(mod);

  const imports = Array.from(mod.importedModules.values()).map((imp) =>
    extractModuleRefProps(imp),
  );

  return {
    ref,
    imports,
    exports: mod.info?.exports ?? null,
    hasDefaultExport: mod.info?.hasDefaultExport ?? null,
  };
};

const extractPayload = (ctx: HmrContext): HotUpdatePayload => {
  // Note: ctx contains a _lot_ more information if we need it
  return {
    file: ctx.file,
    timestamp: ctx.timestamp,
    modules: ctx.modules.map(extractModuleProps),
  };
};

const localDevxUrl = (path: string) => {
  const devxPort = process.env.DEVX_API_PORT || "8008";
  return `http://localhost:${devxPort}${path}`;
};

const publishHotreloadUpdate = async (
  payload: HotUpdatePayload,
): Promise<void> => {
  try {
    const url = localDevxUrl("/workspace/internal/ui-hot-reloading");
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Failed to report hot reload status to devx", payload);
  }
};

// This is a highly experimental plugin that's an attempt to report hot reloading
// events to devx which can forward it to the connected web clients.
export const hotReloadTrackerPlugin = (): Plugin => {
  return {
    name: "hot-reload-tracker",
    async handleHotUpdate(ctx: HmrContext) {
      if (ctx.file.endsWith(".log")) {
        // This is called a lot with tsserver.log
        return;
      }

      // Race safe file reading for debugging:
      // console.log("Hot reloading file contents:", ctx.read());

      console.log(`hot-reload-tracker: hot-update, file = ${ctx.file}`);
      await publishHotreloadUpdate(extractPayload(ctx));

      // Note: We can skip or shape hotreloading behaviour by returning stuff here
    },
    buildStart() {
      console.log(
        "hot-reload-tracker: Build starting - error logger initialized",
      );
    },
    buildEnd(error) {
      if (error) {
        console.error("hot-reload-tracker: build error = ", formatError(error));
      }
    },
    configureServer(server) {
      server.middlewares.use((err, req, res, next) => {
        if (err) {
          console.error("hot-reload-tracker: error caught in middleware:");
          console.error(formatError(err));
        }
        next();
      });
    },
  };
};

function formatError(error: Error): string {
  return `
    Message: ${error.message || "Unknown error"}
    Stack: ${error.stack || ""}
    Location: ${error.loc ? `${error.loc.file}:${error.loc.line}:${error.loc.column}` : "Unknown"}
  `.trim();
}
