"use client";

import { cva, VariantProps } from "cva";
import { ReactNode } from "react";
import Spinner from "./Spinner";

const cvaButton = cva(
  [
    "text-strong duration-300 flex items-center gap-2 overflow-hidden font-semibold",
  ],
  {
    variants: {
      disabled: {
        false: "cursor-pointer",
        true: "cursor-not-allowed opacity-50",
      },
      size: {
        icon: "p-2 text-lg",
        lg: "px-5 py-2.5 text-base rounded-md",
        md: "px-4 py-2 text-sm",
        sm: "px-3 py-1.5 text-xs",
      },
      variant: {
        danger: "bg-error hover:bg-error/80 text-white",
        ghost: "hover:bg-muted/70",
        ghost_primary: "bg-primary/10 hover:bg-primary/30",
        primary: "bg-primary hover:bg-primary/80 text-white hover:text-white",
        secondary: "bg-background hover:bg-black/10",
      },
      width: {
        fit: "w-fit justify-center rounded-sm",
        full: "w-full justify-start",
      },
    },
  },
);

type TButtonCVA = VariantProps<typeof cvaButton>;
export interface IButtonProps extends TButtonCVA {
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconPlacement?: "left" | "right";
  loading?: boolean;
  onClick?: () => void;
}

export default function Button({
  children,
  className,
  disabled = false,
  icon,
  iconPlacement = "left",
  loading = false,
  onClick,
  size = "md",
  variant = "primary",
  width = "fit",
}: IButtonProps) {
  const iconOnly = !children && !!icon;
  return (
    <button
      className={cvaButton({
        className,
        disabled,
        size: iconOnly ? "icon" : size,
        variant: variant,
        width: width,
      })}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {iconPlacement === "left" && (
        <Icon icon={icon} iconOnly={iconOnly} loading={loading} />
      )}
      {children}
      {iconPlacement === "right" && (
        <Icon icon={icon} iconOnly={iconOnly} loading={loading} />
      )}
    </button>
  );
}

function Icon({
  icon: Icon,
  iconOnly,
  loading,
}: {
  icon?: ReactNode;
  iconOnly: boolean;
  loading: boolean;
}) {
  if (!Icon) return null;
  if (loading) return <Spinner />;
  return <div className={iconOnly ? "text-lg" : "text-base"}>{Icon}</div>;
}
