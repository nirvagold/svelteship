# 🚀 Svelteship

<div align="center">

<img src="static/favicon.png" alt="Svelteship Logo" width="120" />

**Full-stack SvelteKit boilerplate with authentication, database, and UI components ready to go.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange.svg)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00.svg)](https://svelte.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)

[Features](#-features) • [Preview](#-preview) • [Quick Start](#-quick-start) • [Tech Stack](#️-tech-stack) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 🔐 **Authentication** - Complete auth flow with Lucia Auth (register, login, logout, sessions)
- 🗄️ **Database Ready** - PostgreSQL with Drizzle ORM and type-safe queries
- 🎨 **UI Components** - Pre-built components with Tailwind CSS + DaisyUI
- 🌙 **Dark Mode** - Theme toggle with localStorage persistence
- 🛡️ **Protected Routes** - Auth guards for secure pages
- 👤 **User Profile** - Profile management out of the box
- 🐳 **Docker Setup** - Local PostgreSQL with docker-compose
- ✅ **TypeScript** - Full type safety with strict mode
- 🧪 **Testing** - Vitest + fast-check for property-based testing
- 📱 **Responsive** - Mobile-first responsive layout

## 📸 Preview

### 🏠 Landing Page

<table>
<tr>
<td>

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              🚀 Svelteship                      │
│                                                 │
│   Full-stack SvelteKit boilerplate with         │
│   authentication, database, and UI components   │
│   ready to use.                                 │
│                                                 │
│   ┌──────────────┐  ┌──────────────┐           │
│   │ Get Started  │  │   Sign In    │           │
│   └──────────────┘  └──────────────┘           │
│                                                 │
│   ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│   │   🔐    │  │   🗄️    │  │   🎨    │        │
│   │  Auth   │  │Database │  │   UI    │        │
│   │  Lucia  │  │ Drizzle │  │ DaisyUI │        │
│   └─────────┘  └─────────┘  └─────────┘        │
│                                                 │
└─────────────────────────────────────────────────┘
```

</td>
</tr>
</table>

### 🔑 Login Page

<table>
<tr>
<td>

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              Welcome Back                       │
│     Sign in to your Svelteship account          │
│                                                 │
│   ┌─────────────────────────────────────┐      │
│   │ Email                               │      │
│   │ you@example.com                     │      │
│   └─────────────────────────────────────┘      │
│                                                 │
│   ┌─────────────────────────────────────┐      │
│   │ Password                            │      │
│   │ ••••••••                            │      │
│   └─────────────────────────────────────┘      │
│                                                 │
│   ┌─────────────────────────────────────┐      │
│   │            Sign In                  │      │
│   └─────────────────────────────────────┘      │
│                                                 │
│   Don't have an account? Create one            │
│                                                 │
└─────────────────────────────────────────────────┘
```

</td>
</tr>
</table>

### 📊 Dashboard

<table>
<tr>
<td>

```
┌─────────────────────────────────────────────────┐
│ ☰ Svelteship                          🌙 👤    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Welcome back, User!                            │
│  Here's what's happening with your account.     │
│                                                 │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐     │
│  │  Active   │ │  Secure   │ │   Ready   │     │
│  │  Account  │ │  Session  │ │   Stack   │     │
│  └───────────┘ └───────────┘ └───────────┘     │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 💡 Getting Started                      │   │
│  │                                         │   │
│  │ 1. Customize your profile               │   │
│  │ 2. Explore the codebase                 │   │
│  │ 3. Build your features                  │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

</td>
</tr>
</table>

### 👤 Profile Page

<table>
<tr>
<td>

```
┌─────────────────────────────────────────────────┐
│ ☰ Svelteship                          🌙 👤    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Profile                                        │
│  Manage your account information.               │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ 👤 Account Information                  │   │
│  │                                         │   │
│  │ Email: user@example.com (readonly)      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ ✏️ Update Profile                       │   │
│  │                                         │   │
│  │ ✓ Profile updated successfully!         │   │
│  │                                         │   │
│  │ Display Name: [_______________]         │   │
│  │                                         │   │
│  │ ┌─────────────┐                         │   │
│  │ │ Save Changes│                         │   │
│  │ └─────────────┘                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

</td>
</tr>
</table>

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/svelteship.git
cd svelteship

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start PostgreSQL (requires Docker)
docker-compose up -d

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/svelteship
```

## 📁 Project Structure

```
svelteship/
├── src/
│   ├── lib/
│   │   ├── server/         # Server-only code
│   │   │   ├── db/         # Drizzle client & schema
│   │   │   └── auth.ts     # Lucia configuration
│   │   ├── components/     # Reusable UI components
│   │   │   └── ui/         # Button, Input, Card, Alert
│   │   └── utils/          # Shared utilities
│   └── routes/
│       ├── (auth)/         # Login, register pages
│       └── (app)/          # Protected pages (dashboard, profile)
├── drizzle/                # Database migrations
├── .github/                # GitHub templates & workflows
└── docker-compose.yml      # PostgreSQL container
```

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | SvelteKit 2.x + Svelte 5 |
| **Language** | TypeScript (strict mode) |
| **Database** | PostgreSQL + Drizzle ORM |
| **Authentication** | Lucia Auth |
| **Styling** | Tailwind CSS + DaisyUI |
| **Testing** | Vitest + fast-check |
| **Build Tool** | Vite 6 |
| **Container** | Docker |

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Database
npm run db:migrate   # Run migrations
npm run db:generate  # Generate migrations
npm run db:studio    # Open Drizzle Studio

# Testing & Quality
npm run test         # Run tests
npm run check        # Type check
npm run lint         # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**[⬆ Back to Top](#-svelteship)**

Made with ❤️ using SvelteKit

</div>
