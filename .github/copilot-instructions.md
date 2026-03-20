# Copilot Testing Instructions (Workspace)

Apply this policy whenever implementing tests in this repository.

## Testing Policy

- Focus tests on interaction, logic, and behavior.
- Prefer user-centric assertions using roles, labels, visible outcomes, callback invocations, and state transitions.
- Do not write tests that only validate visual styling details such as colors, spacing, class names, or animation timing, unless that visual detail is a functional requirement.
- Avoid broad snapshot tests for UI-only verification.
- For interactive components, include at least:
  - one happy-path interaction test
  - one negative or edge-case behavior test
- Keep tests deterministic:
  - do not use arbitrary waits
  - avoid brittle selectors
  - mock external boundaries when needed
- If a request conflicts with this policy, explain the tradeoff and propose a behavior-based alternative.

## Storybook Testing Guidance

- Prefer interaction tests with Storybook play functions for component behavior.
- Validate outcomes that matter to users, not implementation details.
- Reuse existing stories as test cases before creating new test-only scaffolding.

## Commit message policy

- Always write Git commit messages in English.
- Use Conventional Commits format when possible (feat, fix, chore, docs, refactor, test).
- Keep the subject concise and imperative.

## Component Reuse & Page Building

When building pages and UI features, use the **Page Builder Agent** to maximize code reuse and maintain consistency.

- **Use the Page Builder Agent:** When creating or modifying pages (app/**, modules/**, pages/\*\*), select the "Page Builder" custom agent in VS Code for specialized guidance
- **Access the Shared Components Skill:** Use `/shared-components` in chat to reference the complete catalog of 20+ reusable components, patterns, and design tokens
- **Document Component Usage:** Always list which shared components were used in your implementation
- **Use Box for Surfaces:** Box is for highlighted cards and surfaces—use standard `<div>` with Tailwind for layout and positioning
- **Follow Conventions:** See `.github/skills/shared-components/SKILL.md` for detailed patterns, decision matrices, and typing conventions

### Component Categories Quick Reference

| Need               | Use                                                   |
| ------------------ | ----------------------------------------------------- |
| Card/surface       | `Box`                                                 |
| Form inputs        | `Input`, `Select`, `Multiselect`, `Checkbox`          |
| Buttons            | `Button` (primary, secondary, danger, ghost variants) |
| Modal/confirmation | `Dialog` (compound component)                         |
| Side panel         | `Drawer` (compound component)                         |
| Context menu       | `Dropdown` (compound component)                       |
| Notifications      | `Toast` (provider + useToast hook)                    |
| User avatar        | `Avatar` (initials or image)                          |
| Loading state      | `Skeleton` (content) or `Spinner` (indicator)         |
| Tabs               | `Tabs` (keyboard accessible)                          |
| Page header        | `Header` (with back button option)                    |

### Design System & Colors

- Colors: Use `TColor` union (22 semantic colors) for Avatar, Chip, Button
- Design tokens: CSS variables in `tailwind.config.ts` handle theme-aware styling (--background, --text, --surface, etc.)
- No hardcoded colors; always use design tokens or TColor

### Conventions

- Client components: `.client.tsx` suffix for interactive components (Button, Input, Dialog, etc.)
- Server components: `.tsx` suffix for presentational components (Avatar, Box, DetailRow, etc.)
- Imports: Follow alphabetical order (perfectionist lint rule)
- Compound components: Use dot notation (Dialog.Content, Drawer.Trigger, etc.)

---

For comprehensive component documentation, patterns, and examples, see `.github/skills/shared-components/SKILL.md`.
