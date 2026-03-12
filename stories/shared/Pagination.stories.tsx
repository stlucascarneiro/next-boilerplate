import Pagination from "@/shared/Pagination";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
  args: {
    hasNextPage: true,
    hasPreviousPage: true,
    nextPage: 3,
    page: 2,
    pageSize: 10,
    params: {},
    path: "/items",
    previousPage: 1,
    records: 87,
    recordsOnPage: 10,
    recordsRange: "11–20",
    totalPages: 9,
  },
  argTypes: {
    hasNextPage: {
      control: "boolean",
      description: "Whether a next page is available.",
    },
    hasPreviousPage: {
      control: "boolean",
      description: "Whether a previous page is available.",
    },
    nextPage: {
      control: { min: 1, step: 1, type: "number" },
      description: "Page number for the next navigation button.",
    },
    page: {
      control: { min: 1, step: 1, type: "number" },
      description: "Current active page number.",
    },
    pageSize: {
      control: { min: 1, step: 1, type: "number" },
      description: "Number of records per page.",
    },
    params: {
      control: "object",
      description:
        "Additional query parameters merged into each navigation link.",
    },
    path: {
      control: "text",
      description: "Base pathname used to build navigation links.",
    },
    previousPage: {
      control: { min: 1, step: 1, type: "number" },
      description: "Page number for the previous navigation button.",
    },
    records: {
      control: { min: 0, step: 1, type: "number" },
      description: "Total number of records across all pages.",
    },
    recordsOnPage: {
      control: { min: 0, step: 1, type: "number" },
      description: "Number of records displayed on the current page.",
    },
    recordsRange: {
      control: "text",
      description: 'Human-readable range string, e.g. "11–20".',
    },
    totalPages: {
      control: { min: 1, step: 1, type: "number" },
      description: "Total number of pages.",
    },
  },
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          "Navigation bar for paginated lists. Renders first, previous, next, and last page controls as accessible links, disabling unavailable actions automatically.",
      },
    },
    layout: "padded",
  },
  tags: ["autodocs"],
  title: "Shared/Pagination",
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "Middle page — all four navigation controls are active.",
      },
      source: {
        code: `
<Pagination
  hasNextPage={true}
  hasPreviousPage={true}
  nextPage={3}
  page={2}
  pageSize={10}
  params={{}}
  path="/items"
  previousPage={1}
  records={87}
  recordsOnPage={10}
  recordsRange="11–20"
  totalPages={9}
/>`,
      },
    },
  },
};

export const FirstPage: Story = {
  args: {
    hasNextPage: true,
    hasPreviousPage: false,
    nextPage: 2,
    page: 1,
    previousPage: 1,
    records: 87,
    recordsOnPage: 10,
    recordsRange: "1–10",
    totalPages: 9,
  },
  parameters: {
    docs: {
      description: {
        story: "First page — first and previous controls are disabled.",
      },
      source: {
        code: `
<Pagination
  hasNextPage={true}
  hasPreviousPage={false}
  nextPage={2}
  page={1}
  pageSize={10}
  params={{}}
  path="/items"
  previousPage={1}
  records={87}
  recordsOnPage={10}
  recordsRange="1–10"
  totalPages={9}
/>`,
      },
    },
  },
};

export const LastPage: Story = {
  args: {
    hasNextPage: false,
    hasPreviousPage: true,
    nextPage: 9,
    page: 9,
    previousPage: 8,
    records: 87,
    recordsOnPage: 7,
    recordsRange: "81–87",
    totalPages: 9,
  },
  parameters: {
    docs: {
      description: {
        story: "Last page — next and last controls are disabled.",
      },
      source: {
        code: `
<Pagination
  hasNextPage={false}
  hasPreviousPage={true}
  nextPage={9}
  page={9}
  pageSize={10}
  params={{}}
  path="/items"
  previousPage={8}
  records={87}
  recordsOnPage={7}
  recordsRange="81–87"
  totalPages={9}
/>`,
      },
    },
  },
};

export const WithQueryParams: Story = {
  args: {
    params: { search: "invoice", status: "pending" },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Navigation links preserve existing query parameters alongside the page number.",
      },
      source: {
        code: `
<Pagination
  hasNextPage={true}
  hasPreviousPage={true}
  nextPage={3}
  page={2}
  pageSize={10}
  params={{ search: "invoice", status: "pending" }}
  path="/items"
  previousPage={1}
  records={87}
  recordsOnPage={10}
  recordsRange="11–20"
  totalPages={9}
/>`,
      },
    },
  },
};
