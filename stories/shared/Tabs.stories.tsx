import Tabs from "@/shared/Tabs.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect } from "storybook/test";

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
  play: async ({ canvas, userEvent }) => {
    const accountTab = canvas.getByRole("tab", { name: /account/i });
    const securityTab = canvas.getByRole("tab", { name: /security/i });

    await expect(accountTab).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByText(/manage profile details, locale settings/i),
    ).toBeVisible();

    await userEvent.click(securityTab);

    await expect(securityTab).toHaveAttribute("aria-selected", "true");
    await expect(
      canvas.getByText(
        /rotate credentials, enforce two-factor authentication/i,
      ),
    ).toBeVisible();
  },
  parameters: {
    docs: {
      source: {
        code: getDefaultSource(),
      },
    },
  },
};

export const Controlled: Story = {
  play: async ({ canvas, userEvent }) => {
    const overviewTab = canvas.getByRole("tab", { name: /overview/i });

    overviewTab.focus();
    await userEvent.keyboard("{ArrowRight}");

    const activityTab = canvas.getByRole("tab", { name: /activity/i });
    await expect(activityTab).toHaveAttribute("aria-selected", "true");
    await expect(canvas.getByText(/current tab: activity/i)).toBeVisible();
  },
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
