# 🚀 Svelteship

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-FF3E00?logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)

**Production-ready SvelteKit boilerplate** with authentication, database, UI components, and advanced features. Ship modern web applications quickly and securely.

[Preview](https://nirvagold.github.io/svelteship/preview/) · [Documentation](#documentation) · [Report Bug](https://github.com/nirvagold/svelteship/issues) · [Request Feature](https://github.com/nirvagold/svelteship/issues)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Environment Variables](#-environment-variables)
- [Database](#-database)
- [Authentication](#-authentication)
- [UI Components](#-ui-components)
- [Advanced Features](#-advanced-features)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Authentication & Security
- 🔐 **Complete Auth System** - Register, login, logout with session management
- �  **OAuth Integration** - Google and GitHub social login
- �️ *P*Secure Sessions** - HTTP-only cookies with secure flags
- 🔒 **Password Hashing** - Argon2 algorithm for maximum security
- 🚪 **Protected Routes** - Automatic redirect for unauthenticated users
- � **Email rVerification** - Verify user emails with tokens
- � **Passwlord Reset** - Secure password recovery flow

### Database & ORM
- 🗄️ **PostgreSQL** - Robust relational database
- 📊 **Drizzle ORM** - Type-safe SQL query builder
- 🔄 **Migrations** - Version-controlled database schema
- 🐳 **Docker Setup** - One-command local database

### UI & Styling
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🌸 **DaisyUI** - Beautiful component library (32+ themes)
- 🌓 **Theme Selector** - Full theme support with persistence
- �  **Responsive** - Mobile-first design
- 🧩 **Layout Components** - Sidebar, Topbar, Centered, Split layouts
- 📝 **Form Components** - Input, Select, Checkbox, Radio, Textarea, DatePicker, FileInput

### Advanced Features (v0.5.0)
- 🌐 **Internationalization (i18n)** - Multi-language support (EN, ID)
- 📧 **Email Service** - Resend integration with HTML templates
- 📁 **File Storage** - Local, S3, and Cloudflare R2 support
- 📡 **Real-time SSE** - Server-Sent Events for notifications
- 📊 **Analytics** - Plausible, Umami, Google Analytics support
- 📝 **Structured Logging** - JSON logging with Sentry integration
- 📚 **API Documentation** - Interactive API docs page
- 🛠️ **CLI Generator** - Generate components, routes, and APIs

### Developer Experience
- 📝 **TypeScript** - Full type safety
- ⚡ **Vite** - Lightning-fast HMR
- 🧪 **Testing** - Unit, property-based, and E2E tests (476+ tests)
- 📦 **Pre-built Components** - 16+ UI components ready to use

---

## �️ Tecch Stack

| Category | Technology |
|----------|------------|
| **Framework** | [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [DaisyUI 5](https://daisyui.com/) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [Lucia Auth 3](https://lucia-auth.com/) |
| **Email** | [Resend](https://resend.com/) |
| **Storage** | Local / AWS S3 / Cloudflare R2 |
| **Testing** | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) + [fast-check](https://fast-check.dev/) |
| **Container** | [Docker](https://www.docker.com/) |

---

## 🚀 Quick Start

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Docker](https://www.docker.com/) (for PostgreSQL)
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/nirvagold/svelteship.git
cd svelteship

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
svelteship/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/           # UI primitives (Button, Modal, Toast, etc.)
│   │   │   ├── forms/        # Form components (Input, Select, etc.)
│   │   │   └── layouts/      # Layout components (Sidebar, Topbar, etc.)
│   │   ├── hooks/            # Svelte hooks (useDebounce, useForm, useSSE, etc.)
│   │   ├── utils/            # Shared utilities (date, currency, etc.)
│   │   ├── i18n/             # Internationalization (locales, translations)
│   │   ├── analytics/        # Analytics integration
│   │   └── server/           # Server-only code
│   │       ├── db/           # Database client & schema
│   │       ├── email/        # Email service & templates
│   │       ├── storage/      # File storage (local, S3, R2)
│   │       ├── oauth/        # OAuth providers (Google, GitHub)
│   │       ├── logger.ts     # Structured logging
│   │       ├── sse.ts        # Server-Sent Events
│   │       └── auth.ts       # Lucia configuration
│   ├── routes/
│   │   ├── (auth)/           # Auth pages (login, register, logout, oauth)
│   │   ├── (app)/            # Protected pages (dashboard, profile, settings)
│   │   ├── api/              # API endpoints
│   │   │   ├── docs/         # Interactive API documentation
│   │   │   └── notifications/# SSE notification stream
│   │   ├── docs/             # Component documentation
│   │   └── +page.svelte      # Landing page
│   ├── examples/             # Optional features (copy if needed)
│   │   ├── notifications/    # Notification system
│   │   ├── onboarding/       # Onboarding wizard
│   │   ├── admin/            # Admin dashboard
│   │   ├── sessions/         # Session management
│   │   └── security/         # Password change, 2FA
│   └── hooks.server.ts       # Session validation middleware
├── scripts/
│   └── generate.ts           # CLI generator for components/routes/APIs
├── drizzle/                  # Database migrations
├── e2e/                      # Playwright E2E tests
├── static/                   # Static assets
└── docker-compose.yml        # PostgreSQL container
```

---

## 📖 Documentation

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run svelte-check |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run generate` | CLI generator for components/routes/APIs |

---

## 🔧 Environment Variables

Create a `.env` file in the root directory. See [.env.example](.env.example) for all available options:

```env
# Database
DATABASE_URL=postgres://svelteship:svelteship@localhost:5432/svelteship

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Email (optional)
EMAIL_PROVIDER=console  # or "resend"
RESEND_API_KEY=

# Storage (optional)
STORAGE_PROVIDER=local  # or "s3", "r2"

# Analytics (optional)
ANALYTICS_PROVIDER=     # "plausible", "umami", "google", "custom"
```

---

## �️ Database

### Schema

The database includes these main tables:

| Table | Description |
|-------|-------------|
| `users` | User accounts with email, password, preferences |
| `sessions` | Active user sessions |
| `oauth_accounts` | Linked OAuth providers (Google, GitHub) |
| `email_verification_tokens` | Email verification tokens |
| `password_reset_tokens` | Password reset tokens |

### Commands

```bash
# Start PostgreSQL
docker-compose up -d

# Stop PostgreSQL
docker-compose down

# Generate new migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Open database GUI
npm run db:studio
```

---

## 🔐 Authentication

Svelteship uses [Lucia Auth](https://lucia-auth.com/) for authentication.

### Features

- **Registration** - Email/password with validation
- **Login** - Secure session creation
- **Logout** - Session invalidation
- **OAuth** - Google and GitHub social login
- **Email Verification** - Verify user emails
- **Password Reset** - Secure recovery flow
- **Protected Routes** - Automatic auth guards
- **Session Refresh** - Automatic token renewal

### OAuth Setup

1. Create OAuth app on [Google Cloud Console](https://console.cloud.google.com/apis/credentials) or [GitHub Developer Settings](https://github.com/settings/developers)
2. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GITHUB_CLIENT_ID=your-client-id
   GITHUB_CLIENT_SECRET=your-client-secret
   ```
3. OAuth buttons will appear on login page automatically

---

## 🎨 UI Components

### UI Primitives (`src/lib/components/ui/`)

| Component | Description |
|-----------|-------------|
| Button | Buttons with variants, sizes, loading state |
| Modal | Dialog with backdrop, sizes, close button |
| Toast | Notification toasts with auto-dismiss |
| ConfirmDialog | Confirmation dialogs with callbacks |
| Dropdown | Dropdown menus with keyboard navigation |
| Tabs | Tab navigation with panels |
| Accordion | Collapsible content sections |
| Table | Data tables with sorting |
| Pagination | Page navigation with ellipsis |
| Tooltip | Hover tooltips with positions |
| Badge | Status badges with variants |
| Avatar | User avatars with fallback |
| Progress | Progress bars with animation |
| Spinner | Loading spinners |
| Skeleton | Loading placeholders |
| Breadcrumb | Navigation breadcrumbs |

### Form Components (`src/lib/components/forms/`)

| Component | Description |
|-----------|-------------|
| Input | Text input with label, error, helper text |
| Select | Dropdown select with options |
| Checkbox | Checkbox with label |
| Radio | Radio group with options |
| Textarea | Multi-line input with character count |
| DatePicker | Date selection with min/max |
| FileInput | File upload with drag-drop and preview |

### Layout Components (`src/lib/components/layouts/`)

```svelte
<script>
  import { SidebarLayout, TopbarLayout, CenteredLayout, SplitLayout } from '$lib/components/layouts';
</script>

<!-- Sidebar navigation -->
<SidebarLayout navItems={items} collapsible>
  <main>Content</main>
</SidebarLayout>

<!-- Top navigation bar -->
<TopbarLayout navItems={items} sticky>
  <main>Content</main>
</TopbarLayout>

<!-- Centered content (auth pages) -->
<CenteredLayout size="md" background="gradient">
  <div class="card">Login form</div>
</CenteredLayout>

<!-- Two-column layout -->
<SplitLayout ratio="1/2">
  {#snippet left()}<aside>Sidebar</aside>{/snippet}
  {#snippet right()}<main>Content</main>{/snippet}
</SplitLayout>
```

---

## 🚀 Advanced Features

### Internationalization (i18n)

```typescript
import { t, locale, setLocale } from '$lib/i18n';

// Get translation
const greeting = t('common.welcome'); // "Welcome" or "Selamat Datang"

// Change language
setLocale('id'); // Switch to Indonesian

// Format date/number by locale
import { formatDate, formatNumber } from '$lib/i18n';
formatDate(new Date()); // "December 30, 2024" or "30 Desember 2024"
formatNumber(1234.56);  // "1,234.56" or "1.234,56"
```

### Email Service

```typescript
import { sendEmail } from '$lib/server/email';

// Send verification email
await sendEmail({
  to: 'user@example.com',
  subject: 'Verify your email',
  template: 'verification',
  variables: { name: 'John', link: 'https://...' }
});
```

### File Storage

```typescript
import { storage } from '$lib/server/storage';

// Upload file
const url = await storage.upload(file, 'uploads/avatar.png');

// Delete file
await storage.delete('uploads/avatar.png');

// List files
const files = await storage.list('uploads/');
```

### Real-time SSE

```typescript
// Client-side
import { useSSE } from '$lib/hooks/useSSE';

const { data, error, connected } = useSSE('/api/notifications/stream');

$effect(() => {
  if (data) {
    console.log('New notification:', data);
  }
});
```

### CLI Generator

```bash
# Generate a new component
npm run generate
# Select: component
# Name: MyComponent
# Creates: src/lib/components/ui/MyComponent.svelte

# Generate a new route
npm run generate
# Select: route
# Path: /dashboard/analytics
# Creates: src/routes/dashboard/analytics/+page.svelte

# Generate a new API endpoint
npm run generate
# Select: api
# Path: /api/users
# Creates: src/routes/api/users/+server.ts
```

---

## 📦 Examples

Optional features in `src/examples/` that you can copy into your project:

| Example | Description |
|---------|-------------|
| `notifications/` | Full notification system with database |
| `onboarding/` | Multi-step onboarding wizard |
| `admin/` | Admin dashboard with role-based access |
| `sessions/` | Session management UI |
| `security/` | Password change, 2FA settings |

### Using Examples

```bash
# Example: Add notifications
cp -r src/examples/notifications src/routes/(app)/notifications
```

Each example includes README with setup instructions.

---

## 🧪 Testing

Svelteship includes comprehensive testing with **476+ tests**:

### Unit Tests (Vitest)

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test -- --coverage
```

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

### Test Coverage

- ✅ Input validation (email, password)
- ✅ Authentication flows (register, login, logout, OAuth)
- ✅ Protected route guards
- ✅ Profile management
- ✅ Theme persistence
- ✅ Form components
- ✅ i18n translations
- ✅ Email service
- ✅ File storage
- ✅ SSE hooks
- ✅ Analytics

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "build"]
```

### Environment Setup

Set these environment variables in your deployment platform:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to `production`
- OAuth, Email, Storage credentials as needed

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - The web framework
- [Lucia Auth](https://lucia-auth.com/) - Authentication library
- [Drizzle ORM](https://orm.drizzle.team/) - Database toolkit
- [DaisyUI](https://daisyui.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Resend](https://resend.com/) - Email service

---

<p align="center">
  Made with ❤️ by the Svelteship Team
</p>

<p align="center">
  <a href="#-svelteship">Back to top ↑</a>
</p>
