import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import Switch from "../../shared/Switch.client";

type SwitchStoryArgs = {
  checked?: boolean;
  className?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  label: string;
  name: string;
  onChange?: (checked: boolean) => void;
  required?: boolean;
};

function getSwitchSource(args: SwitchStoryArgs) {
  const required = args.required ? "\n  required" : "";
  const disabled = args.disabled ? "\n  disabled" : "";
  const defaultChecked = args.defaultChecked ? "\n  defaultChecked" : "";
  const className = args.className ? `\n  className=\"${args.className}\"` : "";

  return `
<Switch
  label=\"${args.label}\"
  name=\"${args.name}\"${required}${disabled}${defaultChecked}${className}
/>`;
}

function SwitchStoryExample({ onChange, ...args }: SwitchStoryArgs) {
  return (
    <div className="w-80">
      <Switch {...args} onChange={onChange} />
    </div>
  );
}

const meta = {
  args: {
    checked: undefined,
    className: "",
    defaultChecked: false,
    disabled: false,
    label: "Enable email notifications",
    name: "email-notifications",
    onChange: fn(),
    required: false,
  },
  argTypes: {
    checked: {
      control: "boolean",
      description:
        "Controlled checked state. Leave undefined to use uncontrolled mode.",
    },
    className: {
      control: "text",
      description: "Optional class name applied to the component wrapper.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial checked state for uncontrolled usage.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    disabled: {
      control: "boolean",
      description: "Disables interaction with the switch.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "Visible label associated to the switch input.",
    },
    name: {
      control: "text",
      description: "Used as input name and as part of the generated id.",
    },
    onChange: {
      action: "changed",
      description: "Callback fired with the next checked state.",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required for native form validation.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
  component: SwitchStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Accessible switch component built on top of a native checkbox with switch semantics and keyboard support.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Switch",
} satisfies Meta<SwitchStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onChange: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: getSwitchSource({
          defaultChecked: false,
          disabled: false,
          label: "Enable email notifications",
          name: "email-notifications",
          required: false,
        }),
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: /enable email notifications/i,
    });

    args.onChange?.mockClear();

    await expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
    await expect(args.onChange).toHaveBeenCalledWith(true);
  },
};

export const CheckedByDefault: Story = {
  args: {
    defaultChecked: true,
    label: "Enable dark mode",
    name: "dark-mode",
    onChange: fn(),
  },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: /enable dark mode/i,
    });

    await expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Enable push notifications",
    name: "push-notifications",
    onChange: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole("switch", {
      name: /enable push notifications/i,
    });

    args.onChange?.mockClear();

    await expect(toggle).toBeDisabled();
    await userEvent.click(toggle);
    await expect(toggle).not.toBeChecked();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};
