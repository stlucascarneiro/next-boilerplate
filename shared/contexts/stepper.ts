import { createContext, useContext } from "react";

interface IStepperContextStep {
  description?: string;
  label: string;
}

export interface IStepperContext {
  cancel: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  currentStep: number;
  goNext: () => void;
  goPrevious: () => void;
  progress: number;
  saveDraft: () => void;
  steps: IStepperContextStep[];
  totalSteps: number;
}

export const StepperContext = createContext<IStepperContext | null>(null);

export function useStepper() {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("Stepper components must be used within Stepper");
  }

  return context;
}
