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
  label: string;
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
      <label className="text-text font-medium" htmlFor={name}>
        {label}
      </label>
      <div
        className="border-border-input bg-input flex items-center rounded-md border"
        suppressHydrationWarning
      >
        <input
          className={
            "text-text placeholder:text-subtle focus-visible:outline-primary h-full min-h-8 w-full rounded-md border-none pl-3 outline-transparent duration-200 focus-visible:outline-dashed"
          }
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
