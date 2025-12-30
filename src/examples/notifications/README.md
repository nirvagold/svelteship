# Notifications Example

A full notification system with mark as read, mark all read, and delete functionality.

## Features

- List all notifications sorted by date (newest first)
- Mark individual notifications as read
- Mark all notifications as read
- Delete notifications
- Visual indicators for unread notifications
- Type-based styling (info, success, warning, error)

## Setup

### 1. Database Schema

Add the notifications table to your schema (`src/lib/server/db/schema.ts`):

```typescript
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'info' | 'success' | 'warning' | 'error'
  read: boolean('read').default(false).notNull(),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
```

### 2. Run Migration

```bash
npm run db:generate
npm run db:migrate
```

### 3. Copy Files

```bash
cp -r src/examples/notifications src/routes/(app)/notifications
```

### 4. Update Navigation (Optional)

Add to your sidebar in `src/routes/(app)/+layout.svelte`:

```svelte
<li>
  <a href="/notifications">
    🔔 Notifications
    {#if unreadCount > 0}
      <span class="badge badge-sm badge-error">{unreadCount}</span>
    {/if}
  </a>
</li>
```

## Usage

### Creating Notifications

```typescript
import { db } from '$lib/server/db';
import { notifications } from '$lib/server/db/schema';
import { generateId } from '$lib/utils/id';

await db.insert(notifications).values({
  id: generateId(),
  userId: user.id,
  title: 'Welcome!',
  message: 'Thanks for signing up.',
  type: 'success',
  link: '/dashboard'
});
```

### Notification Types

- `info` - General information (blue)
- `success` - Positive actions (green)
- `warning` - Warnings (yellow)
- `error` - Errors or alerts (red)

## Files

- `+page.svelte` - Notifications list UI
- `+page.server.ts` - Server actions (load, markRead, markAllRead, delete)
- `notifications.test.ts` - Property-based tests
