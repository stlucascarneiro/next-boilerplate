"use client";

import { useId } from "react";

interface ISwitchProps {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  label?: string;
  name: string;
  onChange?: (checked: boolean) => void;
  required?: boolean;
}

export default function Switch({
  checked,
  className,
  defaultChecked,
  disabled = false,
  label,
  name,
  onChange,
  required = false,
}: ISwitchProps) {
  const switchId = useId();
  const id = `${name}-${switchId}`;

  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <label
        className="group flex w-fit cursor-pointer items-center gap-3"
        htmlFor={id}
        suppressHydrationWarning
      >
        {label && (
          <span className="text-strong text-sm font-medium">{label}</span>
        )}

        <span className="relative inline-flex items-center">
          <input
            checked={checked}
            className="peer sr-only"
            defaultChecked={defaultChecked}
            disabled={disabled}
            id={id}
            name={name}
            onChange={(event) => onChange?.(event.target.checked)}
            required={required}
            role="switch"
            type="checkbox"
          />

          <span
            aria-hidden
            className="border-border-input bg-input peer-focus-visible:outline-primary peer-checked:bg-primary block h-6 w-11 rounded-full border outline-transparent duration-200 peer-focus-visible:outline-2"
          />

          <span
            aria-hidden
            className="bg-strong pointer-events-none absolute left-0.5 h-5 w-5 rounded-full shadow-sm duration-200 peer-checked:translate-x-5"
          />
        </span>
      </label>
    </div>
  );
}
