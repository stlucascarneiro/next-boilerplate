import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiChevronDown, FiSettings, FiUser } from "react-icons/fi";
import { expect, waitFor } from "storybook/test";
import { Dropdown } from "../../shared/Dropdown.client";

type DropdownStoryArgs = {
  placement?: "left" | "right";
};

function getDropdownSource(placement: "left" | "right") {
  return `
    <Dropdown placement="${placement}">
      <Dropdown.Trigger
        icon={<FiChevronDown />}
        iconPlacement="right"
        variant="secondary"
      >
        Open menu
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<FiUser />}>Edit profile</Dropdown.Item>
        <Dropdown.Item icon={<FiSettings />}>Account settings</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  `;
}

function DropdownStoryExample({ placement = "right" }: DropdownStoryArgs) {
  return (
    <Dropdown placement={placement}>
      <Dropdown.Trigger
        icon={<FiChevronDown />}
        iconPlacement="right"
        variant="secondary"
      >
        Open menu
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item icon={<FiUser />}>Edit profile</Dropdown.Item>
        <Dropdown.Item icon={<FiSettings />}>Account settings</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}

const meta = {
  args: {
    placement: "right",
  },
  argTypes: {
    placement: {
      control: { type: "inline-radio" },
      description:
        "Horizontal alignment of the dropdown content relative to the trigger.",
      options: ["left", "right"],
      table: {
        defaultValue: { summary: "right" },
      },
    },
  },
  component: DropdownStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Compound dropdown component with trigger, content, and item slots for building contextual action menus. Supports left/right alignment and optional item icons.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Dropdown",
} satisfies Meta<DropdownStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: /open menu/i });

    await expect(
      canvas.queryByRole("button", { name: /edit profile/i }),
    ).toBeNull();

    await userEvent.click(trigger);
    await expect(
      canvas.getByRole("button", { name: /edit profile/i }),
    ).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        canvas.queryByRole("button", { name: /edit profile/i }),
      ).toBeNull();
    });
  },
  parameters: {
    docs: {
      source: {
        code: getDropdownSource("right"),
      },
    },
  },
};

export const LeftAligned: Story = {
  args: {
    placement: "left",
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: /open menu/i });

    await userEvent.click(trigger);
    await expect(
      canvas.getByRole("button", { name: /account settings/i }),
    ).toBeInTheDocument();

    await userEvent.click(document.body);
    await waitFor(() => {
      expect(
        canvas.queryByRole("button", { name: /account settings/i }),
      ).toBeNull();
    });
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use left placement when the dropdown should expand from the trigger's left edge.",
      },
      source: {
        code: getDropdownSource("left"),
      },
    },
  },
};
