"use client";

import { useState } from "react";
import { getEspecieIcon } from "@/lib/utils";

interface PetAvatarProps {
  fotoUrl?: string | null;
  especie?: string;
  nome?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const sizes = { xs: "w-10 h-10 rounded-lg", sm: "w-14 h-14 rounded-xl", md: "w-24 h-24 rounded-2xl", lg: "w-36 h-36 rounded-2xl" } as const;
const iconSizes = { xs: "text-base", sm: "text-2xl", md: "text-4xl", lg: "text-6xl" } as const;

export function PetAvatar({ fotoUrl, especie, nome, size = "lg", className = "" }: PetAvatarProps) {
  const icon = iconSizes[size];
  const iconName = getEspecieIcon(especie || "");

  const [imgError, setImgError] = useState(false);
  const baseClasses = sizes[size] ?? sizes.lg;
  if (fotoUrl && fotoUrl.startsWith("http") && !imgError) {
    return (
      <div className={`${baseClasses} overflow-hidden bg-[var(--primary-muted)] flex-shrink-0 shadow-md ring-1 ring-white/40 ${className} relative`}>
        <img src={fotoUrl} alt={nome || "Pet"} className="w-full h-full object-cover" onError={() => setImgError(true)} />
      </div>
    );
  }

  return (
    <div className={`${baseClasses} bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] flex items-center justify-center text-white shadow-md flex-shrink-0 ${className}`}>
      <span className={`material-icons-round ${icon}`}>{iconName}</span>
    </div>
  );
}
