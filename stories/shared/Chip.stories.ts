import Chip from "@/shared/Chip.client";
import { COLORS } from "@/shared/constants/colors.data";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";

const meta = {
  args: {
    children: "Chip text",
    clickable: false,
    color: "neutral",
    onClick: fn(),
  },
  argTypes: {
    children: {
      control: "text",
      description: "Content displayed inside the chip.",
    },
    clickable: {
      control: "boolean",
      description:
        "Enables interactive visual state and shows a dismiss icon on the right.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    color: {
      control: { type: "select" },
      description: "Visual color token applied to the chip.",
      options: COLORS,
      table: {
        defaultValue: { summary: "neutral" },
      },
    },
    onClick: {
      action: "clicked",
      description: "Callback fired when the chip is clicked.",
    },
  },
  component: Chip,
  parameters: {
    docs: {
      description: {
        component:
          "Compact label component for tags and statuses, with optional clickable behavior.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Chip",
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Chip text",
  },
  parameters: {
    docs: {
      description: {
        story: "Static chip for non-interactive labels.",
      },
    },
  },
  play: async ({ canvas }) => {
    const chipText = canvas.getByText(/chip text/i);
    const chipElement = chipText.closest("div");

    await expect(chipElement).not.toBeNull();
    await expect(chipElement?.querySelector("svg")).toBeNull();
  },
};

export const Clickable: Story = {
  args: {
    children: "Clickable chip",
    clickable: true,
    onClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive chip variant that displays a dismiss icon and supports click handling.",
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const chipText = canvas.getByText(/clickable chip/i);
    const chipElement = chipText.closest("div");

    await expect(chipElement).not.toBeNull();
    await expect(chipElement?.querySelector("svg")).not.toBeNull();
    await userEvent.click(chipText);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
