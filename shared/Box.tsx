import { cva, type VariantProps } from "cva";
import { type ComponentPropsWithoutRef } from "react";

const cvaBox = cva(
  [
    "bg-surface dark:border-border-surface rounded-lg border border-solid border-transparent duration-300",
  ],
  {
    defaultVariants: {
      gap: 4,
      layout: "col",
      padding: "md",
      shadow: "md",
    },
    variants: {
      gap: {
        0: null,
        1: "gap-1",
        2: "gap-2",
        3: "gap-3",
        4: "gap-4",
        6: "gap-6",
        8: "gap-8",
      },
      layout: {
        col: "flex flex-col",
        none: null,
        row: "flex flex-row",
      },
      padding: {
        lg: "p-4 md:p-5",
        md: "p-3 md:p-4",
        none: "p-0",
        sm: "p-2 md:p-3",
      },
      shadow: {
        lg: "shadow-lg",
        md: "shadow-md",
        none: null,
        sm: "shadow-sm",
      },
    },
  },
);

type BoxVariants = VariantProps<typeof cvaBox>;

interface IProps extends ComponentPropsWithoutRef<"div">, BoxVariants {}

export default function Box({
  children,
  className,
  gap,
  layout,
  padding,
  shadow,
  ...props
}: IProps) {
  return (
    <div
      className={cvaBox({ className, gap, layout, padding, shadow })}
      {...props}
    >
      {children}
    </div>
  );
}
