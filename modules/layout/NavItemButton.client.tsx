"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { PiCaretRightBold } from "react-icons/pi";

interface IProps {
  href: string;
  icon?: IconType;
  isActive: boolean;
  label: string;
  onNavigate?: () => void;
}

export default function NavItemButton({
  href,
  icon: Icon,
  isActive,
  label,
  onNavigate,
}: IProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={`group focus-visible:ring-primary/50 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none ${
        isActive
          ? "bg-primary/10 dark:bg-strong/10 text-primary dark:text-strong"
          : "text-text hover:bg-strong/5 hover:text-strong"
      }`}
      href={href}
      onClick={onNavigate}
    >
      {Icon ? (
        <Icon
          aria-hidden="true"
          className={`shrink-0 text-lg transition-colors duration-200 ${
            isActive ? "text-primary" : "text-text group-hover:text-strong"
          }`}
        />
      ) : null}
      <span className="grow translate-y-px truncate text-base">{label}</span>
      {!isActive && (
        <PiCaretRightBold className="opacity-0 duration-300 group-hover:opacity-100" />
      )}
    </Link>
  );
}
