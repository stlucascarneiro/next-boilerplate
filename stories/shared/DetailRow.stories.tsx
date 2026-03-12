import DetailRow from "@/shared/DetailRow";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FiMail, FiMapPin, FiPhone, FiUser } from "react-icons/fi";

const meta = {
  args: {
    complementary: undefined,
    label: "Full name",
    value: "Jane Doe",
  },
  argTypes: {
    complementary: {
      control: "text",
      description: "Optional secondary text shown below the main value.",
    },
    icon: {
      control: false,
      description:
        "Optional icon element rendered on the left side. When provided without a label, it takes a larger size.",
    },
    label: {
      control: "text",
      description:
        "Descriptive label displayed on the left column. Omit to switch the left slot to icon-only mode.",
    },
    value: {
      control: "text",
      description: "Primary text displayed on the right column.",
    },
  },
  component: DetailRow,
  parameters: {
    docs: {
      description: {
        component:
          "Row component for displaying a labeled or icon-identified field and its value, with an optional complementary note. Designed for detail/summary sections.",
      },
    },
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Shared/DetailRow",
} satisfies Meta<typeof DetailRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Label and value in the basic two-column layout.",
      },
      source: {
        code: `<DetailRow label="Full name" value="Jane Doe" />`,
      },
    },
  },
};

export const WithComplementary: Story = {
  args: {
    complementary: "Primary contact",
    label: "Email",
    value: "jane.doe@example.com",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Secondary text below the value for context such as category or status.",
      },
      source: {
        code: `<DetailRow complementary="Primary contact" label="Email" value="jane.doe@example.com" />`,
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    icon: <FiMail />,
    label: "Email",
    value: "jane.doe@example.com",
  },
  parameters: {
    docs: {
      description: {
        story: "Icon alongside the label for visual identification.",
      },
      source: {
        code: `<DetailRow icon={<FiMail />} label="Email" value="jane.doe@example.com" />`,
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    icon: <FiPhone />,
    label: undefined,
    value: "+1 (555) 000-0000",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When no label is provided the icon slot renders at a larger size and acts as the sole identifier.",
      },
      source: {
        code: `<DetailRow icon={<FiPhone />} value="+1 (555) 000-0000" />`,
      },
    },
  },
};

export const ContactCard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Multiple rows composed inside a Box to illustrate a typical contact or profile detail section.",
      },
      source: {
        code: `
<Box>
  <DetailRow icon={<FiUser />} label="Name" value="Jane Doe" />
  <DetailRow complementary="Work" icon={<FiMail />} label="Email" value="jane.doe@example.com" />
  <DetailRow icon={<FiPhone />} label="Phone" value="+1 (555) 000-0000" />
  <DetailRow complementary="San Francisco, CA" icon={<FiMapPin />} label="Location" value="United States" />
</Box>`,
      },
    },
  },
  render: () => (
    <div className="w-96 rounded-lg border border-transparent bg-white p-4 shadow-md dark:bg-neutral-900">
      <DetailRow icon={<FiUser />} label="Name" value="Jane Doe" />
      <DetailRow
        complementary="Work"
        icon={<FiMail />}
        label="Email"
        value="jane.doe@example.com"
      />
      <DetailRow icon={<FiPhone />} label="Phone" value="+1 (555) 000-0000" />
      <DetailRow
        complementary="San Francisco, CA"
        icon={<FiMapPin />}
        label="Location"
        value="United States"
      />
    </div>
  ),
};
