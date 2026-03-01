import { Outlet } from "react-router-dom";
import { PageError } from "../handkeErrors/PageError";
import { ErrorBoundary } from "../handkeErrors/GlobalErrorBoundary";
import React from "react";
import {
  Package,
  User,
  FileText,
  CheckCircle,
  Lock,
  ShieldCheck,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAppSelector } from "../stores/hooks";

const steps = [
  { number: 1, label: "Product", icon: Package },
  { number: 2, label: "Data", icon: User },
  { number: 3, label: "Summary", icon: FileText },
  { number: 4, label: "Status", icon: CheckCircle },
];

export const DashboardLayout = () => {
  const step = useAppSelector((s) => s.ui.step);
  return (
    <ErrorBoundary
      fallback={(_error, _errorInfo) => {
        return <PageError />;
      }}
    >
      <div className="flex min-h-dvh flex-col bg-[var(--canvas)]">
        {/* ── Header ── */}
        <header className="sticky top-0 z-50 bg-white border-b border-black/[0.07]">
          <div className="mx-auto flex h-14 max-w-[1024px] items-center justify-between px-4 sm:px-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-[1.375rem] w-[1.375rem] shrink-0 items-center justify-center rounded-[4px] bg-[var(--text-primary)]">
                <ShieldCheck
                  size={13}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-[0.9375rem] font-bold tracking-tight text-[var(--text-primary)]">
                SecurePay
              </span>
            </div>

            {/* Step wizard */}
            <nav className="flex w-48 flex-row flex-nowrap items-center justify-between sm:w-64 ">
              {steps.map((stepi, index) => {
                const isCompleted = stepi.number < step;
                const isCurrent = stepi.number === step;
                const isActive = isCompleted || isCurrent;
                const Icon = stepi.icon;

                return (
                  <React.Fragment key={stepi.number}>
                    {/* Connector line */}
                    {index > 0 && (
                      <div
                        className={`mx-1.5 h-px flex-1 transition-colors duration-300 ${
                          isActive
                            ? "bg-[var(--text-primary)]"
                            : "bg-[var(--border-default)]"
                        }`}
                      />
                    )}

                    {/* Step icon with tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center  transition-all duration-200 rounded-full ${
                            isActive
                              ? "bg-[var(--text-green)] text-white shadow-sm"
                              : "border border-[var(--border-default)] bg-[var(--surface-1)] text-[var(--text-muted)]"
                          } ${isCurrent ? "ring-2 ring-[var(--text-primary)]/20 ring-offset-1" : ""}`}
                        >
                          <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={6}
                        className="bg-[var(--text-primary)] px-2 py-1 text-xs font-medium text-white"
                      >
                        <p>{stepi.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        </header>

        {/* ── Main content ── */}
        <main className="flex w-full flex-1 justify-center px-4 py-4 sm:px-6 md:py-6">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="mt-auto border-t border-black/[0.05] bg-white py-5">
          <p className="flex items-center justify-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-[var(--text-muted)]">
            <Lock size={10} />
            Conexión segura cifrada SSL/TLS 256-bit
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};
