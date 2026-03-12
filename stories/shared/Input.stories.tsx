import Button from "@/shared/Button.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PiEyeDuotone } from "react-icons/pi";
import { fn } from "storybook/test";
import Input from "../../shared/Input.client";

type InputStoryArgs = {
  className?: string;
  helperTextClassName?: string;
  helperTextText?: string;
  label: string;
  limit?: number;
  name: string;
  placeholder: string;
  required?: boolean;
  showAsideContent?: boolean;
  step?: string;
  type: "email" | "number" | "password" | "search" | "text";
  value?: number | string;
};

function getInputSource(args: InputStoryArgs) {
  const helperText = args.helperTextText
    ? `\n      helperText={{ className: "${args.helperTextClassName || "text-subtle"}", text: "${args.helperTextText}" }}`
    : "";
  const asideContent = args.showAsideContent
    ? '\n      asideContent={<Button variant="ghost" icon={<PiEyeDuotone/>}/>}'
    : "";
  const value =
    args.value !== undefined
      ? `\n      value={${JSON.stringify(args.value)}}`
      : "";
  const step = args.step ? `\n      step=\"${args.step}\"` : "";
  const required = args.required ? "\n      required" : "";

  return `
    <Input
      label=\"${args.label}\"
      name=\"${args.name}\"
      placeholder=\"${args.placeholder}\"
      type=\"${args.type}\"${required}${step}
      limit={${args.limit ?? 100}}${value}${helperText}${asideContent}
    />
  `;
}

function InputStoryExample({
  helperTextClassName,
  helperTextText,
  showAsideContent,
  ...args
}: InputStoryArgs) {
  return (
    <div className="w-80">
      <Input
        {...args}
        asideContent={
          showAsideContent ? (
            <Button icon={<PiEyeDuotone />} variant="ghost" />
          ) : undefined
        }
        helperText={
          helperTextText
            ? {
                className: helperTextClassName || "text-subtle",
                text: helperTextText,
              }
            : undefined
        }
        onBlur={fn()}
        onChange={fn()}
        onEnter={fn()}
      />
    </div>
  );
}

const meta = {
  args: {
    helperTextClassName: "text-subtle",
    helperTextText: "Use at least 8 characters.",
    label: "Password",
    limit: 100,
    name: "password",
    placeholder: "Enter your password",
    required: false,
    showAsideContent: false,
    step: undefined,
    type: "password",
    value: undefined,
  },
  argTypes: {
    className: {
      control: "text",
      description: "Optional className applied to the wrapper container.",
    },
    helperTextClassName: {
      control: "text",
      description: "Text color/style class used by helper text.",
    },
    helperTextText: {
      control: "text",
      description: "Optional helper message displayed below the input.",
    },
    label: {
      control: "text",
      description: "Input label linked through the name/id attribute.",
    },
    limit: {
      control: { min: 1, step: 1, type: "number" },
      description: "Maximum number of characters allowed.",
      table: {
        defaultValue: { summary: "100" },
      },
    },
    name: {
      control: "text",
      description: "Input name and id used for forms and label association.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the field is empty.",
    },
    required: {
      control: "boolean",
      description: "Marks the input as required for form validation.",
    },
    showAsideContent: {
      control: "boolean",
      description:
        "Shows an example trailing content element beside the input.",
    },
    step: {
      control: "text",
      description: "Step attribute used mainly by numeric input types.",
    },
    type: {
      control: { type: "select" },
      description: "Native HTML input type.",
      options: ["email", "number", "password", "search", "text"],
    },
    value: {
      control: "text",
      description:
        "Controlled input value. Leave empty for uncontrolled behavior in this story.",
    },
  },
  component: InputStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Form input with label, optional helper text, callbacks for change/blur/enter, and support for trailing custom content.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Input",
} satisfies Meta<InputStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: getInputSource({
          helperTextClassName: "text-subtle",
          helperTextText: "Use at least 8 characters.",
          label: "Password",
          limit: 100,
          name: "password",
          placeholder: "Enter your password",
          required: false,
          showAsideContent: false,
          type: "password",
        }),
      },
    },
  },
};

export const RequiredEmail: Story = {
  args: {
    helperTextText: "We'll never share your email.",
    label: "Email",
    name: "email",
    placeholder: "you@example.com",
    required: true,
    type: "email",
  },
  parameters: {
    docs: {
      source: {
        code: getInputSource({
          helperTextClassName: "text-subtle",
          helperTextText: "We'll never share your email.",
          label: "Email",
          limit: 100,
          name: "email",
          placeholder: "you@example.com",
          required: true,
          showAsideContent: false,
          type: "email",
        }),
      },
    },
  },
};

export const WithAsideContent: Story = {
  args: {
    helperTextText: "Username is used in your public profile URL.",
    label: "Username",
    name: "username",
    placeholder: "your-handle",
    showAsideContent: true,
    type: "text",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `asideContent` to render prefixes/suffixes like icons or units.",
      },
      source: {
        code: getInputSource({
          helperTextClassName: "text-subtle",
          helperTextText: "Username is used in your public profile URL.",
          label: "Username",
          limit: 100,
          name: "username",
          placeholder: "your-handle",
          required: false,
          showAsideContent: true,
          type: "text",
        }),
      },
    },
  },
};

export const NumberInput: Story = {
  args: {
    helperTextText: "Set your target budget in USD.",
    label: "Budget",
    name: "budget",
    placeholder: "0.00",
    step: "0.01",
    type: "number",
    value: 120.5,
  },
  parameters: {
    docs: {
      source: {
        code: getInputSource({
          helperTextClassName: "text-subtle",
          helperTextText: "Set your target budget in USD.",
          label: "Budget",
          limit: 100,
          name: "budget",
          placeholder: "0.00",
          required: false,
          showAsideContent: false,
          step: "0.01",
          type: "number",
          value: 120.5,
        }),
      },
    },
  },
};
