# Onboarding Example

A multi-step onboarding wizard for new users with profile setup and preferences.

## Features

- Multi-step wizard with progress indicator
- Profile completion (name)
- Preference settings (theme, language, notifications)
- Skip option for users who want to complete later
- Redirect to dashboard after completion

## Setup

### 1. Database Schema

Add `onboardingCompleted` field to users table (`src/lib/server/db/schema.ts`):

```typescript
export const users = pgTable('users', {
  // ... existing fields
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
});
```

### 2. Run Migration

```bash
npm run db:generate
npm run db:migrate
```

### 3. Copy Files

```bash
# Copy route files
cp -r src/examples/onboarding src/routes/(app)/onboarding

# Copy component
cp src/examples/onboarding/Onboarding.svelte src/lib/components/Onboarding.svelte
```

### 4. Add Onboarding Check to App Layout

Update `src/routes/(app)/+layout.server.ts`:

```typescript
export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    throw redirect(302, '/login');
  }

  // Redirect to onboarding if not completed
  if (!locals.user.onboardingCompleted && !url.pathname.startsWith('/onboarding')) {
    throw redirect(302, '/onboarding');
  }

  return { user: locals.user };
};
```

## Files

- `+page.svelte` - Onboarding wizard page
- `+page.server.ts` - Server logic (load user, save preferences)
- `Onboarding.svelte` - Reusable wizard component
- `onboarding.test.ts` - Property-based tests

## Customization

### Adding Steps

Edit the `steps` array in `+page.svelte`:

```typescript
const steps = [
  { id: 'welcome', title: 'Welcome!', description: '...' },
  { id: 'profile', title: 'Your Profile', description: '...' },
  // Add more steps here
  { id: 'ready', title: 'All Set!', description: '...' }
];
```

### Custom Step Content

Use the snippet to render custom content for each step:

```svelte
<Onboarding {steps} bind:currentStep>
  {#snippet children({ step })}
    {#if step.id === 'custom'}
      <!-- Your custom content -->
    {/if}
  {/snippet}
</Onboarding>
```
