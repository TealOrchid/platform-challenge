# Contributing

## Branching Strategy

- `main` — protected; production-ready. All changes via PR.
- `feature/<name>` — new features.
- `fix/<name>` — bug fixes.
- `chore/<name>` — CI, tooling, docs, configuration.

Every branch must have a purpose and reference an issue where possible.

## Workflow

1. Pick or open an issue.
2. Create a branch from `main` using the correct prefix.
3. Commit with meaningful messages (imperative mood, e.g. "Add task listing endpoint").
4. Open a Pull Request using the PR template.
5. Request a review from a teammate.
6. Ensure CI passes and the review is approved.
7. Squash or merge via the GitHub UI. Do not push directly to `main`.

## Commit Message Guidelines

- Good: `Add regression test for invalid status`
- Bad: `update`, `fix`, `final`, `final-final`