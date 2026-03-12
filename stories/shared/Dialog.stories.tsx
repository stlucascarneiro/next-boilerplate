import Dialog from "@/shared/Dialog.client";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function getDefaultDialogSource() {
  return `
<Dialog>
  <Dialog.Trigger variant="secondary">Open dialog</Dialog.Trigger>

  <Dialog.Content
    closeLabel="Cancel"
    confirmLabel="Save changes"
    description="Review the information below before saving your changes."
    onConfirm={() => {
      console.log("Confirmed");
    }}
    title="Edit profile"
  >
    <div className="space-y-2">
      <p className="text-sm text-subtle">Name: Jane Doe</p>
      <p className="text-sm text-subtle">Role: Product Designer</p>
    </div>
  </Dialog.Content>
</Dialog>`;
}

function getAlertDialogSource() {
  return `
<Dialog>
  <Dialog.Trigger variant="secondary">Delete project</Dialog.Trigger>

  <Dialog.Content
    closeLabel="Keep project"
    confirmLabel="Delete"
    description="This action cannot be undone. All related data will be permanently removed."
    onConfirm={() => {
      console.log("Project deleted");
    }}
    title="Delete this project?"
    variant="alert"
  />
</Dialog>`;
}

function getAsyncDialogSource() {
  return `
<Dialog>
  <Dialog.Trigger variant="secondary">Publish release</Dialog.Trigger>

  <Dialog.Content
    closeLabel="Back"
    confirmLabel="Publish now"
    description="The confirm button enters a loading state while the async action is running."
    onConfirm={async () => {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }}
    title="Ready to publish?"
  >
    <p className="text-sm text-subtle">
      This example demonstrates the built-in loading state during confirmation.
    </p>
  </Dialog.Content>
</Dialog>`;
}

function DialogStoryExample() {
  return (
    <Dialog>
      <Dialog.Trigger variant="secondary">Open dialog</Dialog.Trigger>

      <Dialog.Content
        closeLabel="Cancel"
        confirmLabel="Save changes"
        description="Review the information below before saving your changes."
        onConfirm={() => undefined}
        title="Edit profile"
      >
        <div className="space-y-2">
          <p className="text-subtle text-sm">Name: Jane Doe</p>
          <p className="text-subtle text-sm">Role: Product Designer</p>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}

const meta = {
  component: DialogStoryExample,
  parameters: {
    docs: {
      description: {
        component:
          "Compound dialog component with Trigger, Content, and Close slots. It supports neutral and alert variants, overlay dismissal, and async confirmation states.",
      },
      story: {
        height: "520px",
        inline: false,
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/Dialog",
} satisfies Meta<typeof DialogStoryExample>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Neutral dialog with title, description, custom action labels, and body content.",
      },
      source: {
        code: getDefaultDialogSource(),
      },
    },
  },
};

export const Alert: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Alert variant for destructive actions, using danger styling on the confirm button.",
      },
      source: {
        code: getAlertDialogSource(),
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger variant="secondary">Delete project</Dialog.Trigger>
      <Dialog.Content
        closeLabel="Keep project"
        confirmLabel="Delete"
        description="This action cannot be undone. All related data will be permanently removed."
        onConfirm={() => undefined}
        title="Delete this project?"
        variant="alert"
      />
    </Dialog>
  ),
};

export const AsyncConfirm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Async confirmation example showing the loading state handled by the confirm button.",
      },
      source: {
        code: getAsyncDialogSource(),
      },
    },
  },
  render: () => (
    <Dialog>
      <Dialog.Trigger variant="secondary">Publish release</Dialog.Trigger>

      <Dialog.Content
        closeLabel="Back"
        confirmLabel="Publish now"
        description="The confirm button enters a loading state while the async action is running."
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 1200));
        }}
        title="Ready to publish?"
      >
        <p className="text-subtle text-sm">
          This example demonstrates the built-in loading state during
          confirmation.
        </p>
      </Dialog.Content>
    </Dialog>
  ),
};
