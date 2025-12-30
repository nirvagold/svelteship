# Examples

This folder contains optional features that you can copy to your routes if needed. Each example is self-contained and includes setup instructions.

## Available Examples

| Example | Description | Dependencies |
|---------|-------------|--------------|
| [notifications](./notifications/) | Full notification system with mark read, delete | `notifications` table |
| [onboarding](./onboarding/) | Multi-step onboarding wizard | `onboardingCompleted` field |
| [admin](./admin/) | Admin dashboard with user management | `role` field on users |
| [sessions](./sessions/) | Active session management | Session metadata fields |
| [security](./security/) | Password change, account deletion | Password reset tokens |

## How to Use

1. **Copy the example folder** to your routes:
   ```bash
   # Example: Add notifications
   cp -r src/examples/notifications src/routes/(app)/notifications
   ```

2. **Apply database changes** if needed (check example's README)

3. **Update navigation** in your layout to include the new route

4. **Customize** the copied files to fit your needs

## Philosophy

These examples demonstrate patterns and implementations, but are intentionally **not** included in the core boilerplate. This keeps the base project minimal while providing reference implementations you can learn from or copy.

Each example includes:
- Route files (`+page.svelte`, `+page.server.ts`)
- Tests (`.test.ts`)
- README with setup instructions
- Database schema if needed (`schema.sql`)
