import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Select from "../../shared/Select.client";

type SelectStoryArgs = {
  label?: string;
  name: string;
  options: Array<{
    label: string;
    value: number | string;
  }>;
};

function getSelectSource({
  label,
  name,
}: Pick<SelectStoryArgs, "label" | "name">) {
  const inputLabel = label ? `\n      label=\"${label}\"` : "";

  return `
    <Select${inputLabel}
      name=\"${name}\"
      options={[
        { label: "Brazil", value: "br" },
        { label: "Canada", value: "ca" },
        { label: "Japan", value: "jp" },
      ]}
    />
  `;
}

function SelectStoryExample(args: SelectStoryArgs) {
  return (
    <div className="w-80">
      <Select {...args} />
    </div>
  );
}

const meta = {
  args: {
    label: "Country",
    name: "country",
    options: [
      { label: "Brazil", value: "br" },
      { label: "Canada", value: "ca" },
      { label: "Japan", value: "jp" },
    ],
  },
  argTypes: {
    label: {
      control: "text",
      description: "Optional label displayed above the select field.",
    },
    name: {
      control: "text",
      description: "Field name used by forms and accessibility attributes.",
    },
    options: {
      control: "object",
      description: "List of options rendered in the native select element.",
    },
  },
  component: SelectStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Native select wrapper with consistent visual styling and optional label.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Select",
} satisfies Meta<SelectStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: getSelectSource({
          label: "Country",
          name: "country",
        }),
      },
    },
  },
};

export const WithoutLabel: Story = {
  args: {
    label: undefined,
    name: "language",
    options: [
      { label: "English", value: "en" },
      { label: "Portuguese", value: "pt" },
      { label: "Spanish", value: "es" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use this mode when the label is provided by surrounding UI context.",
      },
      source: {
        code: getSelectSource({
          name: "language",
        }),
      },
    },
  },
};

export const NumericValues: Story = {
  args: {
    label: "Priority",
    name: "priority",
    options: [
      { label: "Low", value: 1 },
      { label: "Medium", value: 2 },
      { label: "High", value: 3 },
    ],
  },
  parameters: {
    docs: {
      source: {
        code: `
    <Select
      label=\"Priority\"
      name=\"priority\"
      options={[
        { label: "Low", value: 1 },
        { label: "Medium", value: 2 },
        { label: "High", value: 3 },
      ]}
    />
  `,
      },
    },
  },
};
