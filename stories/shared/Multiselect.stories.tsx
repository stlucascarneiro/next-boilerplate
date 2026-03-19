import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiCode, FiLayers, FiMonitor, FiUser } from "react-icons/fi";
import { expect } from "storybook/test";
import Multiselect from "../../shared/Multiselect.client";

const baseOptions = [
  { label: "Design", leftContent: <FiLayers />, value: "design" },
  { label: "Development", leftContent: <FiCode />, value: "development" },
  { label: "Product", leftContent: <FiMonitor />, value: "product" },
  { label: "Marketing", leftContent: <FiUser />, value: "marketing" },
] as const;

type MultiselectStoryArgs = {
  defaultSelected?: Array<number | string>;
  label?: string;
  maxSelection?: number;
  name: string;
  options: Array<{
    label: string;
    leftContent?: React.ReactNode;
    value: number | string;
  }>;
};

function getMultiselectSource({
  defaultSelected,
  label,
  maxSelection,
  name,
}: Pick<
  MultiselectStoryArgs,
  "defaultSelected" | "label" | "maxSelection" | "name"
>) {
  const selected =
    defaultSelected && defaultSelected.length > 0
      ? `\n      defaultSelected={[${defaultSelected
          .map((value) => (typeof value === "string" ? `\"${value}\"` : value))
          .join(", ")}]}`
      : "";
  const max = maxSelection ? `\n      maxSelection={${maxSelection}}` : "";
  const inputLabel = label ? `\n      label=\"${label}\"` : "";

  return `
    <Multiselect${inputLabel}
      name=\"${name}\"${max}${selected}
      options={[
        { label: "Design", value: "design" },
        { label: "Development", value: "development" },
        { label: "Product", value: "product" },
      ]}
    />
  `;
}

function MultiselectStoryExample(args: MultiselectStoryArgs) {
  return (
    <div className="w-96">
      <Multiselect {...args} />
    </div>
  );
}

const meta = {
  args: {
    defaultSelected: ["development"],
    label: "Team skills",
    maxSelection: undefined,
    name: "skills",
    options: [...baseOptions],
  },
  argTypes: {
    defaultSelected: {
      control: "object",
      description: "Initial selected option values.",
    },
    label: {
      control: "text",
      description: "Field label shown above the multiselect input.",
    },
    maxSelection: {
      control: { min: 1, step: 1, type: "number" },
      description: "Optional limit for selected items.",
    },
    name: {
      control: "text",
      description: "Name used by the hidden input that stores selected values.",
    },
    options: {
      control: "object",
      description: "Available options rendered in the dropdown list.",
    },
  },
  component: MultiselectStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Multi-select input with searchable options, removable chips, optional max selection limit, and support for left-side option content.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Multiselect",
} satisfies Meta<MultiselectStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const searchInput = canvas.getByPlaceholderText(/procurar/i);
    const hiddenInput = document.querySelector(
      'input[name="skills"][type="hidden"]',
    ) as HTMLInputElement | null;

    await expect(canvas.getByText(/development/i)).toBeVisible();

    await userEvent.click(searchInput);
    await userEvent.click(canvas.getByText(/design/i));
    await expect(hiddenInput).not.toBeNull();
    await expect(hiddenInput).toHaveValue("development,design");

    await userEvent.click(document.body);
    await userEvent.click(canvas.getByText(/^Development$/i));
    await expect(hiddenInput).toHaveValue("design");
  },
  parameters: {
    docs: {
      source: {
        code: getMultiselectSource({
          defaultSelected: ["development"],
          label: "Team skills",
          name: "skills",
        }),
      },
    },
  },
};

export const WithSelectionLimit: Story = {
  args: {
    defaultSelected: ["design", "product"],
    maxSelection: 2,
  },
  play: async ({ canvas, userEvent }) => {
    const searchInput = canvas.getByPlaceholderText(/procurar/i);
    const hiddenInput = document.querySelector(
      'input[name="skills"][type="hidden"]',
    ) as HTMLInputElement | null;

    await expect(canvas.getByText(/2 \/ 2/i)).toBeVisible();

    await userEvent.click(searchInput);
    await userEvent.click(canvas.getByText(/marketing/i));

    await expect(hiddenInput).not.toBeNull();
    await expect(hiddenInput).toHaveValue("design,product");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `maxSelection` to enforce a cap and display a selected/limit counter.",
      },
      source: {
        code: getMultiselectSource({
          defaultSelected: ["design", "product"],
          label: "Team skills",
          maxSelection: 2,
          name: "skills",
        }),
      },
    },
  },
};

export const EmptyInitialSelection: Story = {
  args: {
    defaultSelected: [],
    label: "Project tags",
    name: "projectTags",
  },
  play: async ({ canvas, userEvent }) => {
    const searchInput = canvas.getByPlaceholderText(/procurar/i);

    await userEvent.click(searchInput);
    await userEvent.type(searchInput, "unknown-option");

    await expect(
      canvas.getByText(/nenhum resultado para "unknown-option"/i),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      source: {
        code: getMultiselectSource({
          defaultSelected: [],
          label: "Project tags",
          name: "projectTags",
        }),
      },
    },
  },
};
