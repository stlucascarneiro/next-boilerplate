import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";
import "./preview.css";

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      defaultTheme: "light",
      themes: {
        dark: "dark bg-surface",
        light: "light",
      },
    }),
  ],

  parameters: {
    a11y: {
      test: "todo",
    },

    backgrounds: {
      default: "app",
      values: [
        {
          name: "app",
          value: "var(--background)",
        },
      ],
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
