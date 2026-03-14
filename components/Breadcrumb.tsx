"use client";

import Link from "next/link";

interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-2 text-[0.8125rem] text-[var(--text-muted)] mb-6" aria-label="Navegação">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="material-icons-round text-sm opacity-60">chevron_right</span>}
          {c.href ? (
            <Link href={c.href} className="hover:text-[var(--primary)] hover:underline transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className="font-medium text-[var(--text)]">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
