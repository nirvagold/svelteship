# Contributing to Svelteship

Thank you for your interest in contributing to Svelteship! 🎉

This document provides guidelines and steps for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Be kind, constructive, and professional in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- Git

### Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/nirvagold/svelteship.git
   cd svelteship
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Setup environment**
   ```bash
   cp .env.example .env
   ```

5. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

6. **Run migrations**
   ```bash
   npm run db:migrate
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following the code style guide

3. **Run quality checks**
   ```bash
   npm run check      # Type checking
   npm run lint       # Linting
   npm run test       # Tests
   ```

4. **Commit your changes** with a descriptive message

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

## Code Style Guide

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string | null;
}

// Avoid
const user: any = { ... };
```

### Svelte Components

- Use Svelte 5 runes (`$props()`, `$state()`, etc.)
- Use `{@render}` for snippets
- Keep components focused and reusable

```svelte
<script lang="ts">
  interface Props {
    title: string;
    variant?: 'primary' | 'secondary';
  }
  
  let { title, variant = 'primary' }: Props = $props();
</script>
```

### File Naming

- Svelte components: `PascalCase.svelte` (e.g., `Button.svelte`)
- TypeScript modules: `camelCase.ts` (e.g., `validation.ts`)
- Test files: `*.test.ts` alongside source files

### Imports

- Use `$lib` alias for imports from `src/lib`
- Group imports: external, then internal, then relative

```typescript
// External
import { redirect } from '@sveltejs/kit';

// Internal ($lib)
import { lucia } from '$lib/server/auth';
import { Button } from '$lib/components/ui';

// Relative
import type { PageServerLoad } from './$types';
```

## Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add password reset functionality
fix(login): resolve redirect loop on expired session
docs(readme): update installation instructions
test(validation): add property tests for email validation
```

## Pull Request Process

1. **Ensure your PR**:
   - Has a clear title and description
   - References any related issues
   - Includes tests for new functionality
   - Passes all CI checks

2. **PR Title Format**:
   ```
   feat(scope): Brief description
   ```

3. **PR Description Template**:
   - What changes were made
   - Why the changes were needed
   - How to test the changes
   - Screenshots (for UI changes)

4. **Review Process**:
   - Wait for maintainer review
   - Address feedback promptly
   - Keep discussions constructive

5. **Merge Requirements**:
   - All CI checks pass
   - At least one maintainer approval
   - No unresolved conversations

## Reporting Issues

### Bug Reports

Include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, browser)
- Screenshots or error logs if applicable

### Feature Requests

Include:
- Clear description of the feature
- Use case / motivation
- Proposed implementation (optional)
- Alternatives considered

## Questions?

- Open a [GitHub Discussion](https://github.com/nirvagold/svelteship/discussions) for questions
- Open an [Issue](https://github.com/nirvagold/svelteship/issues) for bugs or feature requests

---

Thank you for contributing! 🚀
