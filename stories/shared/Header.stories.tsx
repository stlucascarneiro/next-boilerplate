import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiSettings } from "react-icons/fi";
import { fn } from "storybook/test";
import Button from "../../shared/Button.client";
import Header from "../../shared/Header.client";

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
        back: fn(),
        push: fn(),
      },
    },
  },
  tags: ["autodocs"],
  title: "Shared/Header",
} satisfies Meta<HeaderStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
