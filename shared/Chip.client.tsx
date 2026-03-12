"use client";

import { cva, VariantProps } from "cva";
import { ReactNode } from "react";
import { PiXBold } from "react-icons/pi";
import { TColor } from "./types/styles.type";

const cvaChip = cva(
  [
    "surface flex w-fit items-center gap-2 rounded-sm px-3 py-1 text-sm font-medium duration-200",
  ],
  {
    variants: {
      clickable: {
        false: null,
        true: "cursor-pointer clickable",
      },
    },
  },
);

type ChipProps = VariantProps<typeof cvaChip>;

interface IProps extends ChipProps {
  children: ReactNode;
  color?: TColor;
  onClick?: () => void;
}

export default function Chip({
  children,
  clickable,
  color = "neutral",
  onClick,
}: IProps) {
  return (
    <div
      className={cvaChip({ className: [color], clickable })}
      onClick={onClick}
    >
      <span className="w-max text-xs">{children}</span>
      {clickable && <PiXBold />}
    </div>
  );
}
