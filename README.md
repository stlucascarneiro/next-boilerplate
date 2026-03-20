# Next.js + React Boilerplate

A production-ready starter for building web apps with a reusable UI foundation, typed API layer, Storybook documentation, and automated tests.

This project is designed to be a practical baseline you can clone for new products while still being understandable and useful for the community.

## What This Boilerplate Offers

This repository already includes:

- React.js component architecture with reusable primitives and compound components
- Next.js app structure with global layout/providers
- TypeScript-first contracts and shared types
- Tailwind CSS v4 setup with semantic design tokens
- Light and Dark themes via class-based theming
- Basic Component Library for common UI needs
- API Configuration Structure using an extensible base HTTP client
- Documentation with Storybook (visual + interaction stories)
- Automatic testing (unit + Storybook interaction testing)
- Linting and Formatting (ESLint + Prettier plugins)

## Tech Stack

- Next.js `16.1.6`
- React `19.2.3`
- TypeScript `^5`
- Tailwind CSS `^4`
- Storybook `^10.2.17` (Next.js + Vite)
- Vitest `^4.0.18` + Playwright for browser-based Storybook tests
- ESLint `^9` + `eslint-plugin-perfectionist`
- Prettier + organize imports + Tailwind class sorting

## Why Use This Starter

- Faster kickoff: skip repetitive setup and start with app-level conventions already in place.
- Better consistency: shared UI components, styles, and lint rules reduce drift across features.
- Safer development: sanitization utilities, typed API contracts, and test coverage for critical utilities.
- Better maintainability: clear structure (`app`, `shared`, `modules`, `stories`, `__tests__`) and predictable patterns.
- Public-friendly baseline: Storybook docs and explicit roadmap make onboarding easier for contributors.

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm

### Install

```bash
pnpm install
```

### Run application

```bash
pnpm dev
```

### Run Storybook

```bash
pnpm storybook
```

### Build

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

### Tests

```bash
# Storybook interaction tests
pnpm test-storybook

# Unit tests (Vitest unit project)
pnpm vitest --project=unit
```

## Implemented Features

### 1. React.js

Implemented through reusable and composable components in `shared/` and layout modules in `modules/layout/`.

Benefit:

- Component reuse and compositional patterns reduce duplicate UI code and make it reactive.

### 2. Next.js

Implemented with App Router structure and global app shell in `app/layout.tsx`.

Benefit:

- A ready app shell (topbar, sidebar, content container, providers) accelerates feature development.
- Even when not all capabilities are used yet, the framework already enables high-value patterns such as dynamic HTML streaming, Server Components, Server Actions, hybrid client/server rendering, and a production-ready bundler/optimizer pipeline.

### 3. TypeScript

Implemented with strict typing and shared contracts in `shared/types/` and `tsconfig.json` path aliases.

Benefit:

- Strong contracts reduce runtime mistakes and improve editor tooling/autocomplete.

### 4. Tailwind

Implemented in `app/globals.css` and component utility classes, with Tailwind v4 integration.

Benefit:

- Fast UI iteration with consistent utility-first styling.

### 5. Design Tokens

Implemented as semantic CSS variables and mapped Tailwind theme tokens in `app/globals.css`, plus color catalog in `shared/constants/colors.data.ts`.

Benefit:

- Tokenized design makes visual customization and brand adaptation easier.

### 6. Light and Dark Themes

Implemented with `next-themes` (`ThemeProvider`) and class-based token overrides in `.dark`.

Benefit:

- Theme support is built-in from day one, not added later as technical debt.

### 7. Basic Component Library

Implemented in `shared/` with ready components for forms, feedback, overlays, layout, and navigation.

Examples:

- Inputs and controls: Button, Input, Select, Multiselect, Checkbox
- Feedback/display: Toast, Chip, Avatar, DetailRow, Spinner, Skeleton
- Overlays/composition: Dialog, Drawer, Dropdown, Tabs

Benefit:

- Covers common UI needs so product features can be built immediately.

### 8. API Configuration Structure

Implemented with `shared/apis/base.api.ts` abstract client.

Includes:

- GET/POST/PATCH/DELETE helpers
- FormData support
- Header composition and auth hook (`getAuth`)
- Query param builder
- Error logging with response context
- Optional request sanitization controls

Benefit:

- Standardized API communication and easier extension per domain service.

### 9. Documentation with Storybook

Implemented with Storybook 10 config in `.storybook/` and stories under `stories/` + `shared/**/*.stories.tsx`.

Includes:

- Docs and controls for component props
- Theme switch support in preview decorators
- A11y addon enabled

Benefit:

- Components are discoverable, testable, and easier to review by designers/devs.

### 10. Automatic Testing

Implemented with Vitest multi-project setup:

- Unit tests in `__tests__/apis/` and `__tests__/services/`
- Storybook interaction tests via `@storybook/addon-vitest` + Playwright

Benefit:

- Critical logic and component behavior are validated continuously.

### 11. Linting and Formatting

Implemented with ESLint + Next.js rules + TypeScript + Storybook config and Perfectionist sorting rules, plus Prettier plugins.

Benefit:

- Consistent code style and import/type ordering improve readability and reduce code review noise.

## Project Structure

```text
.
├─ app/                    # Next.js app router shell, global styles, root page
├─ modules/
│  └─ layout/              # Layout module (Topbar, Navbar, MainContainer, Logo)
├─ shared/                 # Reusable components, hooks, contexts, services, types, constants, api base
├─ stories/                # Storybook stories and MDX docs
├─ __tests__/              # Unit tests (API and services)
├─ .storybook/             # Storybook configuration and test setup
├─ public/                 # Static assets
├─ vitest.config.ts        # Vitest projects (storybook + unit)
├─ eslint.config.mjs       # Linting rules and quality conventions
└─ package.json            # Scripts and dependencies
```

### Modules Strategy (Domain-Oriented)

The `modules/` folder is intentionally designed for future domain-based implementation boundaries.

Examples of domains:

- `auth`
- `product`
- `post`
- `user`

Each domain module should encapsulate its own implementation details, usually with:

- components
- services
- types
- constants
- hooks (when domain-specific)
- api adapters/use cases (when needed)

Example:

```text
modules/
├─ auth/
│  ├─ components/
│  ├─ services/
│  ├─ types/
│  └─ constants/
├─ product/
│  ├─ components/
│  ├─ services/
│  ├─ types/
│  └─ constants/
└─ layout/
```

Benefit:

- Better scalability and maintainability by grouping code by business domain instead of technical layer only.

## Patterns and Conventions

### Component patterns

- Compound component pattern is used in complex UI parts (Dialog, Drawer, Dropdown, Tabs).
- Interactive components are client components where needed.
- Context-based state is used for shared interaction state (drawer/dropdown).

### Styling patterns

- Semantic tokens (`--background`, `--text`, `--surface`, etc.) drive theme behavior.
- Tailwind utilities are used consistently with custom theme mapping.

### API and security patterns

- Base API class centralizes request behavior and error treatment.
- Sanitization helpers are used to mitigate script injection risks in payload processing.

### Code quality conventions

- ESLint enforces framework best practices and quality checks.
- Perfectionist rules enforce deterministic ordering (imports, unions, interfaces, objects, exports).
- Prettier plugins organize imports and Tailwind classes.

## Quality and Testing Details

Current tested domains:

- API layer behavior (auth, headers, methods, params, error handling)
- Service utilities (logger, sanitization, helper functions)
- Component interactions in stories (for key interactive components)

Current strategy:

- Unit tests focus on logic and behavior.
- Storybook tests validate component interactions in browser context.

## Storybook Coverage Snapshot

Stories currently document most shared components, including Button, Input, Dialog, Drawer, Dropdown, Tabs, Toast, Select, Multiselect, Avatar, Box, and others.

## Current Gaps / Roadmap

This starter is functional and ready to use, but transparency matters for public usage. Current gaps to improve over time:

- Add dedicated page/layout integration tests.
- Add end-to-end user journey tests.
- Add explicit a11y assertions beyond addon presence.
- Add coverage threshold enforcement in CI.
- Optionally add badges (tests, lint, coverage, storybook build).

## Who This Boilerplate Is For

- New product kickoffs (MVPs, admin panels, SaaS dashboards)
- Teams wanting a typed and documented UI baseline
- Developers who prefer predictable architecture and shared conventions

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this boilerplate for commercial and personal projects.
