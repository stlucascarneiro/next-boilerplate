import Box from "@/shared/Box";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type BoxStoryArgs = {
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8;
  layout?: "col" | "none" | "row";
  padding?: "lg" | "md" | "none" | "sm";
  shadow?: "lg" | "md" | "none" | "sm";
};

const meta = {
  args: {
    gap: 4,
    layout: "col",
    padding: "md",
    shadow: "md",
  },
  argTypes: {
    gap: {
      control: { type: "inline-radio" },
      description: "Space between children when a flex layout is applied.",
      options: [0, 1, 2, 3, 4, 6, 8],
      table: {
        defaultValue: { summary: "4" },
      },
    },
    layout: {
      control: { type: "inline-radio" },
      description: "Layout mode used to arrange children.",
      options: ["col", "row", "none"],
      table: {
        defaultValue: { summary: "col" },
      },
    },
    padding: {
      control: { type: "inline-radio" },
      description: "Internal spacing applied to the container.",
      options: ["none", "sm", "md", "lg"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
    shadow: {
      control: { type: "inline-radio" },
      description: "Shadow intensity applied to the container.",
      options: ["none", "sm", "md", "lg"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
  },
  component: Box,
  parameters: {
    docs: {
      description: {
        component:
          "Reusable surface container with layout, spacing, and elevation variants for composing UI sections.",
      },
    },
    layout: "centered",
  },
  render: ({ gap, layout, padding, shadow }) => (
    <Box
      className="text-text w-85"
      gap={gap}
      layout={layout}
      padding={padding}
      shadow={shadow}
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
} satisfies Meta<BoxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: "Default stacked container with medium padding and shadow.",
      },
    },
  },
};

export const RowLayout: Story = {
  args: {
    layout: "row",
  },
  parameters: {
    docs: {
      description: {
        story: "Horizontal arrangement for compact grouped content.",
      },
    },
  },
};

export const FlatContainer: Story = {
  args: {
    padding: "sm",
    shadow: "none",
  },
  parameters: {
    docs: {
      description: {
        story: "Low-emphasis container with minimal spacing and no shadow.",
      },
    },
  },
};
