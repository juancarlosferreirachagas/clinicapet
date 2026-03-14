"use client";

import { CN } from "@/lib/constants";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`${CN.card} ${className}`}>{children}</div>;
}

interface CardHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, action }: CardHeaderProps) {
  return (
    <div className={CN.cardHeader}>
      <h3 className={CN.cardTitle}>{title}</h3>
      {action}
    </div>
  );
}
