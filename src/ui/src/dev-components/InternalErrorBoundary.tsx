import * as Sentry from "@sentry/react";
import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { DevErrorPage } from "./DevErrorPage";

interface Props {
  children: ReactNode;
}

const fallbackRender = (_props: FallbackProps) => {
  return (
    <DevErrorPage
      text="Something went wrong. Please retry or contact support."
      canRefresh={false}
    />
  );
};

export const InternalErrorBoundary = ({ children }: Props) => {
  return (
    <ErrorBoundary
      fallbackRender={fallbackRender}
      onError={(error) => {
        Sentry.captureException(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
