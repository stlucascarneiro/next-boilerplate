"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import Button, { type IButtonProps } from "./Button.client";
import { useClickOutside } from "./hooks/useClickOutside";
import { useOpenAnimation } from "./hooks/useOpenAnimation";

type DialogVariant = "alert" | "neutral";

type ConfirmHandler = () => Promise<void> | void;

interface DialogBaseProps {
  children: React.ReactNode;
}

interface DialogTriggerProps extends IButtonProps {
  children?: React.ReactNode;
}

interface DialogContentProps {
  children?: React.ReactNode;
  className?: string;
  closeLabel?: string;
  closeOnConfirm?: boolean;
  confirmLabel?: string;
  description?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: ConfirmHandler;
  title?: React.ReactNode;
  variant?: DialogVariant;
}

interface DialogCloseProps extends IButtonProps {
  children?: React.ReactNode;
}

type DialogContextType = {
  close: () => void;
  open: boolean;
  toggle: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog components must be inside Dialog");
  }

  return context;
}

type DialogCompoundComponent = ((props: DialogBaseProps) => React.ReactNode) & {
  Close: (props: DialogCloseProps) => React.ReactNode;
  Content: (props: DialogContentProps) => React.ReactNode;
  Trigger: (props: DialogTriggerProps) => React.ReactNode;
};

function DialogBase({ children }: DialogBaseProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const contextValue = useMemo(
    () => ({ close, open, toggle }),
    [close, open, toggle],
  );

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, onClick, ...props }: DialogTriggerProps) {
  const { toggle } = useDialog();

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

function DialogContent({
  children,
  className,
  closeLabel = "Fechar",
  closeOnConfirm = true,
  confirmLabel = "Confirmar",
  description,
  onClose,
  onConfirm,
  title,
  variant = "neutral",
}: DialogContentProps) {
  const { close, open } = useDialog();
  const [confirming, setConfirming] = useState(false);
  const animatedScope = useOpenAnimation({
    enabled: open,
    keyframes: {
      opacity: [0, 1],
      transform: ["translateY(10px) scale(0.98)", "translateY(0) scale(1)"],
    },
  });

  const handleClose = useCallback(() => {
    onClose?.();
    close();
  }, [close, onClose]);

  const handleConfirm = useCallback(async () => {
    if (!onConfirm || confirming) return;

    const result = onConfirm();
    const isPromiseLike =
      typeof result === "object" &&
      result !== null &&
      "then" in result &&
      typeof result.then === "function";

    if (!isPromiseLike) {
      if (closeOnConfirm) close();
      return;
    }

    try {
      setConfirming(true);
      await result;
      if (closeOnConfirm) close();
    } finally {
      setConfirming(false);
    }
  }, [close, closeOnConfirm, confirming, onConfirm]);

  useClickOutside({
    enabled: open,
    onEscape: handleClose,
    onOutsideClick: handleClose,
    ref: animatedScope,
  });

  if (!open) return null;

  const panelClassName = [
    "border-border-surface relative z-50 w-full max-w-lg rounded-lg border bg-surface p-5 shadow-xl",
    variant === "alert" ? "border-error/60" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div
        aria-hidden
        className="absolute inset-0 bg-black/45"
        onClick={handleClose}
      />
      <div
        aria-modal="true"
        className={panelClassName}
        ref={animatedScope}
        role="dialog"
      >
        {(title || description) && (
          <div className="mb-5">
            {title && (
              <h3
                className={variant === "alert" ? "text-error" : "text-strong"}
              >
                {title}
              </h3>
            )}
            {description && <p className="text-subtle mt-2">{description}</p>}
          </div>
        )}

        {children && <div className="mb-5">{children}</div>}

        <div className="flex items-center justify-end gap-2">
          <Button onClick={handleClose} variant="secondary">
            {closeLabel}
          </Button>
          {onConfirm && (
            <Button
              loading={confirming}
              onClick={handleConfirm}
              variant={variant === "alert" ? "danger" : "primary"}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DialogClose({
  children = "Fechar",
  onClick,
  ...props
}: DialogCloseProps) {
  const { close } = useDialog();

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

const Dialog = DialogBase as DialogCompoundComponent;

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
Dialog.Close = DialogClose;

export default Dialog;
