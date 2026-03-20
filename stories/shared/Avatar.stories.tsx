import { COLORS } from "@/shared/constants/colors.data";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import Avatar from "../../shared/Avatar";

const avatarImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect width='48' height='48' rx='24' fill='%23e2e8f0'/%3E%3Ccircle cx='24' cy='18' r='8' fill='%2364748b'/%3E%3Cpath d='M10%2040c2.8-6.7%208.2-10%2014-10s11.2%203.3%2014%2010' fill='%2364748b'/%3E%3C/svg%3E";

const meta = {
  args: {
    items: [
      { color: "sky", name: "John Doe" },
      { color: "emerald", name: "Maria Silva" },
      { color: "amber", name: "Pedro Costa" },
    ],
    size: "md",
    spacing: "md",
  },
  argTypes: {
    className: {
      control: "text",
      description: "Additional classes applied to the avatars container.",
    },
    items: {
      control: "object",
      description:
        "List of avatar objects. Renders up to 3 avatars, and if there are more, appends a +N counter avatar.",
      table: {
        type: {
          summary:
            "Array<{ name: string; image?: string; color?: AvatarColor }>",
        },
      },
    },
    size: {
      control: { type: "inline-radio" },
      description: "Avatar size for initials, images and overflow counter.",
      options: ["sm", "md", "lg"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
    spacing: {
      control: { type: "inline-radio" },
      description: "Horizontal overlap spacing between stacked avatars.",
      options: ["sm", "md", "lg"],
      table: {
        defaultValue: { summary: "md" },
      },
    },
  },
  component: Avatar,
  parameters: {
    docs: {
      description: {
        component:
          "Avatar group that stacks users with overlap, keeping the first user in front. Supports initials or image per item.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Avatar",
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialsOnly: Story = {
  args: {
    items: [
      { color: "sky", name: "John Doe" },
      { color: "emerald", name: "Maria Silva" },
      { color: "amber", name: "Pedro Costa" },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("JD")).toBeInTheDocument();
    await expect(canvas.getByText("MS")).toBeInTheDocument();
    await expect(canvas.getByText("PC")).toBeInTheDocument();
  },
};

export const WithImage: Story = {
  args: {
    items: [
      { image: avatarImage, name: "John Doe" },
      { color: "violet", name: "Maria Silva" },
      { color: "teal", name: "Pedro Costa" },
    ],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("img", { name: /john doe/i }),
    ).toBeInTheDocument();
    await expect(canvas.getByText("MS")).toBeInTheDocument();
    await expect(canvas.getByText("PC")).toBeInTheDocument();
  },
};

export const SingleAvatar: Story = {
  args: {
    items: [{ color: "emerald", name: "John Doe" }],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("JD")).toBeInTheDocument();
  },
};

export const WithOverflowCounter: Story = {
  args: {
    items: [
      { color: "sky", name: "John Doe" },
      { color: "emerald", name: "Maria Silva" },
      { color: "amber", name: "Pedro Costa" },
      { color: "pink", name: "Ana Souza" },
      { color: "red", name: "Bruno Lima" },
      { color: "blue", name: "Carlos Dias" },
      { color: "green", name: "Davi Nunes" },
    ],
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByText("JD")).toBeInTheDocument();
    await expect(canvas.getByText("MS")).toBeInTheDocument();
    await expect(canvas.getByText("PC")).toBeInTheDocument();
    await expect(canvas.getByText("+4")).toBeInTheDocument();
  },
};

export const ColorsReference: Story = {
  parameters: {
    docs: {
      description: {
        story: "Visual reference for all available color variants.",
      },
    },
  },
  render: () => (
    <div className="grid grid-cols-3 gap-3">
      {COLORS.map((color) => (
        <Avatar items={[{ color, name: `${color} user` }]} key={color} />
      ))}
    </div>
  ),
};

export const SizeVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: "Compares small, medium and large avatar sizes.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Avatar
        items={[
          { color: "sky", name: "John Doe" },
          { color: "emerald", name: "Maria Silva" },
          { color: "amber", name: "Pedro Costa" },
        ]}
        size="sm"
      />
      <Avatar
        items={[
          { color: "sky", name: "John Doe" },
          { color: "emerald", name: "Maria Silva" },
          { color: "amber", name: "Pedro Costa" },
        ]}
        size="md"
      />
      <Avatar
        items={[
          { color: "sky", name: "John Doe" },
          { color: "emerald", name: "Maria Silva" },
          { color: "amber", name: "Pedro Costa" },
        ]}
        size="lg"
      />
    </div>
  ),
};

export const SpacingVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: "Compares overlap spacing variants between stacked avatars.",
      },
    },
  },
  render: () => (
    <div className="flex flex-col gap-4">
      <Avatar
        items={[
          { color: "sky", name: "John Doe" },
          { color: "emerald", name: "Maria Silva" },
          { color: "amber", name: "Pedro Costa" },
          { color: "pink", name: "Ana Souza" },
        ]}
        spacing="sm"
      />
      <Avatar
        items={[
          { color: "sky", name: "John Doe" },
          { color: "emerald", name: "Maria Silva" },
          { color: "amber", name: "Pedro Costa" },
          { color: "pink", name: "Ana Souza" },
        ]}
        spacing="md"
      />
      <Avatar
        items={[
          { color: "sky", name: "John Doe" },
          { color: "emerald", name: "Maria Silva" },
          { color: "amber", name: "Pedro Costa" },
          { color: "pink", name: "Ana Souza" },
        ]}
        spacing="lg"
      />
    </div>
  ),
};
