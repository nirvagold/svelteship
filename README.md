# 🚀 Svelteship

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange.svg)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

Full-stack SvelteKit boilerplate with authentication, database, and UI components ready to go.

## ✨ Features

- 🔐 **Authentication** - Register, login, logout with Lucia Auth
- 🗄️ **Database** - PostgreSQL with Drizzle ORM
- 🎨 **UI Components** - Tailwind CSS + DaisyUI
- 🌙 **Dark Mode** - Theme toggle with persistence
- 🐳 **Docker** - Local PostgreSQL setup
- ✅ **TypeScript** - Full type safety

## 🚀 Quick Start

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

## 📁 Project Structure

```
src/
├── lib/
│   ├── server/         # Server-only code (auth, db)
│   ├── components/     # Reusable UI components
│   └── utils/          # Shared utilities
└── routes/
    ├── (auth)/         # Login, register pages
    └── (app)/          # Protected pages (dashboard, profile)
```

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.x + Svelte 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Lucia Auth
- **Styling**: Tailwind CSS + DaisyUI
- **Testing**: Vitest + fast-check

## 📝 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run check        # Type check
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
