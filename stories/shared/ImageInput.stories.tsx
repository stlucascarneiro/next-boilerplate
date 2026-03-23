import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";
import ImageInput from "../../shared/ImageInput.client";

const meta = {
  args: {
    accept: "image/png,image/jpeg,image/gif",
    label: "Cover Image",
    maxSizeInMB: 5,
    name: "cover-image",
    onChange: fn(),
    onError: fn(),
    onUrlSubmit: fn(),
  },
  argTypes: {
    accept: {
      control: "text",
      description: "Comma-separated list of accepted MIME types or extensions.",
    },
    className: {
      control: "text",
      description: "Optional className applied to the component wrapper.",
    },
    label: {
      control: "text",
      description: "Field label linked to the hidden file input.",
    },
    maxSizeInMB: {
      control: { min: 1, step: 1, type: "number" },
      description: "Maximum accepted file size in MB.",
      table: {
        defaultValue: { summary: "5" },
      },
    },
    name: {
      control: "text",
      description: "Input id/name used by forms and accessibility APIs.",
    },
    onChange: {
      action: "file-selected",
      description: "Callback fired when a valid file is selected or removed.",
    },
    onError: {
      action: "validation-error",
      description: "Callback fired when selected file fails validation.",
    },
    onUrlSubmit: {
      action: "url-submitted",
      description:
        "Callback fired when a URL is submitted via the URL input field.",
    },
    required: {
      control: "boolean",
      description: "Marks the input as required for form validation.",
    },
  },
  component: ImageInput,
  parameters: {
    docs: {
      description: {
        component:
          "Image input component with file upload via drag-and-drop, file picker, and URL input. Features preview with Replace and Remove actions on hover.",
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
  title: "Shared/ImageInput",
} satisfies Meta<typeof ImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByLabelText(/cover image/i);

    args.onChange?.mockClear();
    args.onError?.mockClear();

    const file = new File(["fake-image-content"], "cover.png", {
      type: "image/png",
    });

    await userEvent.upload(input, file);

    await expect(args.onChange).toHaveBeenCalledWith(file);
    await expect(args.onError).not.toHaveBeenCalled();
  },
};

export const WithImagePreview: Story = {
  args: {
    value: new File(["fake-image-content"], "preview.jpg", {
      type: "image/jpeg",
    }),
  },
  play: async ({ canvas, userEvent }) => {
    const previewArea = canvas.getByRole("button", { hidden: true });

    // Test hover to show Replace and Remove buttons
    await userEvent.hover(previewArea);

    await expect(canvas.getByText("Replace")).toBeInTheDocument();
    await expect(canvas.getByText("Remove")).toBeInTheDocument();
  },
};

export const RemoveImage: Story = {
  args: {
    onChange: fn(),
    value: new File(["fake-image-content"], "test.png", {
      type: "image/png",
    }),
  },
  play: async ({ args, canvas, userEvent }) => {
    const previewArea = canvas.getByRole("button", { hidden: true });

    await userEvent.hover(previewArea);

    const removeButton = canvas.getByRole("button", { name: /remove/i });
    await userEvent.click(removeButton);

    await expect(args.onChange).toHaveBeenCalledWith(null);
  },
};

export const SubmitImageUrl: Story = {
  args: {
    onUrlSubmit: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const urlInput = canvas.getByDisplayValue("");
    const testUrl = "https://example.com/image.jpg";

    await userEvent.type(urlInput, testUrl);
    await userEvent.keyboard("{Enter}");

    await expect(args.onUrlSubmit).toHaveBeenCalledWith(testUrl);
  },
};

export const LargeFileError: Story = {
  args: {
    maxSizeInMB: 1,
    onChange: fn(),
    onError: fn(),
  },
  play: async ({ args, canvas, userEvent }) => {
    const input = canvas.getByLabelText(/cover image/i);

    args.onChange?.mockClear();
    args.onError?.mockClear();

    const tooLargeFile = new File(
      [new Uint8Array(2 * 1024 * 1024)],
      "large.jpg",
      {
        type: "image/jpeg",
      },
    );

    await userEvent.upload(input, tooLargeFile);

    await expect(args.onError).toHaveBeenCalled();
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByText(/exceeds 1mb/i)).toBeInTheDocument();
  },
};
