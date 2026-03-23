import Box from "@/shared/Box";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  args: {
    hoverable: false,
    size: "md",
    variant: "default",
  },
  argTypes: {
    hoverable: {
      control: "boolean",
      description: "Enables a subtle lift and border emphasis on hover.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    size: {
      control: { type: "inline-radio" },
      description: "Controls internal spacing and corner radius.",
      options: ["sm", "md", "lg", "unstyled"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
    variant: {
      control: { type: "inline-radio" },
      description: "Visual style of the surface.",
      options: ["default", "inverted"],
      table: {
        defaultValue: { summary: "default" },
      },
    },
  },
  component: Box,
  parameters: {
    docs: {
      description: {
        component:
          "Reusable surface/card container with style, size, and optional hover emphasis variants.",
      },
    },
    layout: "centered",
  },
  render: ({ hoverable, size, variant }) => (
    <Box
      className="text-text flex w-85 flex-col gap-3"
      hoverable={hoverable}
      size={size}
      variant={variant}
    >
      <div className="bg-primary/10 text-strong rounded-sm px-3 py-2 text-sm font-medium">
        Header
      </div>
      <div className="bg-muted/60 rounded-sm px-3 py-2 text-sm">
        Body content area
      </div>
      <div className="bg-muted/60 rounded-sm px-3 py-2 text-sm">
        Secondary content
      </div>
    </Box>
  ),
  tags: ["autodocs"],
  title: "Shared/Box",
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default surface with medium spacing and elevation.",
      },
    },
  },
};

export const Inverted: Story = {
  args: {
    variant: "inverted",
  },
  parameters: {
    docs: {
      description: {
        story: "Alternative lower-emphasis surface style.",
      },
    },
  },
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
    size: "lg",
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive surface with hover feedback for clickable cards.",
      },
    },
  },
};

export const Unstyled: Story = {
  args: {
    size: "unstyled",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Removes spacing and radius styles, useful for fully custom compositions.",
      },
    },
  },
};
