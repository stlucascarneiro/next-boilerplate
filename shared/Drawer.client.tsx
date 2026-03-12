"use client";

import { useCallback, useMemo, useState } from "react";
import Button, { type IButtonProps } from "./Button.client";
import {
  DrawerContext,
  type DrawerPlacement,
  useDrawer,
} from "./contexts/drawer";
import { useClickOutside } from "./hooks/useClickOutside";
import { useOpenAnimation } from "./hooks/useOpenAnimation";

interface DrawerBaseProps {
  children: React.ReactNode;
  placement?: DrawerPlacement;
}

interface DrawerTriggerProps extends IButtonProps {
  children?: React.ReactNode;
}

interface DrawerContentProps {
  children: React.ReactNode;
}

interface DrawerCloseProps extends IButtonProps {
  children: React.ReactNode;
}

type DrawerCompoundComponent = ((props: DrawerBaseProps) => React.ReactNode) & {
  Close: (props: DrawerCloseProps) => React.ReactNode;
  Content: (props: DrawerContentProps) => React.ReactNode;
  Trigger: (props: DrawerTriggerProps) => React.ReactNode;
};

function DrawerBase({ children, placement = "right" }: DrawerBaseProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({ close, open, placement, toggle }),
    [close, open, placement, toggle],
  );

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

function DrawerTrigger({ children, onClick, ...props }: DrawerTriggerProps) {
  const { toggle } = useDrawer();

  const handleClick = useCallback(() => {
    onClick?.();
    toggle();
  }, [onClick, toggle]);

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

function DrawerContent({ children }: DrawerContentProps) {
  const { close, open, placement } = useDrawer();
  const animatedScope = useOpenAnimation({
    enabled: open,
    keyframes: {
      opacity: [0, 1],
      transform:
        placement === "right"
          ? ["translateX(24px)", "translateX(0)"]
          : ["translateX(-24px)", "translateX(0)"],
    },
  });

  useClickOutside({
    enabled: open,
    onEscape: close,
    onOutsideClick: close,
    ref: animatedScope,
  });

  if (!open) return null;

  const placementClass = placement === "right" ? "right-0" : "left-0";
  const borderClass = placement === "right" ? "border-l" : "border-r";

  return (
    <div className="fixed inset-0 z-40">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/40"
        onClick={close}
      />
      <div
        aria-modal="true"
        className={`border-border-surface absolute inset-y-0 ${placementClass} ${borderClass} bg-input z-50 flex w-full max-w-md flex-col shadow-xl`}
        ref={animatedScope}
        role="dialog"
      >
        {children}
      </div>
    </div>
  );
}

function DrawerClose({ children, onClick, ...props }: DrawerCloseProps) {
  const { close } = useDrawer();

  const handleClick = useCallback(() => {
    onClick?.();
    close();
  }, [close, onClick]);

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

const Drawer = DrawerBase as DrawerCompoundComponent;

Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Close = DrawerClose;

export default Drawer;
