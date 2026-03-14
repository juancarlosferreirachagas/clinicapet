"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMsg {
  id: string;
  msg: string;
  tipo: ToastType;
}

interface ToastContextValue {
  toast: (msg: string, tipo?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, string> = {
  success: "check_circle",
  error: "error",
  info: "info",
};

const styles: Record<ToastType, string> = {
  success: "bg-[#059669] text-white",
  error: "bg-[#dc2626] text-white",
  info: "bg-[#0f172a] text-white",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([]);

  const toast = useCallback((msg: string, tipo: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setItems((prev) => [...prev, { id, msg, tipo }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[9999] flex -translate-x-1/2 flex-col gap-3 max-w-[min(440px,calc(100vw-32px))]" role="status" aria-live="polite">
        {items.map(({ id, msg, tipo }) => (
          <div
            key={id}
            className={`flex items-center gap-3 rounded-xl px-5 py-4 text-[0.9375rem] font-medium shadow-[var(--shadow-lg)] ${styles[tipo]} animate-toast-in`}
          >
            <span className="material-icons-round text-xl">{icons[tipo]}</span>
            <span>{msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
