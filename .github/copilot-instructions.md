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
