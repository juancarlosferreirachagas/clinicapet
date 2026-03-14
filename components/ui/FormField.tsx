"use client";

import { useId, isValidElement, cloneElement } from "react";
import { CN } from "@/lib/constants";

interface FormFieldProps {
  label: string;
  children: React.ReactElement<{ id?: string }>;
  className?: string;
  hint?: string;
}

export function FormField({ label, children, className = "", hint }: FormFieldProps) {
  const generatedId = useId();
  const childProps = isValidElement(children) ? (children.props as { id?: string }) : {};
  const inputId = childProps.id || generatedId;
  const childWithId = isValidElement(children) && !childProps.id
    ? cloneElement(children as React.ReactElement<{ id?: string }>, { id: inputId })
    : children;

  return (
    <div className={className}>
      <label htmlFor={inputId} className={CN.label}>{label}</label>
      {childWithId}
      {hint && <p className="mt-1 text-[0.7rem] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
