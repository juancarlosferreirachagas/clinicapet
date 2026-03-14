"use client";

import { createContext, useCallback, useContext, useRef, useState, ReactNode, useEffect } from "react";

interface ConfirmOptions {
  titulo?: string;
  mensagem: string;
  confirmarTexto?: string;
  icone?: string;
}

type Resolver = (value: boolean) => void;

const ConfirmContext = createContext<{
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
} | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOptions>({ mensagem: "" });
  const resolverRef = useRef<Resolver | undefined>(undefined);

  const confirm = useCallback((o: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setOpts(o);
      setOpen(true);
    });
  }, []);

  const close = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    setOpen(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && close(false)}
        >
          <div className="w-full max-w-[420px] rounded-2xl bg-white p-8 shadow-[var(--shadow-xl)] animate-slide-up">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <span className="material-icons-round text-2xl">{opts.icone || "warning"}</span>
              </span>
              <h3 className="text-xl font-bold text-slate-800">{opts.titulo || "Confirmar"}</h3>
            </div>
            <p className="mb-7 text-[0.9375rem] text-[var(--text-muted)] leading-relaxed">{opts.mensagem}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => close(false)}
                className="rounded-xl px-5 py-2.5 text-[0.875rem] font-semibold bg-slate-100 text-[var(--text)] hover:bg-slate-200 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => close(true)}
                className="rounded-xl px-5 py-2.5 text-[0.875rem] font-semibold bg-rose-500 text-white hover:bg-rose-600 transition-colors"
              >
                {opts.confirmarTexto || "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
