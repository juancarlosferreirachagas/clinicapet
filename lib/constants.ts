export const API_BASE = "/api";

export const CN = {
  /* Cards */
  card: "bg-white rounded-[var(--radius-lg)] shadow-[var(--card-shadow)] p-5 lg:p-6 border border-slate-100/80 hover:shadow-[var(--card-shadow-hover)] transition-all duration-200 ease-out",
  cardHeader: "flex items-center justify-between mb-5 pb-4 border-b border-slate-100",
  cardTitle: "text-[0.875rem] font-semibold text-[var(--text)] tracking-tight",

  /* Botões de ação */
  btnNovo: "inline-flex items-center gap-2 px-4 py-2 text-[0.8125rem] font-semibold bg-[var(--primary-muted)] text-[var(--primary)] rounded-[var(--radius-sm)] hover:bg-[var(--primary-light)]/80 transition-colors duration-200",

  /* Formulário */
  input: "w-full px-3.5 py-2.5 text-[0.9375rem] border border-slate-200 rounded-[var(--radius-sm)] bg-white placeholder:text-[var(--text-subtle)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-muted)] transition-all duration-200",
  label: "mb-1.5 block text-[0.75rem] font-semibold text-[var(--text-muted)] tracking-wide",

  /* Botões principais */
  btnPrimary: "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[0.875rem] font-semibold bg-[var(--primary)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all duration-200",
  btnSecondary: "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[0.875rem] font-medium bg-slate-100 text-[var(--text-muted)] rounded-[var(--radius-sm)] hover:bg-slate-200 hover:text-[var(--text)] transition-colors duration-200",
  btnEditar: "inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium bg-[var(--primary-muted)] text-[var(--primary)] rounded-[var(--radius-sm)] hover:bg-[var(--primary-light)]/80 transition-colors duration-200 border-0 cursor-pointer",
  btnExcluir: "inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.75rem] font-medium bg-rose-50 text-rose-600 rounded-[var(--radius-sm)] hover:bg-rose-100 transition-colors duration-200 border-0 cursor-pointer",

  /* Lista */
  listItem: "flex justify-between items-center gap-4 py-3.5 px-4 text-[0.9375rem] bg-slate-50/80 rounded-[var(--radius)] mb-2.5 border-l-[3px] border-l-[var(--primary)] hover:bg-[var(--primary-subtle)] transition-colors duration-200 last:mb-0",
  listEmpty: "text-[var(--text-muted)] py-8 text-center text-[0.9375rem] leading-relaxed",

  /* Seções */
  sectionHeader: "mb-6",
  sectionTitle: "text-2xl font-bold text-[var(--text)] tracking-tight mb-1",
  sectionSubtitle: "text-[0.9375rem] text-[var(--text-muted)]",
  link: "text-[var(--primary)] font-semibold hover:underline underline-offset-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:ring-offset-1 rounded transition-colors duration-200",
} as const;
