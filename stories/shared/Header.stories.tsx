import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiSettings } from "react-icons/fi";
import { expect, fn } from "storybook/test";
import Button from "../../shared/Button.client";
import Header from "../../shared/Header.client";

const mockBack = fn();
const mockPush = fn();

type HeaderStoryArgs = {
  returnPath?: string;
  showReturn?: boolean;
  title: string;
  titleHierarchy?: "h1" | "h2" | "h3";
  withRightContent?: boolean;
};

function getHeaderSource(args: HeaderStoryArgs) {
  const rightContent = args.withRightContent
    ? '\n      rightContent={<Button variant="ghost" icon={<FiSettings />} />}'
    : "";
  const returnPath = args.returnPath
    ? `\n      returnPath=\"${args.returnPath}\"`
    : "";
  const showReturn = args.showReturn ? "\n      showReturn" : "";

  return `
    <Header
      title=\"${args.title}\"
      titleHierarchy=\"${args.titleHierarchy || "h2"}\"${showReturn}${returnPath}${rightContent}
    />
  `;
}

function HeaderStoryExample({ withRightContent, ...args }: HeaderStoryArgs) {
  return (
    <Header
      {...args}
      rightContent={
        withRightContent ? (
          <Button icon={<FiSettings />} variant="ghost" />
        ) : undefined
      }
    />
  );
}

const meta = {
  args: {
    returnPath: "/workbench",
    showReturn: true,
    title: "Account settings",
    titleHierarchy: "h2",
    withRightContent: false,
  },
  argTypes: {
    returnPath: {
      control: "text",
      description:
        "Optional path used when clicking the return button. When omitted, it calls router.back().",
    },
    showReturn: {
      control: "boolean",
      description: "Displays a return button on the left side.",
    },
    title: {
      control: "text",
      description: "Main header title.",
    },
    titleHierarchy: {
      control: { type: "inline-radio" },
      description: "Semantic heading level used to render the title.",
      options: ["h1", "h2", "h3"],
      table: {
        defaultValue: { summary: "h2" },
      },
    },
    withRightContent: {
      control: "boolean",
      description: "Renders an example action on the right side.",
    },
  },
  component: HeaderStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Page header with optional return action, semantic title hierarchy, and a customizable right-side slot.",
      },
    },
    layout: "padded",
    nextjs: {
      appDirectory: true,
      navigation: {
        back: mockBack,
        push: mockPush,
      },
    },
  },
  tags: ["autodocs"],
  title: "Shared/Header",
} satisfies Meta<HeaderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const returnButton = canvas.getByRole("button");

    await expect(returnButton).toBeVisible();
    await userEvent.click(returnButton);
    await expect(
      canvas.getByRole("heading", { name: /account settings/i }),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      source: {
        code: getHeaderSource({
          returnPath: "/workbench",
          showReturn: true,
          title: "Account settings",
          titleHierarchy: "h2",
          withRightContent: false,
        }),
      },
    },
  },
};

export const WithRightAction: Story = {
  args: {
    withRightContent: true,
  },
  play: async ({ canvas }) => {
    const buttons = canvas.getAllByRole("button");

    await expect(buttons).toHaveLength(2);
  },
  parameters: {
    docs: {
      source: {
        code: getHeaderSource({
          returnPath: "/workbench",
          showReturn: true,
          title: "Account settings",
          titleHierarchy: "h2",
          withRightContent: true,
        }),
      },
    },
  },
};

export const WithoutReturn: Story = {
  args: {
    returnPath: "",
    showReturn: false,
    title: "Profile",
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button")).toBeNull();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Useful when the page is top-level and does not need back navigation.",
      },
      source: {
        code: getHeaderSource({
          showReturn: false,
          title: "Profile",
          titleHierarchy: "h2",
          withRightContent: false,
        }),
      },
    },
  },
};

export const TitleAsH1: Story = {
  args: {
    title: "Dashboard",
    titleHierarchy: "h1",
  },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: /dashboard/i,
    });

    await expect(heading).toBeVisible();
  },
  parameters: {
    docs: {
      source: {
        code: getHeaderSource({
          returnPath: "/workbench",
          showReturn: true,
          title: "Dashboard",
          titleHierarchy: "h1",
          withRightContent: false,
        }),
      },
    },
  },
};
