"use client";

import { cva } from "cva";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FiCheckCircle, FiInfo, FiX, FiXCircle } from "react-icons/fi";
import { PiWarningCircleDuotone } from "react-icons/pi";
import { useOpenAnimation } from "./hooks/useOpenAnimation";

export type ToastPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export type ToastVariant = "error" | "info" | "success" | "warning";

type ToastItem = {
  description?: string;
  duration: number;
  id: string;
  title: string;
  variant: ToastVariant;
};

type ShowToastInput = {
  description?: string;
  duration?: number;
  title: string;
  variant?: ToastVariant;
};

type ToastContextValue = {
  clearToasts: () => void;
  dismissToast: (id: string) => void;
  showToast: (input: ShowToastInput) => string;
};

interface ToastProviderProps {
  children: React.ReactNode;
  max?: number;
  position?: ToastPosition;
}

const DEFAULT_DURATION = 4500;
const DEFAULT_MAX = 3;
const DEFAULT_POSITION: ToastPosition = "top-right";
const TOAST_ANIMATION_OPTIONS = {
  duration: 0.22,
  ease: "easeOut",
} as const;

const ToastContext = createContext<null | ToastContextValue>(null);

const cvaToastViewport = cva(
  "pointer-events-none fixed z-100 flex w-[calc(100%-2rem)] max-w-sm gap-2",
  {
    variants: {
      position: {
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
        "bottom-left": "bottom-4 left-4",
        "bottom-right": "bottom-4 right-4",
        "top-center": "top-4 left-1/2 -translate-x-1/2",
        "top-left": "top-4 left-4",
        "top-right": "top-4 right-4",
      },
      stackDirection: {
        normal: "flex-col",
        reverse: "flex-col-reverse",
      },
    },
  },
);

const cvaToastCard = cva(
  "bg-surface pointer-events-auto flex w-full items-start gap-3 rounded-md border p-3 shadow-lg",
  {
    variants: {
      variant: {
        error: "border-error/45",
        info: "border-primary/45",
        success: "border-success/45",
        warning: "border-warning/45",
      },
    },
  },
);

const cvaToastIcon = cva("mt-0.5 text-lg", {
  variants: {
    variant: {
      error: "text-error",
      info: "text-primary",
      success: "text-success",
      warning: "text-warning",
    },
  },
});

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}

export default function ToastProvider({
  children,
  max = DEFAULT_MAX,
  position = DEFAULT_POSITION,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    ({
      description,
      duration = DEFAULT_DURATION,
      title,
      variant = "info",
    }: ShowToastInput) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((prev) => {
        const next = [{ description, duration, id, title, variant }, ...prev];
        return next.slice(0, Math.max(1, max));
      });

      return id;
    },
    [max],
  );

  const contextValue = useMemo(
    () => ({ clearToasts, dismissToast, showToast }),
    [clearToasts, dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastViewport
        dismissToast={dismissToast}
        position={position}
        toasts={toasts}
      />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  dismissToast,
  position,
  toasts,
}: {
  dismissToast: (id: string) => void;
  position: ToastPosition;
  toasts: ToastItem[];
}) {
  const stackDirection = position.startsWith("bottom") ? "reverse" : "normal";

  return (
    <div
      aria-live="polite"
      className={cvaToastViewport({ position, stackDirection })}
      role="status"
    >
      {toasts.map((toast) => (
        <ToastCard
          key={toast.id}
          onClose={() => dismissToast(toast.id)}
          position={position}
          toast={toast}
        />
      ))}
    </div>
  );
}

function ToastCard({
  onClose,
  position,
  toast,
}: {
  onClose: () => void;
  position: ToastPosition;
  toast: ToastItem;
}) {
  const enterKeyframes = useMemo(
    () => ({
      opacity: [0, 1],
      transform: [
        position.endsWith("left")
          ? "translateX(-16px) scale(0.98)"
          : position.endsWith("right")
            ? "translateX(16px) scale(0.98)"
            : position.startsWith("bottom")
              ? "translateY(16px) scale(0.98)"
              : "translateY(-16px) scale(0.98)",
        "translateX(0) translateY(0) scale(1)",
      ],
    }),
    [position],
  );

  const animatedScope = useOpenAnimation({
    enabled: true,
    keyframes: enterKeyframes,
    options: TOAST_ANIMATION_OPTIONS,
  });

  useEffect(() => {
    if (toast.duration <= 0) return;

    const timer = window.setTimeout(onClose, toast.duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [onClose, toast.duration]);

  const IconByVariant = {
    error: FiXCircle,
    info: FiInfo,
    success: FiCheckCircle,
    warning: PiWarningCircleDuotone,
  };

  const Icon = IconByVariant[toast.variant] ?? FiInfo;

  return (
    <div
      className={cvaToastCard({ variant: toast.variant })}
      ref={animatedScope}
      role="alert"
    >
      <Icon className={cvaToastIcon({ variant: toast.variant })} />
      <div className="min-w-0 flex-1">
        <p className="text-strong mb-0 font-semibold">{toast.title}</p>
        {toast.description && (
          <p className="text-subtle mt-1 mb-0 text-xs">{toast.description}</p>
        )}
      </div>
      <button
        aria-label="Close toast"
        className="text-subtle hover:text-strong cursor-pointer rounded p-1 transition-colors"
        onClick={onClose}
      >
        <FiX />
      </button>
    </div>
  );
}
