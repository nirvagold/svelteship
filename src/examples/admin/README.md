# Admin Dashboard Example

An admin panel with role-based access control and user statistics.

## Features

- Role-based access control (admin/superadmin only)
- Dashboard with user statistics
- Sidebar navigation
- Breadcrumb navigation
- Quick actions

## Setup

### 1. Database Schema

Ensure users table has `role` field (`src/lib/server/db/schema.ts`):

```typescript
export const users = pgTable('users', {
  // ... existing fields
  role: text('role').default('user').notNull(), // 'user' | 'admin' | 'superadmin'
});
```

### 2. Copy Files

```bash
# Copy as route group
mkdir -p src/routes/\(admin\)
cp -r src/examples/admin/* src/routes/\(admin\)/
```

### 3. Create Unauthorized Page

Create `src/routes/unauthorized/+page.svelte`:

```svelte
<div class="min-h-screen flex items-center justify-center">
  <div class="text-center">
    <h1 class="text-4xl font-bold mb-4">🚫 Unauthorized</h1>
    <p class="mb-4">You don't have permission to access this page.</p>
    <a href="/dashboard" class="btn btn-primary">Go to Dashboard</a>
  </div>
</div>
```

### 4. Promote User to Admin

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Or via Drizzle:

```typescript
await db.update(users)
  .set({ role: 'admin' })
  .where(eq(users.email, 'your@email.com'));
```

## Files

- `+layout.svelte` - Admin layout with sidebar
- `+layout.server.ts` - Role-based access check
- `admin-dashboard/+page.svelte` - Dashboard UI
- `admin-dashboard/+page.server.ts` - Stats queries
- `admin.test.ts` - Property-based tests

## Extending

### Add New Admin Pages

1. Create folder in `(admin)/`:
   ```
   src/routes/(admin)/users/+page.svelte
   ```

2. Add to navigation in `+layout.svelte`:
   ```typescript
   const navItems = [
     // ... existing
     { href: '/admin/users', label: 'Users', icon: '👥' }
   ];
   ```

### Custom Permissions

Extend role checking in `+layout.server.ts`:

```typescript
// Allow specific roles
const allowedRoles = ['admin', 'superadmin', 'moderator'];
if (!allowedRoles.includes(locals.user.role)) {
  throw redirect(302, '/unauthorized');
}
```
