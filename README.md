# 🚀 Svelteship

<div align="center">

<!-- Project Logo/Banner Placeholder -->
<img src="static/favicon.png" alt="Svelteship Logo" width="120" />

**Full-stack SvelteKit boilerplate with authentication, database, and UI components ready to go.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-orange.svg)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Svelte](https://img.shields.io/badge/Svelte-5-FF3E00.svg)](https://svelte.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#️-tech-stack) • [Contributing](#-contributing) • [License](#-license)

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

<!-- Landing Page Mockup -->
<details>
<summary><strong>🏠 Landing Page</strong></summary>

```html
<div style="background: #f5f5f5; padding: 40px; border-radius: 12px; text-align: center;">
  <h1 style="font-size: 2.5rem; font-weight: bold;">🚀 Svelteship</h1>
  <p style="color: #666; margin: 20px 0;">
    Full-stack SvelteKit boilerplate with authentication, database, and UI components ready to use.
    Ship modern web applications quickly and securely.
  </p>
  <div style="display: flex; gap: 12px; justify-content: center; margin: 24px 0;">
    <button style="background: #570df8; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600;">Get Started</button>
    <button style="background: transparent; border: 2px solid #570df8; color: #570df8; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Sign In</button>
  </div>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 32px;">
    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 2rem;">🔐</div>
      <h3 style="font-weight: 600; margin: 8px 0;">Authentication</h3>
      <p style="font-size: 0.875rem; color: #666;">Lucia Auth with session management</p>
    </div>
    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 2rem;">🗄️</div>
      <h3 style="font-weight: 600; margin: 8px 0;">Database</h3>
      <p style="font-size: 0.875rem; color: #666;">PostgreSQL + Drizzle ORM</p>
    </div>
    <div style="background: white; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 2rem;">🎨</div>
      <h3 style="font-weight: 600; margin: 8px 0;">UI Components</h3>
      <p style="font-size: 0.875rem; color: #666;">Tailwind CSS + DaisyUI</p>
    </div>
  </div>
</div>
```

</details>

<!-- Login Page Mockup -->
<details>
<summary><strong>🔑 Login Page</strong></summary>

```html
<div style="background: #f5f5f5; padding: 40px; display: flex; justify-content: center;">
  <div style="background: white; padding: 32px; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); width: 400px;">
    <h1 style="font-size: 1.5rem; font-weight: bold; text-align: center; margin-bottom: 8px;">Welcome Back</h1>
    <p style="text-align: center; color: #666; margin-bottom: 24px;">Sign in to your Svelteship account</p>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 0.875rem; margin-bottom: 4px;">Email</label>
      <input type="email" placeholder="you@example.com" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;" />
    </div>
    
    <div style="margin-bottom: 24px;">
      <label style="display: block; font-size: 0.875rem; margin-bottom: 4px;">Password</label>
      <input type="password" placeholder="Enter your password" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;" />
    </div>
    
    <button style="width: 100%; background: #570df8; color: white; padding: 12px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">Sign In</button>
    
    <div style="text-align: center; margin: 16px 0; color: #999;">OR</div>
    
    <p style="text-align: center; font-size: 0.875rem;">
      Don't have an account? <a href="#" style="color: #570df8;">Create one</a>
    </p>
  </div>
</div>
```

</details>

<!-- Dashboard Mockup -->
<details>
<summary><strong>📊 Dashboard</strong></summary>

```html
<div style="background: #f5f5f5; padding: 24px;">
  <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 8px;">Welcome back, User!</h1>
  <p style="color: #666; margin-bottom: 24px;">Here's what's happening with your account.</p>
  
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px;">
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 0.875rem; color: #666;">Account Status</div>
      <div style="font-size: 1.5rem; font-weight: bold; color: #570df8;">Active</div>
      <div style="font-size: 0.75rem; color: #999;">Your account is in good standing</div>
    </div>
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 0.875rem; color: #666;">Security</div>
      <div style="font-size: 1.5rem; font-weight: bold; color: #f000b8;">Secure</div>
      <div style="font-size: 0.75rem; color: #999;">Session authenticated</div>
    </div>
    <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div style="font-size: 0.875rem; color: #666;">Stack</div>
      <div style="font-size: 1.5rem; font-weight: bold; color: #37cdbe;">Ready</div>
      <div style="font-size: 0.75rem; color: #999;">SvelteKit + Lucia + Drizzle</div>
    </div>
  </div>
  
  <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 16px;">💡 Getting Started</h2>
    <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px;">
      <span style="background: #570df8; color: white; padding: 4px 12px; border-radius: 999px; font-weight: 600;">1</span>
      <div>
        <h3 style="font-weight: 600;">Customize your profile</h3>
        <p style="font-size: 0.875rem; color: #666;">Add your name and personalize your account settings.</p>
      </div>
    </div>
    <div style="display: flex; gap: 16px; align-items: flex-start; margin-bottom: 16px;">
      <span style="background: #570df8; color: white; padding: 4px 12px; border-radius: 999px; font-weight: 600;">2</span>
      <div>
        <h3 style="font-weight: 600;">Explore the codebase</h3>
        <p style="font-size: 0.875rem; color: #666;">Check out the project structure and understand how everything works.</p>
      </div>
    </div>
    <div style="display: flex; gap: 16px; align-items: flex-start;">
      <span style="background: #570df8; color: white; padding: 4px 12px; border-radius: 999px; font-weight: 600;">3</span>
      <div>
        <h3 style="font-weight: 600;">Build your features</h3>
        <p style="font-size: 0.875rem; color: #666;">Start adding your own routes, components, and business logic.</p>
      </div>
    </div>
  </div>
</div>
```

</details>

<!-- Profile Page Mockup -->
<details>
<summary><strong>👤 Profile Page</strong></summary>

```html
<div style="background: #f5f5f5; padding: 24px; max-width: 600px;">
  <h1 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 8px;">Profile</h1>
  <p style="color: #666; margin-bottom: 24px;">Manage your account information.</p>
  
  <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 16px;">
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 16px;">👤 Account Information</h2>
    <div>
      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Email</label>
      <input type="email" value="user@example.com" disabled style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; background: #f5f5f5; color: #666; box-sizing: border-box;" />
      <p style="font-size: 0.75rem; color: #999; margin-top: 4px;">Email cannot be changed</p>
    </div>
  </div>
  
  <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 16px;">✏️ Update Profile</h2>
    
    <div style="background: #d1fae5; border: 1px solid #10b981; padding: 12px; border-radius: 8px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
      <span style="color: #10b981;">✓</span>
      <span style="color: #065f46;">Profile updated successfully!</span>
    </div>
    
    <div style="margin-bottom: 16px;">
      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Display Name</label>
      <input type="text" placeholder="Enter your name" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;" />
      <p style="font-size: 0.75rem; color: #999; margin-top: 4px;">Max 100 characters</p>
    </div>
    
    <button style="background: #570df8; color: white; padding: 12px 24px; border-radius: 8px; border: none; font-weight: 600; cursor: pointer;">Save Changes</button>
  </div>
</div>
```

</details>

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
