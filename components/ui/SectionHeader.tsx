"use client";

import Link from "next/link";
import { CN } from "@/lib/constants";

interface QuickLink {
  href: string;
  label: string;
}

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  quickLinks?: QuickLink[];
}

export function SectionHeader({ title, subtitle, quickLinks }: SectionHeaderProps) {
  return (
    <div className={CN.sectionHeader}>
      <h2 className={CN.sectionTitle}>{title}</h2>
      <p className={CN.sectionSubtitle}>{subtitle}</p>
      {quickLinks && quickLinks.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.8125rem] font-medium text-[var(--primary)] bg-[var(--primary-muted)]/60 hover:bg-[var(--primary-muted)] transition-colors duration-200">
              <span className="material-icons-round text-[1.125rem]">arrow_forward</span>{l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
