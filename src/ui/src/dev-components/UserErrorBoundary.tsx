import type { ReactNode } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Mode, mode } from "../constants";
import { DevErrorPage } from "./DevErrorPage";

const getErrorMessage = (err: unknown) => {
  if (err instanceof Error) {
    const message = err.message
      .replaceAll(`${window.location.origin}/ui/src`, "")
      .replaceAll(/\?t=\d*/g, "");

    return message;
  }

  return "Something went wrong";
};

export const UserErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      fallbackRender={(params) => {
        return (
          <DevErrorPage
            text={
              <div
                style={{
                  display: "flex",
                  flexFlow: "column",
                }}
              >
                <p style={{ fontWeight: "bold" }}>An error occured:</p>
                <p>{getErrorMessage(params.error)}</p>

                {mode === Mode.DEV && (
                  <p style={{ marginTop: "40px", fontWeight: "bold" }}>
                    You can find more info in the console or by asking the agent
                    to debug the error.
                  </p>
                )}
              </div>
            }
            canRefresh={true}
          />
        );
      }}
      onError={(error) => {
        console.error(error.message);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
