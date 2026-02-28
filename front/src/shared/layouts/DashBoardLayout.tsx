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
      <div className="w-screen h-screen" style={{ backgroundColor: "var(--surface)" }}>
        <Outlet />
      </div>
    </ErrorBoundary>
  );
};
