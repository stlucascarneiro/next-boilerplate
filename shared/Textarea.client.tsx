"use client";

interface ITextarea {
  className?: string;
  defaultValue?: string;
  helperText?: {
    className: string;
    text: string;
  };
  icon?: React.ReactNode;
  label: string;
  limit?: number;
  name: string;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
  value?: string;
}

export default function Textarea({
  className,
  defaultValue,
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
  rows,
  value,
}: ITextarea) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <label className="text-strong text-sm font-medium" htmlFor={name}>
        {label}
      </label>
      <div
        className="border-border-input bg-input relative flex items-center rounded-md border"
        suppressHydrationWarning
      >
        {icon && <i className="absolute top-2.5 left-3">{icon}</i>}
        <textarea
          className={`text-text placeholder:text-subtle focus-visible:outline-primary min-h-24 w-full rounded-md border-none py-2 outline-transparent duration-200 placeholder:font-normal focus-visible:shadow-[0_2px_10px_2px_var(--color-primary)]/40 focus-visible:outline-1 ${icon ? "pl-9" : "pl-3"}`}
          defaultValue={defaultValue}
          id={name}
          maxLength={limit ?? 500}
          name={name}
          onBlur={(e) => onBlur?.(e.target.value)}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") onEnter?.();
          }}
          placeholder={placeholder}
          required={required}
          rows={rows ?? 4}
          value={value}
        />
      </div>
      {helperText && (
        <div className="mt-1 flex">
          <p className={`text-sm ${helperText.className}`}>{helperText.text}</p>
        </div>
      )}
    </div>
  );
}
