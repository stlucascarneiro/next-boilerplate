// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  {
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-enums": ["warn"],
      "perfectionist/sort-interfaces": ["warn"],
      "perfectionist/sort-jsx-props": ["warn"],
      "perfectionist/sort-named-exports": ["warn"],
      "perfectionist/sort-named-imports": ["warn"],
      "perfectionist/sort-object-types": ["warn"],
      "perfectionist/sort-objects": ["warn"],
      "perfectionist/sort-sets": ["warn"],
      "perfectionist/sort-union-types": ["warn"],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
