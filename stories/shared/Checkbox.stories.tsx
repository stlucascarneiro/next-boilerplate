import Checkbox from "@/shared/Checkbox";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

type CheckboxStoryArgs = {
  className?: string;
  defaultChecked?: boolean;
  label: string;
  name: string;
  required?: boolean;
};

function getCheckboxSource(args: CheckboxStoryArgs) {
  const required = args.required ? "\n  required" : "";
  const defaultChecked = args.defaultChecked ? "\n  defaultChecked" : "";
  const className = args.className ? `\n  className=\"${args.className}\"` : "";

  return `
<Checkbox
  label="${args.label}"
  name="${args.name}"${required}${defaultChecked}${className}
/>`;
}

function CheckboxStoryExample({
  className,
  defaultChecked,
  label,
  name,
  required,
}: CheckboxStoryArgs) {
  return (
    <div className="w-80">
      <Checkbox
        className={className}
        defaultChecked={defaultChecked}
        label={label}
        name={name}
        required={required}
      />
    </div>
  );
}

const meta = {
  args: {
    className: "",
    defaultChecked: false,
    label: "Accept terms and conditions",
    name: "terms",
    required: false,
  },
  argTypes: {
    className: {
      control: "text",
      description: "Optional class name applied to the checkbox wrapper.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Initial checked state for uncontrolled usage.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
    label: {
      control: "text",
      description: "Text displayed in the associated label element.",
    },
    name: {
      control: "text",
      description: "Used as both input name and id for label association.",
    },
    required: {
      control: "boolean",
      description: "Marks the checkbox as required for native form validation.",
      table: {
        defaultValue: { summary: "false" },
      },
    },
  },
  component: CheckboxStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Basic checkbox field with label support and native form attributes for required and defaultChecked states.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Checkbox",
} satisfies Meta<CheckboxStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: getCheckboxSource({
          defaultChecked: false,
          label: "Accept terms and conditions",
          name: "terms",
          required: false,
        }),
      },
    },
  },
};

export const CheckedByDefault: Story = {
  args: {
    defaultChecked: true,
    label: "Subscribe to product updates",
    name: "newsletter",
  },
  parameters: {
    docs: {
      description: {
        story: "Starts in checked state for uncontrolled scenarios.",
      },
      source: {
        code: getCheckboxSource({
          defaultChecked: true,
          label: "Subscribe to product updates",
          name: "newsletter",
          required: false,
        }),
      },
    },
  },
};

export const Required: Story = {
  args: {
    label: "I agree with the privacy policy",
    name: "privacy-policy",
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Required checkbox example for consent fields in forms.",
      },
      source: {
        code: getCheckboxSource({
          defaultChecked: false,
          label: "I agree with the privacy policy",
          name: "privacy-policy",
          required: true,
        }),
      },
    },
  },
};
