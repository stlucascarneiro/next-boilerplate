"use client";

import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";

type UseOpenAnimationParams = {
  enabled: boolean;
  keyframes?: Parameters<ReturnType<typeof useAnimate>[1]>[1];
  options?: Parameters<ReturnType<typeof useAnimate>[1]>[2];
};

const defaultKeyframes = {
  opacity: [0, 1],
  top: [20, "100%"],
};

const defaultOptions = {
  duration: 0.3,
  ease: "easeInOut",
} as const;

export function useOpenAnimation({
  enabled,
  keyframes = defaultKeyframes,
  options = defaultOptions,
}: UseOpenAnimationParams) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!enabled || !scope.current) return;

    animate(scope.current, keyframes, options);
  }, [animate, enabled, keyframes, options, scope]);

  return scope;
}
