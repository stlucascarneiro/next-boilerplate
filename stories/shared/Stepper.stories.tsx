import Stepper, {
  type IStepperStep,
  useStepper,
} from "@/shared/Stepper.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

const DEFAULT_STEPS: IStepperStep[] = [
  { label: "First step" },
  { label: "Second step" },
  { label: "Third step" },
  { label: "Final step" },
];

function getDefaultStepperSource() {
  return `
<Stepper steps={steps}>
  <Stepper.Header />

  <Stepper.Body>
    <StepContent />
  </Stepper.Body>

  <Stepper.Footer />
</Stepper>`;
}

function getFinalStepSource() {
  return `
<Stepper defaultStep={3} steps={steps}>
  <Stepper.Header />
  <Stepper.Body>
    <StepContent />
  </Stepper.Body>
  <Stepper.Footer />
</Stepper>`;
}

function StepContent() {
  const { currentStep, steps } = useStepper();

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">{steps[currentStep]?.label}</h3>
      <p className="text-subtle text-sm">
        Step {currentStep + 1} content. This is where you would put the form
        fields or other content for this step.
      </p>
    </div>
  );
}

function StepperStoryExample() {
  return (
    <Stepper steps={DEFAULT_STEPS}>
      <Stepper.Header />
      <Stepper.Body>
        <StepContent />
      </Stepper.Body>
      <Stepper.Footer />
    </Stepper>
  );
}

const meta = {
  component: StepperStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Compound component para fluxo de etapas com Header, Body e Footer. O Footer controla a navegacao entre etapas e permite salvar rascunho.",
      },
    },
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Shared/Stepper",
} satisfies Meta<typeof StepperStoryExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Fluxo principal: avancar e voltar etapas usando os botoes do Footer.",
      },
      source: {
        code: getDefaultStepperSource(),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText(/step 1 of 4/i)).toBeInTheDocument();
    await expect(canvas.getByText(/first step/i)).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: /proxima etapa/i }),
    );

    await expect(canvas.getByText(/etapa 2 de 4/i)).toBeInTheDocument();
    await expect(canvas.getByText(/participantes/i)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /voltar/i }));

    await expect(canvas.getByText(/etapa 1 de 4/i)).toBeInTheDocument();
  },
  render: () => <StepperStoryExample />,
};

export const FinalStep: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Estado de borda: quando inicia na ultima etapa, Proxima etapa fica desabilitado.",
      },
      source: {
        code: getFinalStepSource(),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const nextButton = canvas.getByRole("button", { name: /proxima etapa/i });

    await expect(canvas.getByText(/etapa 4 de 4/i)).toBeInTheDocument();
    await expect(nextButton).toBeDisabled();

    await userEvent.click(canvas.getByRole("button", { name: /voltar/i }));

    await expect(canvas.getByText(/etapa 3 de 4/i)).toBeInTheDocument();
    await expect(nextButton).not.toBeDisabled();
  },
  render: () => (
    <Stepper defaultStep={3} steps={DEFAULT_STEPS}>
      <Stepper.Header />
      <Stepper.Body>
        <StepContent />
      </Stepper.Body>
      <Stepper.Footer />
    </Stepper>
  ),
};
