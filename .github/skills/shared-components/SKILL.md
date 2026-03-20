---
name: shared-components
description: "Use when: building pages, forms, layouts, or UI features. Provides component purpose mapping and directs API lookup to Storybook stories as the single source of truth."
---

# Shared Components Decision Guide

Use this skill to decide which component to use.
Do not duplicate component API docs here.

Single source of truth for props, defaults, variants, and usage details:

- stories/shared/\*.stories.tsx
- stories/shared/\*.stories.ts (for Chip)

## Core Rule

1. Pick component by purpose using this guide.
2. Open the matching story file.
3. Follow the story API and examples exactly.
4. Implement with project conventions.

## Purpose Matrix

### Surface and Structure

- Box: highlighted surface/card (not generic layout container)
- Divider: visual section separator
- Header: page or section header with optional back action
- DetailRow: label/value row for read-only details
- Pagination: list navigation between pages

### Inputs and Selection

- Input: text-like fields (text, email, password, number, etc.)
- Checkbox: boolean choices
- Select: single option from list
- Multiselect: multiple options with search/selection UX

### Actions and Feedback

- Button: primary/secondary/danger/ghost actions
- Chip: compact status/tag badge, optionally clickable
- Dialog: blocking confirmation/modal interactions
- Drawer: side panel interactions
- Dropdown: compact action/context menu
- Toast: non-blocking feedback notifications
- Skeleton: content loading placeholder
- Spinner: loading indicator

### Navigation and Utility

- Tabs: sectional navigation inside a page
- Avatar: user identity visual (image/initials)
- ThemeToggler: light/dark mode switch

## Story Mapping (API Source)

- Avatar -> stories/shared/Avatar.stories.tsx
- Box -> stories/shared/Box.stories.tsx
- Button -> stories/shared/Button.stories.tsx
- Checkbox -> stories/shared/Checkbox.stories.tsx
- Chip -> stories/shared/Chip.stories.ts
- DetailRow -> stories/shared/DetailRow.stories.tsx
- Dialog -> stories/shared/Dialog.stories.tsx
- Divider -> story usage can be inferred from composition in existing pages/components
- Drawer -> stories/shared/Drawer.stories.tsx
- Dropdown -> stories/shared/Dropdown.stories.tsx
- Header -> stories/shared/Header.stories.tsx
- Input -> stories/shared/Input.stories.tsx
- Multiselect -> stories/shared/Multiselect.stories.tsx
- Pagination -> stories/shared/Pagination.stories.tsx
- Select -> stories/shared/Select.stories.tsx
- Skeleton -> story usage can be inferred from loading patterns in codebase
- Spinner -> story usage can be inferred from loading patterns in codebase
- Tabs -> stories/shared/Tabs.stories.tsx
- Toast -> stories/shared/Toast.stories.tsx
- ThemeToggler -> story usage can be inferred from app layout/navigation patterns

## Project Conventions (Enforce While Implementing)

- Box is a surface/card component. Use div with Tailwind for layout and positioning.
- Prefer existing shared components before creating new ones.
- Use individual imports from each component file. Do not use barrel imports from @/shared.
- Keep imports alphabetically ordered.
- Interactive components use .client.tsx files and client context when required.
- Use design tokens and TColor conventions. Avoid hardcoded colors.

## Implementation Workflow

1. Parse the request and identify UI responsibilities.
2. Select components from Purpose Matrix.
3. Read matching story files to confirm API.
4. Implement with existing patterns from app/ and modules/.
5. Return a final list: components used and which stories were consulted.

## Anti-Patterns

- Rewriting API docs in this skill.
- Using Box as a generic layout wrapper.
- Guessing props without checking stories.
- Creating duplicate components that already exist in shared/.
- Using @/shared barrel-style imports.
