"use client";

interface ComingSoonACProps {
  titulo: string;
  ac: string;
  data: string;
  icon?: string;
}

export function ComingSoonAC({ titulo, ac, data, icon = "schedule" }: ComingSoonACProps) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="animate-fade-in max-w-md w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 text-center">
        <span className="material-icons-round text-5xl text-[var(--primary)]/80 mb-4">
          {icon}
        </span>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{titulo}</h2>
        <p className="text-[var(--text-muted)] text-[0.9375rem] mb-4">
          Esta funcionalidade estará disponível na próxima entrega.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-4 py-2 text-[var(--primary)] font-semibold text-sm">
          <span className="material-icons-round text-lg">event</span>
          {ac} — {data}
        </div>
      </div>
    </div>
  );
}
