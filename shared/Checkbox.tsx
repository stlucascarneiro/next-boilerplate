interface IInput {
  className?: string;
  defaultChecked?: boolean;
  label: string;
  name: string;
  required?: boolean;
}

export default function Checkbox({
  className,
  defaultChecked,
  label,
  name,
  required,
}: IInput) {
  return (
    <div className={`mb-4 flex flex-col ${className}`}>
      <label htmlFor={name}>{label}</label>
      <div className="flex" suppressHydrationWarning>
        <input
          className={
            "border-border-input bg-input text-text placeholder:text-subtle focus-visible:outline-primary mt-1 h-8 w-full rounded-md border outline-transparent duration-200 focus-visible:outline-dashed"
          }
          defaultChecked={defaultChecked}
          id={name}
          name={name}
          required={required}
          type="checkbox"
        />
      </div>
    </div>
  );
}
