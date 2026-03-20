import ToastProvider, {
  type ToastPosition,
  type ToastVariant,
  useToast,
} from "@/shared/Toast.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";

type ToastStoryArgs = {
  position?: ToastPosition;
};

const VARIANTS: {
  description: string;
  label: string;
  variant: ToastVariant;
}[] = [
  {
    description: "Changes saved successfully.",
    label: "Success",
    variant: "success",
  },
  {
    description: "Your session will expire in 5 minutes.",
    label: "Info",
    variant: "info",
  },
  {
    description: "This action may have side effects.",
    label: "Warning",
    variant: "warning",
  },
  {
    description: "Something went wrong. Please try again.",
    label: "Error",
    variant: "error",
  },
];

function getSetupSource(position: ToastPosition) {
  return `
// 1. Wrap your app (or layout) with ToastProvider
<ToastProvider position="${position}">
  {children}
</ToastProvider>

// 2. Use the hook in any child component
function SaveButton() {
  const { showToast } = useToast();

  return (
    <button
      onClick={() =>
        showToast({
          description: "Your changes have been saved.",
          title: "Saved!",
          variant: "success",
        })
      }
    >
      Save
    </button>
  );
}`;
}

function ToastTriggers() {
  const { showToast } = useToast();

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-subtle text-sm">
        Click a button to fire a toast notification.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {VARIANTS.map(({ description, label, variant }) => (
          <button
            className="cursor-pointer rounded-sm px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
            key={variant}
            onClick={() =>
              showToast({
                description,
                title: label,
                variant,
              })
            }
            style={{
              background:
                variant === "success"
                  ? "var(--color-success)"
                  : variant === "error"
                    ? "var(--color-error)"
                    : variant === "warning"
                      ? "var(--color-warning)"
                      : "var(--color-primary)",
              color: "#fff",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToastStoryExample({ position = "top-right" }: ToastStoryArgs) {
  return (
    <ToastProvider position={position}>
      <ToastTriggers />
    </ToastProvider>
  );
}

const meta = {
  args: {
    position: "top-right",
  },
  argTypes: {
    position: {
      control: { type: "select" },
      description: "Where toast notifications appear on the screen.",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
      table: {
        defaultValue: { summary: "top-right" },
      },
    },
  },
  component: ToastStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Provider-based toast notification system. Wrap the app with `ToastProvider` and trigger notifications from any child via the `useToast` hook. Supports four variants and six screen positions.",
      },
      story: {
        height: "220px",
        inline: false,
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Toast",
} satisfies Meta<ToastStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive demo — click each button to fire the corresponding toast variant.",
      },
      source: {
        code: getSetupSource("top-right"),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^success$/i }));

    await expect(canvas.getByRole("alert")).toBeInTheDocument();
    await expect(
      canvas.getByText(/changes saved successfully\./i),
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: /close toast/i }));
    await waitFor(() => {
      expect(canvas.queryByRole("alert")).toBeNull();
    });
  },
};

export const BottomRight: Story = {
  args: {
    position: "bottom-right",
  },
  parameters: {
    docs: {
      description: {
        story: "Bottom-right placement, useful for app-style notifications.",
      },
      source: {
        code: getSetupSource("bottom-right"),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^error$/i }));

    await expect(canvas.getByRole("alert")).toBeInTheDocument();
    await expect(
      canvas.getByText(/something went wrong\. please try again\./i),
    ).toBeInTheDocument();
  },
};

export const BottomCenter: Story = {
  args: {
    position: "bottom-center",
  },
  parameters: {
    docs: {
      description: {
        story: "Bottom-center placement, common in mobile-first layouts.",
      },
      source: {
        code: getSetupSource("bottom-center"),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: /^success$/i }));
    await userEvent.click(canvas.getByRole("button", { name: /^info$/i }));
    await userEvent.click(canvas.getByRole("button", { name: /^warning$/i }));
    await userEvent.click(canvas.getByRole("button", { name: /^error$/i }));

    await expect(canvas.getAllByRole("alert")).toHaveLength(3);
  },
};
