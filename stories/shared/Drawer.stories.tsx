import Drawer from "@/shared/Drawer.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiMenu } from "react-icons/fi";

type DrawerStoryArgs = {
  placement?: "left" | "right";
};

function getDrawerSource(placement: "left" | "right") {
  return `
<Drawer placement="${placement}">
  <Drawer.Trigger icon={FiMenu} iconPlacement="left" variant="secondary">
    Open drawer
  </Drawer.Trigger>

  <Drawer.Content>
    <div className="flex h-full flex-col gap-4 p-4">
      <h3 className="text-base font-semibold">Drawer title</h3>
      <p className="text-sm text-subtle">Use this area for contextual actions or details.</p>

      <div className="mt-auto">
        <Drawer.Close variant="primary">Close drawer</Drawer.Close>
      </div>
    </div>
  </Drawer.Content>
</Drawer>`;
}

function DrawerStoryExample({ placement = "right" }: DrawerStoryArgs) {
  return (
    <Drawer placement={placement}>
      <Drawer.Trigger
        icon={<FiMenu />}
        iconPlacement="left"
        variant="secondary"
      >
        Open drawer
      </Drawer.Trigger>

      <Drawer.Content>
        <div className="flex h-full flex-col gap-4 p-4">
          <h3 className="text-base font-semibold">Drawer title</h3>
          <p className="text-subtle text-sm">
            Use this area for contextual actions or details.
          </p>

          <div className="mt-auto">
            <Drawer.Close variant="primary">Close drawer</Drawer.Close>
          </div>
        </div>
      </Drawer.Content>
    </Drawer>
  );
}

const meta = {
  args: {
    placement: "right",
  },
  argTypes: {
    placement: {
      control: { type: "inline-radio" },
      description: "Side where the drawer panel appears.",
      options: ["left", "right"],
      table: {
        defaultValue: { summary: "right" },
      },
    },
  },
  component: DrawerStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Compound drawer component with Trigger, Content, and Close slots. It supports left and right placement with overlay dismissal.",
      },
      story: {
        height: "520px",
        inline: false,
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Drawer",
} satisfies Meta<DrawerStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      source: {
        code: getDrawerSource("right"),
      },
    },
  },
};

export const LeftPlacement: Story = {
  args: {
    placement: "left",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use left placement when the panel should slide in from the left side.",
      },
      source: {
        code: getDrawerSource("left"),
      },
    },
  },
};
