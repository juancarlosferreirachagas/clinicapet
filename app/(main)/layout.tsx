"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { Section } from "@/lib/types";

function SidebarContent() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cadastrosOpen, setCadastrosOpen] = useState(true);

  const isHome = pathname === "/";
  const active: Section = !isHome && pathname.startsWith("/pet") ? "pets" : "pets";

  const navLink = (section: Section, label: string, icon: string) => {
    const href = "/";
    const isActive = active === section;
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[0.9375rem] font-medium transition-all duration-200 ${
          isActive
            ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/25"
            : "text-white/75 hover:bg-[var(--sidebar-accent)] hover:text-white"
        }`}
      >
        <span className="material-icons-round text-xl opacity-95">{icon}</span>
        {label}
      </Link>
    );
  };

  const menuGroup = (
    label: string,
    icon: string,
    open: boolean,
    setOpen: (v: boolean) => void,
    children: React.ReactNode
  ) => (
    <div className="mb-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[0.9375rem] font-semibold text-white/90 hover:bg-[var(--sidebar-accent)] hover:text-white transition-all duration-200"
      >
        <span className="material-icons-round text-[1.25rem] opacity-95">{icon}</span>
        {label}
        <span className="material-icons-round ml-auto text-xl opacity-70 transition-transform duration-200">{open ? "expand_more" : "chevron_right"}</span>
      </button>
      {open && (
        <div className="ml-3 mt-1 border-l-2 border-white/10 pl-3 flex flex-col gap-1">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        className="fixed left-4 top-4 z-[200] flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 md:hidden transition-transform hover:scale-105 active:scale-95"
        aria-label="Abrir menu"
      >
        <span className="material-icons-round text-2xl">menu</span>
      </button>
      <div
        className={`fixed inset-0 z-[150] bg-black/40 transition-opacity duration-250 md:hidden ${mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed left-0 top-0 z-[160] flex h-full min-h-screen flex-col bg-[var(--sidebar-bg)] text-white w-[280px] max-w-[85vw] transition-transform duration-300 ease-out md:translate-x-0 md:w-[240px] md:max-w-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 border-b border-white/10 px-5 py-4 hover:bg-white/5 transition-colors duration-200">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/90 text-white">
            <span className="material-icons-round text-2xl">pets</span>
          </span>
          <h1 className="text-lg font-bold tracking-tight">Clínica Pet</h1>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
          {menuGroup("AC1 - Cadastro", "folder", cadastrosOpen, setCadastrosOpen, (
            <>
              {navLink("pets", "Pets", "pets")}
            </>
          ))}
        </nav>
        <div className="border-t border-white/10 px-5 py-4">
          <small className="text-[0.75rem] font-medium text-white/50 leading-relaxed">Entrega AC1 — Cadastro de Pets</small>
        </div>
      </aside>
    </>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SidebarContent />
      </Suspense>
      <main className="flex-1 min-h-screen ml-0 pt-[calc(48px+24px+env(safe-area-inset-top,0))] pl-4 pr-6 pb-8 overflow-x-hidden md:ml-[240px] md:pt-8 md:pl-8 md:pr-8 md:pb-10">
        <div className="animate-fade-in">{children}</div>
      </main>
    </>
  );
}
