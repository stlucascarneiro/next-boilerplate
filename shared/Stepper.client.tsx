"use client";

import { type ReactNode, useCallback, useMemo, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaFloppyDisk } from "react-icons/fa6";
import Button from "./Button.client";
import { StepperContext, useStepper } from "./contexts/stepper";

interface IStepperStep {
  description?: string;
  label: string;
}

interface IStepperSnapshot {
  currentStep: number;
  progress: number;
  savedAt: string;
  totalSteps: number;
}

interface IStepperBaseProps {
  cacheKey?: string;
  children: ReactNode;
  className?: string;
  defaultStep?: number;
  onCancel?: () => void;
  onSaveDraft?: (snapshot: IStepperSnapshot) => void;
  onStepChange?: (step: number) => void;
  steps: IStepperStep[];
  value?: number;
}

interface IStepperHeaderProps {
  className?: string;
}

interface IStepperBodyProps {
  children: ReactNode;
  className?: string;
}

interface IStepperFooterProps {
  backLabel?: ReactNode;
  cancelLabel?: ReactNode;
  className?: string;
  nextLabel?: ReactNode;
  saveLabel?: ReactNode;
}

type StepperCompoundComponent = ((props: IStepperBaseProps) => ReactNode) & {
  Body: (props: IStepperBodyProps) => ReactNode;
  Footer: (props: IStepperFooterProps) => ReactNode;
  Header: (props: IStepperHeaderProps) => ReactNode;
};

function clampStep(step: number, totalSteps: number) {
  if (totalSteps <= 0) return 0;
  return Math.min(Math.max(step, 0), totalSteps - 1);
}

function StepperBase({
  cacheKey = "stepper-progress",
  children,
  className,
  defaultStep = 0,
  onCancel,
  onSaveDraft,
  onStepChange,
  steps,
  value,
}: IStepperBaseProps) {
  const totalSteps = steps.length;
  const isControlled = value !== undefined;

  const [internalStep, setInternalStep] = useState(() =>
    clampStep(defaultStep, totalSteps),
  );

  const currentStep = clampStep(
    isControlled ? (value ?? 0) : internalStep,
    totalSteps,
  );

  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < totalSteps - 1;
  const progress =
    totalSteps <= 1
      ? totalSteps === 1
        ? 100
        : 0
      : (currentStep / (totalSteps - 1)) * 100;

  const setStep = useCallback(
    (step: number) => {
      const nextStep = clampStep(step, totalSteps);

      if (!isControlled) {
        setInternalStep(nextStep);
      }

      if (nextStep !== currentStep) {
        onStepChange?.(nextStep);
      }
    },
    [currentStep, isControlled, onStepChange, totalSteps],
  );

  const goPrevious = useCallback(() => {
    setStep(currentStep - 1);
  }, [currentStep, setStep]);

  const goNext = useCallback(() => {
    setStep(currentStep + 1);
  }, [currentStep, setStep]);

  const cancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  const saveDraft = useCallback(() => {
    const snapshot: IStepperSnapshot = {
      currentStep,
      progress,
      savedAt: new Date().toISOString(),
      totalSteps,
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(cacheKey, JSON.stringify(snapshot));
    }

    onSaveDraft?.(snapshot);
  }, [cacheKey, currentStep, onSaveDraft, progress, totalSteps]);

  const contextValue = useMemo(
    () => ({
      cancel,
      canGoBack,
      canGoNext,
      currentStep,
      goNext,
      goPrevious,
      progress,
      saveDraft,
      steps,
      totalSteps,
    }),
    [
      canGoBack,
      canGoNext,
      cancel,
      currentStep,
      goNext,
      goPrevious,
      progress,
      saveDraft,
      steps,
      totalSteps,
    ],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <section className={className}>{children}</section>
    </StepperContext.Provider>
  );
}

function StepperHeader({ className }: IStepperHeaderProps) {
  const { currentStep, progress, steps } = useStepper();

  return (
    <header
      className={["flex flex-col gap-3", className].filter(Boolean).join(" ")}
    >
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3" role="list">
          {steps.map((step, index) => {
            const isDone = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isDone || isCurrent
                    ? "bg-primary text-white"
                    : "bg-background border-border-surface text-subtle border",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={`${step.label}-${index}`}
                role="listitem"
              >
                {isDone ? "\u2713" : index + 1}
              </div>
            );
          })}
        </div>

        <span className="text-subtle min-w-24 text-right text-sm">
          {Math.round(progress)}% complete
        </span>
      </div>

      <div className="bg-border-surface h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary h-full rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  );
}

function StepperBody({ children, className }: IStepperBodyProps) {
  return (
    <main className={["min-h-36 py-6", className].filter(Boolean).join(" ")}>
      {children}
    </main>
  );
}

function StepperFooter({
  backLabel = "Back",
  cancelLabel = "Cancel",
  className,
  nextLabel = "Next step",
  saveLabel = "Save draft",
}: IStepperFooterProps) {
  const { cancel, canGoBack, canGoNext, goNext, goPrevious, saveDraft } =
    useStepper();

  return (
    <footer
      className={[
        "flex flex-wrap items-center justify-between gap-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Button
        disabled={!canGoBack}
        icon={<FaArrowLeft className="text-sm" />}
        onClick={goPrevious}
        size="lg"
        variant="ghost"
      >
        {backLabel}
      </Button>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          icon={<FaFloppyDisk />}
          onClick={saveDraft}
          size="lg"
          variant="secondary"
        >
          {saveLabel}
        </Button>

        <Button onClick={cancel} size="lg" variant="ghost">
          {cancelLabel}
        </Button>

        <Button
          disabled={!canGoNext}
          icon={<FaArrowRight className="translate-y-px text-sm" />}
          iconPlacement="right"
          onClick={goNext}
          size="lg"
          variant="primary"
        >
          {nextLabel}
        </Button>
      </div>
    </footer>
  );
}

const Stepper = StepperBase as StepperCompoundComponent;

Stepper.Header = StepperHeader;
Stepper.Body = StepperBody;
Stepper.Footer = StepperFooter;

export { useStepper };
export type { IStepperBaseProps, IStepperSnapshot, IStepperStep };
export default Stepper;
