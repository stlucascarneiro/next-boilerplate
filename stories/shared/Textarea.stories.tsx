import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import Textarea from "../../shared/Textarea.client";

type TextareaStoryArgs = {
  className?: string;
  defaultValue?: string;
  helperTextClassName?: string;
  helperTextText?: string;
  label: string;
  limit?: number;
  name: string;
  onBlur?: (value: string) => void;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
  value?: string;
};

function getTextareaSource(args: TextareaStoryArgs) {
  const helperText = args.helperTextText
    ? `\n      helperText={{ className: "${args.helperTextClassName || "text-subtle"}", text: "${args.helperTextText}" }}`
    : "";
  const required = args.required ? "\n      required" : "";
  const rows = args.rows ? `\n      rows={${args.rows}}` : "";
  const limit = args.limit ? `\n      limit={${args.limit}}` : "";
  const defaultValue = args.defaultValue
    ? `\n      defaultValue={${JSON.stringify(args.defaultValue)}}`
    : "";
  const value =
    args.value !== undefined
      ? `\n      value={${JSON.stringify(args.value)}}`
      : "";

  return `
    <Textarea
      label="${args.label}"
      name="${args.name}"
      placeholder="${args.placeholder}"${required}${rows}${limit}${defaultValue}${value}${helperText}
    />
  `;
}

function TextareaStoryExample({
  helperTextClassName,
  helperTextText,
  onBlur,
  onChange,
  onEnter,
  ...args
}: TextareaStoryArgs) {
  return (
    <div className="w-80">
      <Textarea
        {...args}
        helperText={
          helperTextText
            ? {
                className: helperTextClassName || "text-subtle",
                text: helperTextText,
              }
            : undefined
        }
        onBlur={onBlur}
        onChange={onChange}
        onEnter={onEnter}
      />
    </div>
  );
}

const meta = {
  args: {
    className: "",
    defaultValue: undefined,
    helperTextClassName: "text-subtle",
    helperTextText: "Tell us more details.",
    label: "Description",
    limit: 500,
    name: "description",
    onBlur: fn(),
    onChange: fn(),
    onEnter: fn(),
    placeholder: "Write your description",
    required: false,
    rows: 4,
    value: undefined,
  },
  argTypes: {
    className: {
      control: "text",
      description: "Optional className applied to the wrapper container.",
    },
    defaultValue: {
      control: "text",
      description: "Initial value for uncontrolled usage.",
    },
    helperTextClassName: {
      control: "text",
      description: "Text color/style class used by helper text.",
    },
    helperTextText: {
      control: "text",
      description: "Optional helper message displayed below the textarea.",
    },
    label: {
      control: "text",
      description: "Textarea label linked through the name/id attribute.",
    },
    limit: {
      control: { min: 1, step: 1, type: "number" },
      description: "Maximum number of characters allowed.",
      table: {
        defaultValue: { summary: "500" },
      },
    },
    name: {
      control: "text",
      description: "Textarea name and id used for forms and label association.",
    },
    onBlur: {
      action: "blurred",
      description:
        "Callback fired with the current value when the textarea loses focus.",
    },
    onChange: {
      action: "changed",
      description:
        "Callback fired with the current value whenever the textarea changes.",
    },
    onEnter: {
      action: "pressed-enter",
      description:
        "Callback fired when Enter key is pressed while focused on textarea.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text shown when the field is empty.",
    },
    required: {
      control: "boolean",
      description: "Marks the textarea as required for form validation.",
    },
    rows: {
      control: { min: 1, step: 1, type: "number" },
      description: "Number of visible text rows.",
      table: {
        defaultValue: { summary: "4" },
      },
    },
    value: {
      control: "text",
      description:
        "Controlled textarea value. Leave empty for uncontrolled behavior in this story.",
    },
  },
  component: TextareaStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Textarea with label, optional helper text, callbacks for change/blur/enter and character limit support.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Textarea",
} satisfies Meta<TextareaStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onBlur: fn(),
    onChange: fn(),
    onEnter: fn(),
  },
  parameters: {
    docs: {
      source: {
        code: getTextareaSource({
          helperTextClassName: "text-subtle",
          helperTextText: "Tell us more details.",
          label: "Description",
          limit: 500,
          name: "description",
          placeholder: "Write your description",
          required: false,
          rows: 4,
        }),
      },
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const textarea = canvas.getByLabelText(/description/i);

    args.onChange?.mockClear();
    args.onEnter?.mockClear();
    args.onBlur?.mockClear();

    await userEvent.type(textarea, "First line");
    await userEvent.keyboard("{Enter}");
    await userEvent.type(textarea, "Second line");
    await userEvent.tab();

    await expect(args.onChange).toHaveBeenCalled();
    await expect(args.onEnter).toHaveBeenCalledTimes(1);
    await expect(args.onBlur).toHaveBeenCalled();
  },
};

export const RequiredField: Story = {
  args: {
    helperTextText: "This information is required.",
    label: "Notes",
    name: "notes",
    onBlur: fn(),
    onChange: fn(),
    onEnter: fn(),
    placeholder: "Write your notes",
    required: true,
    rows: 5,
  },
  parameters: {
    docs: {
      source: {
        code: getTextareaSource({
          helperTextClassName: "text-subtle",
          helperTextText: "This information is required.",
          label: "Notes",
          limit: 500,
          name: "notes",
          placeholder: "Write your notes",
          required: true,
          rows: 5,
        }),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByLabelText(/notes/i);

    await expect(textarea).toBeRequired();
    await userEvent.type(textarea, "Required field content");
    await expect(textarea).toHaveValue("Required field content");
  },
};

export const CharacterLimit: Story = {
  args: {
    helperTextText: "Maximum 10 characters.",
    label: "Short summary",
    limit: 10,
    name: "summary",
    onBlur: fn(),
    onChange: fn(),
    onEnter: fn(),
    placeholder: "Max 10 chars",
    rows: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Edge case: user input above the configured limit is clamped by native maxLength behavior.",
      },
      source: {
        code: getTextareaSource({
          helperTextClassName: "text-subtle",
          helperTextText: "Maximum 10 characters.",
          label: "Short summary",
          limit: 10,
          name: "summary",
          placeholder: "Max 10 chars",
          required: false,
          rows: 3,
        }),
      },
    },
  },
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByLabelText(/short summary/i);

    await userEvent.type(textarea, "123456789012345");
    await expect(textarea).toHaveValue("1234567890");
  },
};
