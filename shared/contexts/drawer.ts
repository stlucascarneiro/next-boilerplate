import { createContext, useContext } from "react";

export type DrawerPlacement = "left" | "right";

type DrawerContextType = {
  close: () => void;
  open: boolean;
  placement: DrawerPlacement;
  toggle: () => void;
};

export const DrawerContext = createContext<DrawerContextType | null>(null);

export function useDrawer() {
  const context = useContext(DrawerContext);

  if (!context) {
    throw new Error("Drawer components must be inside Drawer");
  }

  return context;
}
