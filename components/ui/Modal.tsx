"use client";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function slugify(text: string): string {
  return `modal-title-${text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")}`;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  const titleId = slugify(title);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id={titleId} className="text-lg font-semibold">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-slate-100 hover:text-[var(--text)]"
            aria-label="Fechar"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
