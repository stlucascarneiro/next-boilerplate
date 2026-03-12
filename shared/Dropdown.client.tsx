"use client";

import { useRef, useState } from "react";
import Button, { IButtonProps } from "./Button.client";
import {
  DropdownContext,
  type DropdownPlacement,
  useDropdown,
} from "./contexts/dropdown";
import { useClickOutside } from "./hooks/useClickOutside";
import { useOpenAnimation } from "./hooks/useOpenAnimation";

interface DropdownBaseProps {
  children: React.ReactNode;
  placement?: DropdownPlacement;
}

interface DropdownTriggerProps extends IButtonProps {
  children: React.ReactNode;
}

interface DropdownContentProps {
  children: React.ReactNode;
}

interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

type DropdownCompoundComponent = ((
  props: DropdownBaseProps,
) => React.ReactNode) & {
  Content: (props: DropdownContentProps) => React.ReactNode;
  Item: (props: DropdownItemProps) => React.ReactNode;
  Trigger: (props: DropdownTriggerProps) => React.ReactNode;
};

function DropdownBase({ children, placement = "right" }: DropdownBaseProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function toggle() {
    setOpen((prev) => !prev);
  }

  function close() {
    setOpen(false);
  }

  useClickOutside({
    enabled: open,
    onEscape: close,
    onOutsideClick: close,
    ref: containerRef,
  });

  return (
    <DropdownContext.Provider value={{ close, open, placement, toggle }}>
      <div className="relative inline-block" ref={containerRef}>
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function DropdownTrigger({ children, ...props }: DropdownTriggerProps) {
  const { toggle } = useDropdown();

  return (
    <Button onClick={toggle} {...props}>
      {children}
    </Button>
  );
}

function DropdownContent({ children }: DropdownContentProps) {
  const { open, placement } = useDropdown();
  const scope = useOpenAnimation({ enabled: open });

  if (!open) return null;

  const placementClass = placement === "right" ? "right-0" : "left-0";

  return (
    <div
      className={`border-border-surface absolute top-full z-20 mt-2 flex w-max min-w-48 flex-col rounded-md border bg-white py-3 shadow-lg ${placementClass}`}
      ref={scope}
    >
      {children}
    </div>
  );
}

function DropdownItem({ children, icon }: DropdownItemProps) {
  return (
    <Button icon={icon} variant="ghost" width="full">
      {children}
    </Button>
  );
}

const Dropdown = DropdownBase as DropdownCompoundComponent;

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
Dropdown.Item = DropdownItem;

export { Dropdown };
