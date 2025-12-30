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
- 🌸 **DaisyUI** - Beautiful component library
- 🌓 **Dark Mode** - Theme toggle with persistence
- 📱 **Responsive** - Mobile-first design

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
│   │   ├── components/       # Reusable Svelte components
│   │   │   ├── ui/           # UI primitives (Button, Input, Card, Alert)
│   │   │   └── ThemeToggle.svelte
│   │   ├── server/           # Server-only code
│   │   │   ├── db/           # Database client & schema
│   │   │   └── auth.ts       # Lucia configuration
│   │   └── utils/            # Shared utilities
│   ├── routes/
│   │   ├── (auth)/           # Auth pages (login, register, logout)
│   │   ├── (app)/            # Protected pages (dashboard, profile)
│   │   └── +page.svelte      # Landing page
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

### Button

```svelte
<script>
  import { Button } from '$lib/components/ui';
</script>

<Button variant="primary" size="md">Click me</Button>
<Button variant="danger" loading={true}>Loading...</Button>
```

**Props:** `variant` (primary/secondary/danger/ghost), `size` (sm/md/lg), `loading`, `disabled`

### Input

```svelte
<script>
  import { Input } from '$lib/components/ui';
</script>

<Input type="email" label="Email" error="Invalid email" bind:value={email} />
```

**Props:** `type` (text/email/password), `label`, `error`, `value`

### Card

```svelte
<script>
  import { Card } from '$lib/components/ui';
</script>

<Card title="Card Title">
  Card content goes here
</Card>
```

**Props:** `title`

### Alert

```svelte
<script>
  import { Alert } from '$lib/components/ui';
</script>

<Alert variant="success" dismissible>Operation successful!</Alert>
```

**Props:** `variant` (success/error/warning/info), `dismissible`

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
