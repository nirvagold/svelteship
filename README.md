# 🚀 Svelteship

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-FF3E00?logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)

**Production-ready SvelteKit boilerplate** with authentication, database, and UI components. Ship modern web applications quickly and securely.

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
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Authentication & Security
- 🔐 **Complete Auth System** - Register, login, logout with session management
- �️ **Securee Sessions** - HTTP-only cookies with secure flags
- 🔒 **Password Hashing** - Argon2 algorithm for maximum security
- 🚪 **Protected Routes** - Automatic redirect for unauthenticated users

### Database & ORM
- 🗄️ **PostgreSQL** - Robust relational database
- 📊 **Drizzle ORM** - Type-safe SQL query builder
- 🔄 **Migrations** - Version-controlled database schema
- 🐳 **Docker Setup** - One-command local database

### UI & Styling
- 🎨 **Tailwind CSS 4** - Utility-first CSS framework
- 🌸 **DaisyUI** - Beautiful component library (32+ themes)
- 🌓 **Theme Selector** - Full theme support with persistence
- 📱 **Responsive** - Mobile-first design
- 🧩 **Layout Components** - Sidebar, Topbar, Centered, Split layouts

### Developer Experience
- 📝 **TypeScript** - Full type safety
- ⚡ **Vite** - Lightning-fast HMR
- 🧪 **Testing** - Unit, property-based, and E2E tests
- 📦 **Pre-built Components** - Button, Input, Card, Alert

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) + [DaisyUI 5](https://daisyui.com/) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [Lucia Auth 3](https://lucia-auth.com/) |
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
│   │   │   └── layouts/      # Layout components (Sidebar, Topbar, etc.)
│   │   ├── hooks/            # Svelte hooks (useDebounce, useForm, etc.)
│   │   ├── utils/            # Shared utilities (date, currency, etc.)
│   │   └── server/           # Server-only code
│   │       ├── db/           # Database client & schema
│   │       └── auth.ts       # Lucia configuration
│   ├── routes/
│   │   ├── (auth)/           # Auth pages (login, register, logout)
│   │   ├── (app)/            # Protected pages (dashboard, profile, settings)
│   │   ├── docs/             # Component documentation
│   │   └── +page.svelte      # Landing page
│   ├── examples/             # Optional features (copy if needed)
│   │   ├── notifications/    # Notification system
│   │   ├── onboarding/       # Onboarding wizard
│   │   ├── admin/            # Admin dashboard
│   │   ├── sessions/         # Session management
│   │   └── security/         # Password change, 2FA
│   └── hooks.server.ts       # Session validation middleware
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

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgres://svelteship:svelteship@localhost:5432/svelteship
```

See [.env.example](.env.example) for all available options.

---

## 🗄️ Database

### Schema

The database includes two main tables:

**Users Table**
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (nanoid) |
| email | TEXT | Unique email address |
| password_hash | TEXT | Argon2 hashed password |
| name | TEXT | Display name (optional) |
| created_at | TIMESTAMP | Account creation time |
| updated_at | TIMESTAMP | Last update time |

**Sessions Table**
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Session token |
| user_id | TEXT | Foreign key to users |
| expires_at | TIMESTAMP | Session expiration |

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
- **Protected Routes** - Automatic auth guards
- **Session Refresh** - Automatic token renewal

### Route Groups

| Group | Path | Description |
|-------|------|-------------|
| `(auth)` | `/login`, `/register`, `/logout` | Public auth pages |
| `(app)` | `/dashboard`, `/profile` | Protected pages |

### Usage Example

```typescript
// Access user in +page.server.ts
export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(302, '/login');
  }
  return { user: locals.user };
};
```

---

## 🎨 UI Components

Pre-built components in `src/lib/components/ui/`:

### Available Components

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

### Layout Components

Layout components in `src/lib/components/layouts/`:

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

### Theme Selector

```svelte
<script>
  import ThemeSelector from '$lib/components/ThemeSelector.svelte';
</script>

<ThemeSelector showLabel size="sm" />
```

---

## 📦 Examples

Svelteship includes optional features in `src/examples/` that you can copy into your project:

| Example | Description |
|---------|-------------|
| `notifications/` | Full notification system with database |
| `onboarding/` | Multi-step onboarding wizard |
| `admin/` | Admin dashboard with role-based access |
| `sessions/` | Session management UI |
| `security/` | Password change, 2FA settings |

### Using Examples

1. Copy the example folder to your routes
2. Follow the README in each example
3. Add required database schema if needed

```bash
# Example: Add notifications
cp -r src/examples/notifications src/routes/(app)/notifications
```

Each example includes:
- `README.md` - Setup instructions
- `+page.svelte` - Route component
- `+page.server.ts` - Server logic
- `schema.ts` - Database schema (if needed)

---

## 🧪 Testing

Svelteship includes comprehensive testing:

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
- ✅ Authentication flows (register, login, logout)
- ✅ Protected route guards
- ✅ Profile management
- ✅ Theme persistence

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

---

## 📬 Contact

- GitHub Issues: [Report a bug](https://github.com/yourusername/svelteship/issues)
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

<p align="center">
  Made with ❤️ by the Svelteship Team
</p>

<p align="center">
  <a href="#-svelteship">Back to top ↑</a>
</p>
