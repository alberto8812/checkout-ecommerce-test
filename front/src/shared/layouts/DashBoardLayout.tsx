import { Outlet } from "react-router-dom";

import { PageError } from "../handkeErrors/PageError";
import { ErrorBoundary } from "../handkeErrors/GlobalErrorBoundary";

export const DashboardLayout = () => {
  return (
    <ErrorBoundary
      fallback={(error, errorInfo) => {
        return <PageError />;
      }}
    >
      <div
        className="flex min-h-dvh flex-col "
        style={{ backgroundColor: "var(--surface)" }}
      >
        <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
            <span className="text-base font-semibold tracking-tight text-foreground">
              SecurePay
            </span>
          </div>
        </header>
        <Outlet />
      </div>
    </ErrorBoundary>
  );
};
