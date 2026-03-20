# Contributing Guide

Thank you for contributing to Best EP Lawyers! Please read this guide before opening a pull request.

---

## Getting started

1. Fork the repository and create your branch from `main`.
2. Follow the [SETUP.md](./SETUP.md) guide to get a local environment running.
3. Make your changes, then open a pull request against `main`.

---

## Branch naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<short-description>` | `feat/firm-search-filters` |
| Bug fix | `fix/<short-description>` | `fix/auth-redirect-loop` |
| Docs | `docs/<short-description>` | `docs/update-setup-guide` |
| Chore | `chore/<short-description>` | `chore/upgrade-vite` |

---

## Code standards

### TypeScript
- Enable strict mode for new files (`strict: true` in tsconfig is recommended).
- Prefer explicit return types on exported functions.
- Avoid `any`; use `unknown` or a proper type instead.

### React
- Prefer functional components with hooks.
- Keep components small and single-purpose.
- Colocate component-specific styles/hooks near the component file.
- Use `React.memo` only when you can measure a performance benefit.

### Styling
- Use Tailwind CSS utility classes.
- Follow the existing design token names defined in `tailwind.config.ts`.
- Avoid inline styles unless strictly necessary.

### Imports
- Use the `@/` path alias for imports from `src/` (e.g., `import { Button } from "@/components/ui/button"`).
- Group imports: external packages → internal `@/` paths → relative paths.

---

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(scope): <short summary>

[optional body]
[optional footer]
```

**Examples:**
```
feat(firms): add map view to firm listing page
fix(auth): handle OAuth callback errors gracefully
docs: update DEPLOYMENT.md with Stripe setup steps
chore(deps): upgrade supabase-js to 2.50.0
```

---

## Pull request checklist

Before opening a PR, confirm the following:

- [ ] `npm run lint` passes with no errors
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run build` succeeds
- [ ] New UI changes are tested in a browser
- [ ] No secrets or `.env` values are committed
- [ ] PR description explains *what* changed and *why*

---

## CI checks

Every PR automatically runs:
- **Lint** – ESLint with the project's `eslint.config.js`
- **Type check** – TypeScript compiler in `--noEmit` mode
- **Build** – Vite production build

All checks must pass before a PR can be merged.

---

## Reporting bugs

Open a GitHub Issue and include:
1. Steps to reproduce
2. Expected behaviour
3. Actual behaviour
4. Browser / OS / Node version

---

## Questions?

Open a GitHub Discussion or ping in the repo's Issues tab.
