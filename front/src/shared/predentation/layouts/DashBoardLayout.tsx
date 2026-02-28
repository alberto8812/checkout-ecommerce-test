import { Outlet } from "react-router-dom";
import { PageError } from "../handkeErrors/PageError";
import { ErrorBoundary } from "../handkeErrors/GlobalErrorBoundary";
import React from "react";
import { Package, User, FileText, CheckCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
const steps = [
  { number: 1, label: "Producto", icon: Package },
  { number: 2, label: "Datos", icon: User },
  { number: 3, label: "Resumen", icon: FileText },
  { number: 4, label: "Estado", icon: CheckCircle },
];

const currentStep = 1;

export const DashboardLayout = () => {
  return (
    <ErrorBoundary
      fallback={(_error, _errorInfo) => {
        return <PageError />;
      }}
    >
      <div className="checkout-shell">
        {/* ── Header ── */}
        <header
          style={{
            backgroundColor: "var(--surface-0)",
            borderBottom: "1px solid var(--border-subtle)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: "560px",
              margin: "0 auto",
              padding: "0 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "52px",
            }}
          >
            {/* Brand */}
            <span
              style={{
                fontSize: "0.9375rem",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--text-primary)",
                flexShrink: 0,
                marginRight: "0.75rem",
              }}
            >
              SecurePay
            </span>

            {/* Step wizard — icon flow with tooltips */}
            <nav
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "nowrap",
                width: "200px",
                justifyContent: "space-between",
                /* Removed overflow: hidden so tooltips can bleed out */
              }}
            >
              {steps.map((step, index) => {
                const isCompleted = step.number < currentStep;
                const isCurrent = step.number === currentStep;
                const isActive = isCompleted || isCurrent;
                const Icon = step.icon;

                return (
                  <React.Fragment key={step.number}>
                    {/* Connector line BEFORE step (except first) */}
                    {index > 0 && (
                      <div
                        style={{
                          flex: 1,
                          height: "2px",
                          margin: "0 8px",
                          backgroundColor: isActive ? "var(--green-500)" : "var(--border-subtle)",
                          transition: "background-color 0.3s ease",
                        }}
                      />
                    )}

                    {/* Step Icon with Tooltip */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: isActive ? "var(--green-50)" : "transparent",
                            border: isActive ? "2px solid var(--green-500)" : "2px solid var(--border-default)",
                            color: isActive ? "var(--green-500)" : "var(--border-default)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={isActive ? 16 : 14} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" sideOffset={5}>
                        <p>{step.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="flex-1 py-4 md:py-8 lg:py-12">
          <Outlet />
        </main>

        {/* ── Footer ── */}
        <footer className="py-4">
          <p
            className="text-center text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Conexión segura cifrada SSL/TLS de 256 bits
          </p>
        </footer>
      </div>
    </ErrorBoundary>
  );
};
