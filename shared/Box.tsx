import { cva, type VariantProps } from "cva";
import { type ComponentPropsWithoutRef } from "react";

const cvaBox = cva(["border border-solid duration-300"], {
  defaultVariants: {
    size: "md",
    variant: "default",
  },
  variants: {
    hoverable: {
      true: "hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_var(--color-primary)]/20 hover:border-primary/30",
    },
    size: {
      lg: "p-4 md:p-10 rounded-3xl",
      md: "p-4 md:p-6 rounded-2xl",
      sm: "p-3 md:p-3 rounded-lg",
      unstyled: null,
    },
    variant: {
      default:
        "bg-surface dark:border-border-surface border-border-surface shadow-md",
      inverted: "bg-background/35 border-border-surface",
    },
  },
});

type BoxVariants = VariantProps<typeof cvaBox>;

interface IProps extends ComponentPropsWithoutRef<"div">, BoxVariants {}

export default function Box({
  children,
  className,
  hoverable,
  size,
  variant,
  ...props
}: IProps) {
  return (
    <div
      className={cvaBox({
        className,
        hoverable,
        size,
        variant,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
