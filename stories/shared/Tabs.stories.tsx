import Tabs from "@/shared/Tabs.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

function getDefaultSource() {
  return `
<Tabs defaultValue="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="security">Security</Tabs.Trigger>
    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="account">
    <p className="text-sm text-subtle">Manage profile details and preferences.</p>
  </Tabs.Content>
  <Tabs.Content value="security">
    <p className="text-sm text-subtle">Update password and two-factor settings.</p>
  </Tabs.Content>
  <Tabs.Content value="billing">
    <p className="text-sm text-subtle">Review invoices and payment methods.</p>
  </Tabs.Content>
</Tabs>`;
}

function getControlledSource() {
  return `
function ControlledTabs() {
  const [value, setValue] = useState("overview");

  return (
    <Tabs onValueChange={setValue} value={value}>
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="overview">
        <p className="text-sm text-subtle">Overview content</p>
      </Tabs.Content>
      <Tabs.Content value="activity">
        <p className="text-sm text-subtle">Recent activity content</p>
      </Tabs.Content>
    </Tabs>
  );
}`;
}

function TabsStoryExample() {
  return (
    <Tabs defaultValue="account">
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="security">Security</Tabs.Trigger>
        <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="account">
        <p className="text-subtle text-sm">
          Manage profile details, locale settings, and notification preferences.
        </p>
      </Tabs.Content>
      <Tabs.Content value="security">
        <p className="text-subtle text-sm">
          Rotate credentials, enforce two-factor authentication, and review
          sign-in events.
        </p>
      </Tabs.Content>
      <Tabs.Content value="billing">
        <p className="text-subtle text-sm">
          Access invoices, update payment methods, and view upcoming charges.
        </p>
      </Tabs.Content>
    </Tabs>
  );
}

function ControlledTabsStoryExample() {
  const [value, setValue] = useState("overview");

  return (
    <Tabs onValueChange={setValue} value={value}>
      <Tabs.List>
        <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
        <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="overview">
        <p className="text-subtle text-sm">Current tab: {value}</p>
      </Tabs.Content>
      <Tabs.Content value="activity">
        <p className="text-subtle text-sm">Current tab: {value}</p>
      </Tabs.Content>
    </Tabs>
  );
}

const meta = {
  component: TabsStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Compound tabs component with List, Trigger, and Content slots. Supports controlled/uncontrolled state and keyboard navigation.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Tabs",
} satisfies Meta<typeof TabsStoryExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      source: {
        code: getDefaultSource(),
      },
    },
  },
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controlled example where the selected tab value is managed outside the Tabs root.",
      },
      source: {
        code: getControlledSource(),
      },
    },
  },
  render: () => <ControlledTabsStoryExample />,
};
