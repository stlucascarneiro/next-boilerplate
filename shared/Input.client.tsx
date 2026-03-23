"use client";

import { ReactNode } from "react";

type AllowedInputType =
  | "date"
  | "email"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "url";

interface IInput {
  asideContent?: ReactNode;
  className?: string;
  defaultValue?: number | string;
  helperText?: {
    className: string;
    text: string;
  };
  icon?: ReactNode;
  label?: string;
  limit?: number;
  name: string;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder: string;
  required?: boolean;
  step?: string;
  type: AllowedInputType;
  value?: number | string;
}

export default function Input({
  asideContent,
  className,
  helperText,
  icon,
  label,
  limit,
  name,
  onBlur,
  onChange,
  onEnter,
  placeholder,
  required,
  step,
  type,
  value,
}: IInput) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-strong text-sm font-medium" htmlFor={name}>
          {label}
          <span className="text-error ml-1">*</span>
        </label>
      )}
      <div
        className="border-border-input bg-input relative flex items-center rounded-md border"
        suppressHydrationWarning
      >
        {icon && <i className="absolute left-3">{icon}</i>}
        <input
          className={`text-text placeholder:text-subtle focus-visible:outline-primary h-full min-h-10 w-full rounded-md border-none outline-transparent duration-200 placeholder:font-normal focus-visible:shadow-[0_2px_10px_2px_var(--color-primary)]/40 focus-visible:outline-1 ${icon ? "pl-9" : "pl-3"}`}
          id={name}
          maxLength={limit ?? 100}
          name={name}
          onBlur={(e) => onBlur?.(e.target.value)}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") onEnter?.();
          }}
          placeholder={placeholder}
          required={required}
          step={step}
          type={type}
          value={value}
        />
        {asideContent}
      </div>
      {helperText && (
        <div className="mt-1 flex">
          <p className={`text-sm ${helperText.className}`}>{helperText.text}</p>
        </div>
      )}
    </div>
  );
}
