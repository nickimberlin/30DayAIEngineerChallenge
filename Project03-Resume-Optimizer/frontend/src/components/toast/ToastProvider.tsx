import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ToastNotification } from "@carbon/react";
import type { ToastNotificationProps } from "@carbon/react";

interface Toast {
  id: number;
  kind: NonNullable<ToastNotificationProps["kind"]>;
  title: string;
  subtitle?: string;
  caption?: string;
  timeout?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: number) => void;
  success: (title: string, subtitle?: string) => void;
  error: (title: string, subtitle?: string) => void;
  info: (title: string, subtitle?: string) => void;
  warning: (title: string, subtitle?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const success = useCallback(
    (title: string, subtitle?: string) => addToast({ kind: "success", title, subtitle }),
    [addToast],
  );
  const error = useCallback(
    (title: string, subtitle?: string) => addToast({ kind: "error", title, subtitle }),
    [addToast],
  );
  const info = useCallback(
    (title: string, subtitle?: string) => addToast({ kind: "info", title, subtitle }),
    [addToast],
  );
  const warning = useCallback(
    (title: string, subtitle?: string) => addToast({ kind: "warning", title, subtitle }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        style={{
          position: "fixed",
          top: 64,
          right: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
          width: "100%",
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastNotification
              kind={t.kind}
              title={t.title}
              subtitle={t.subtitle}
              caption={t.caption}
              timeout={t.timeout ?? 4000}
              onClose={() => removeToast(t.id)}
              style={{ width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
