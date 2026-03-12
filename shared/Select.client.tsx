import { IOption } from "./types/components.type";

interface IProps {
  label?: string;
  name: string;
  options: IOption[];
}

export default function Select({ label, name, options }: IProps) {
  return (
    <div className={`flex flex-col gap-1`}>
      {label && (
        <label className="text-text font-medium" htmlFor={name}>
          {label}
        </label>
      )}
      <select className="border-border-input bg-input text-text placeholder:text-subtle focus-visible:outline-primary h-8 w-full rounded-md border pl-3 text-sm outline-transparent duration-200 focus-visible:outline-dashed">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
