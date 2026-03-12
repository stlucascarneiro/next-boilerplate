"use client";

import { useEffect } from "react";

type UseClickOutsideParams<T extends HTMLElement> = {
  enabled?: boolean;
  onEscape?: () => void;
  onOutsideClick: () => void;
  ref: React.RefObject<null | T>;
};

export function useClickOutside<T extends HTMLElement>({
  enabled = true,
  onEscape,
  onOutsideClick,
  ref,
}: UseClickOutsideParams<T>) {
  useEffect(() => {
    if (!enabled) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!ref.current?.contains(target)) {
        onOutsideClick();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscape?.();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onEscape, onOutsideClick, ref]);
}
