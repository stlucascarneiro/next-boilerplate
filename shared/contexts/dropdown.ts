import { createContext, useContext } from "react";

export type DropdownPlacement = "left" | "right";

type DropdownContextType = {
  close: () => void;
  open: boolean;
  placement: DropdownPlacement;
  toggle: () => void;
};

export const DropdownContext = createContext<DropdownContextType | null>(null);

export function useDropdown() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be inside Dropdown");
  }

  return context;
}
