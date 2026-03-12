import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiArrowRight, FiPlus, FiTrash2 } from "react-icons/fi";
import { PiHouseDuotone, PiPlusBold, PiTrashDuotone } from "react-icons/pi";
import { fn } from "storybook/test";
import Button from "../../shared/Button.client";

const iconOptions = {
  ArrowRight: FiArrowRight,
  None: undefined,
  Plus: FiPlus,
  Trash: FiTrash2,
} as const;

const meta = {
  args: {
    children: "Continue",
    disabled: false,
    icon: undefined,
    iconPlacement: "left",
    loading: false,
    onClick: fn(),
    size: "md",
    variant: "primary",
  },
  argTypes: {
    children: {
      control: "text",
      description: "Text content displayed inside the button.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the button manually.",
    },
    icon: {
      control: { type: "select" },
      description: "Optional icon rendered alongside the content.",
      mapping: iconOptions,
      options: Object.keys(iconOptions),
    },
    iconPlacement: {
      control: { type: "inline-radio" },
      description: "Icon position relative to the text.",
      options: ["left", "right"],
    },
    loading: {
      control: "boolean",
      description: "Replaces the icon with a spinner and blocks interaction.",
    },
    onClick: {
      action: "clicked",
      description: "Callback triggered on click.",
    },
    size: {
      control: { type: "inline-radio" },
      description: "Available button size.",
      options: ["sm", "md", "lg"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
    variant: {
      control: { type: "select" },
      description: "Visual style variant applied to the button.",
      options: ["primary", "secondary", "ghost", "ghost_primary", "danger"],
      table: {
        defaultValue: { summary: "primary" },
      },
    },
    width: {
      control: { type: "inline-radio" },
      description: "Width behavior of the button.",
      options: ["fit", "full"],
    },
  },
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          "Reusable button with visual variants, sizes, loading state, and optional icon support.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Button",
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const GhostWithIcon: Story = {
  args: {
    icon: <PiHouseDuotone />,
    iconPlacement: "right",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete item",
    icon: <PiTrashDuotone />,
    variant: "danger",
  },
};

export const Loading: Story = {
  args: {
    children: "Saving",
    icon: <PiPlusBold />,
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    variant: "secondary",
  },
};

export const IconOnly: Story = {
  args: {
    children: undefined,
    icon: <PiHouseDuotone />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no children are provided, the component automatically switches to the icon size.",
      },
    },
  },
};
