import Chip from "@/shared/Chip.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

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
      options: [
        "amber",
        "blue",
        "cyan",
        "emerald",
        "fuchsia",
        "gray",
        "green",
        "indigo",
        "lime",
        "neutral",
        "orange",
        "pink",
        "purple",
        "red",
        "rose",
        "sky",
        "slate",
        "stone",
        "teal",
        "violet",
        "yellow",
        "zinc",
      ],
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
};

export const Clickable: Story = {
  args: {
    children: "Clickable chip",
    clickable: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive chip variant that displays a dismiss icon and supports click handling.",
      },
    },
  },
};
