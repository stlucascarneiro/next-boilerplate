"use client";

import { cva } from "cva";
import { useRef, useState } from "react";
import { PiCheckBold } from "react-icons/pi";
import Chip from "./Chip.client";
import { useClickOutside } from "./hooks/useClickOutside";
import { IOption, TInputValue } from "./types/components.type";

const cvaMultiselect = cva(
  [
    "border-border-input bg-input focus:outline-primary z-20 flex min-h-8 w-full flex-wrap gap-2 rounded-md border px-2 py-1 outline duration-200 outline-dashed",
  ],
  {
    variants: {
      open: {
        false: "outline-transparent",
        true: "outline-primary",
      },
    },
  },
);

interface IProps {
  defaultSelected?: TInputValue[];
  label?: string;
  maxSelection?: number;
  name: string;
  options: IOption[];
}

export default function Multiselect({
  defaultSelected,
  label,
  maxSelection,
  name,
  options,
}: IProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedValues, setSelectedValues] = useState<TInputValue[]>(
    () => defaultSelected ?? [],
  );

  useClickOutside({
    enabled: open,
    onEscape: () => setOpen(false),
    onOutsideClick: () => setOpen(false),
    ref: containerRef,
  });

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const concatenatedSelectedValues = selectedValues.join(",");

  const handleOptionClick = (value: TInputValue) => {
    setSelectedValues((prev) => {
      if (prev.includes(value)) return prev.filter((v) => v !== value);
      else if (maxSelection && prev.length >= maxSelection) return prev;
      return [...prev, value];
    });
  };

  const handleRemoveSelectedValue = (value: TInputValue) => {
    setSelectedValues((prev) => prev.filter((v) => v !== value));
  };

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="font-medium" htmlFor={name}>
          {label}
        </label>
        {!!maxSelection && (
          <span className="text-subtle text-sm">
            {selectedValues.length} / {maxSelection}
          </span>
        )}
      </div>
      <div className={cvaMultiselect({ open })}>
        {selectedValues.map((value) => {
          const option = options.find((o) => o.value === value);
          return option ? (
            <Chip
              clickable
              key={value}
              onClick={() => handleRemoveSelectedValue(value)}
            >
              {option.label}
            </Chip>
          ) : null;
        })}
        <input
          className="grow pl-1 outline-transparent focus-visible:outline-dashed"
          name={`${name}-search`}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Procurar..."
          type="text"
          value={searchValue}
        />
      </div>
      {open && (
        <ul className="border-border-input bg-input absolute top-full z-20 mt-2 flex h-40 w-full list-none flex-col overflow-auto rounded-md border">
          {filteredOptions.map((option) => {
            const selected = selectedValues.includes(option.value);
            return (
              <li
                className={`hover:bg-primary/10 m-0 flex cursor-pointer items-center gap-4 px-4 py-1 ${selected && "bg-primary/30"}`}
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.leftContent && <div>{option.leftContent}</div>}
                <span className="text-text grow font-medium">
                  {option.label}
                </span>
                {selected && (
                  <div className="text-primary">
                    <PiCheckBold />
                  </div>
                )}
              </li>
            );
          })}
          {!!searchValue.trim() && filteredOptions.length === 0 && (
            <li className="text-subtle m-0 flex items-center gap-4 px-4 py-2 text-sm">
              <span className="text-subtle grow font-medium">
                Nenhum resultado para &quot;{searchValue.trim()}&quot;
              </span>
            </li>
          )}
        </ul>
      )}
      <input name={name} type="hidden" value={concatenatedSelectedValues} />
    </div>
  );
}
