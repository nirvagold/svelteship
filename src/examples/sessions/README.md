# Sessions Management Example

View and manage active login sessions across devices.

## Features

- List all active sessions
- Show device/browser info from user agent
- Revoke individual sessions
- Revoke all sessions except current
- Visual indicator for current session

## Setup

### 1. Database Schema

Ensure sessions table has metadata fields (`src/lib/server/db/schema.ts`):

```typescript
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
```

### 2. Update Session Creation

When creating sessions, capture user agent and IP:

```typescript
// In your login action
const session = await lucia.createSession(user.id, {
  userAgent: request.headers.get('user-agent'),
  ipAddress: getClientAddress()
});
```

### 3. Copy Files

```bash
cp -r src/examples/sessions src/routes/(app)/settings/sessions
```

### 4. Add to Settings Navigation

If using tabbed settings, add to navigation:

```svelte
<a href="/settings/sessions">Sessions</a>
```

## Files

- `+page.svelte` - Sessions list UI
- `+page.server.ts` - Load sessions, revoke actions
- `sessions.test.ts` - Property-based tests

## Security Notes

- Users can only see/revoke their own sessions
- Current session cannot be revoked (use logout instead)
- Session revocation is immediate
