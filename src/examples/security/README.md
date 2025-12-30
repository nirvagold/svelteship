# Security Settings Example

Password change and account deletion functionality.

## Features

- Change password with current password verification
- Password validation (minimum 8 characters)
- Invalidate all other sessions after password change
- Account deletion with confirmation
- GDPR-compliant data removal

## Setup

### 1. Copy Files

```bash
cp -r src/examples/security src/routes/(app)/settings/security
```

### 2. Add to Settings Navigation

If using tabbed settings, add to navigation:

```svelte
<a href="/settings/security">Security</a>
```

### 3. Email Service (Optional)

For account deletion confirmation email, configure email service in `src/lib/server/email.ts`:

```typescript
export async function sendAccountDeletedEmail(email: string): Promise<void> {
  // Your email implementation
}
```

## Files

- `+page.svelte` - Security settings UI
- `+page.server.ts` - Password change, account deletion actions
- `security.test.ts` - Property-based tests

## Security Properties

1. **Password change requires correct current password** - Cannot change without verification
2. **Password change invalidates other sessions** - Security measure after password update
3. **Account deletion removes all data** - GDPR compliance

## Password Requirements

- Minimum 8 characters
- Must confirm new password
- Current password required for verification

## Account Deletion

- Requires password confirmation
- Requires typing "DELETE" to confirm
- Removes all user data:
  - User record
  - Sessions
  - Notifications
  - Password reset tokens
  - Email verification tokens
- Sends confirmation email
