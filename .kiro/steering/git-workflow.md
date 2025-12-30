# Git Workflow Guidelines

## Kiro Auto-Git Behavior

Setelah menyelesaikan task, Kiro HARUS melakukan:

1. **Cek status Git** - `git status` untuk lihat perubahan
2. **Run checks** - `npm run lint && npm run check && npm run test`
3. **Commit changes** - Jika semua check pass, commit dengan conventional message
4. **Determine stability**:
   - Jika task adalah **fitur baru/fix kecil** → commit ke `develop`
   - Jika task adalah **milestone/release-ready** → merge `develop` ke `main`
   - Jika task adalah **hotfix urgent** → commit ke `main` dan merge ke `develop`

### Auto-commit Flow

```bash
# 1. Check current branch
git branch --show-current

# 2. Run all checks
npm run lint
npm run check  
npm run test

# 3. If all pass, commit
git add .
git commit -m "<type>(<scope>): <description>"

# 4. Push to remote
git push origin <current-branch>

# 5. If stable/release-ready, merge to main
git checkout main
git merge develop
git push origin main
git checkout develop
```

## Remote Repository

- **Origin**: https://github.com/nirvagold/svelteship.git
- **Auto-push**: Setelah setiap commit, SELALU push ke remote
- **Pull before push**: Jika push gagal, pull dulu lalu push lagi

### Stability Criteria (untuk merge ke main)

Merge ke `main` jika:
- [ ] Semua test pass (unit + e2e)
- [ ] Tidak ada lint errors
- [ ] TypeScript check pass
- [ ] Fitur complete dan tested
- [ ] User explicitly minta release/deploy

## Branch Strategy

Project ini menggunakan Git Flow sederhana dengan branch utama:

- `main` - Production-ready code, selalu stabil
- `develop` - Integration branch untuk development aktif
- `feature/*` - Branch untuk fitur baru
- `fix/*` - Branch untuk bug fixes
- `hotfix/*` - Branch untuk urgent production fixes

## Commit Message Convention

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

### Types

| Type | Deskripsi |
|------|-----------|
| `feat` | Fitur baru |
| `fix` | Bug fix |
| `docs` | Dokumentasi |
| `style` | Formatting, tidak ada perubahan logic |
| `refactor` | Refactoring code |
| `test` | Menambah atau memperbaiki test |
| `chore` | Maintenance, dependencies, config |

### Contoh

```bash
feat(auth): add password reset functionality
fix(login): resolve session timeout issue
docs(readme): update installation instructions
chore(deps): upgrade sveltekit to v2.1
```

## Workflow Commands

### Mulai Fitur Baru

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nama-fitur
```

### Commit Changes

```bash
git add .
git commit -m "feat(scope): deskripsi singkat"
```

### Selesai Fitur

```bash
git checkout develop
git pull origin develop
git merge feature/nama-fitur
git push origin develop
git branch -d feature/nama-fitur
```

### Hotfix Production

```bash
git checkout main
git checkout -b hotfix/nama-fix
# ... fix issue ...
git commit -m "fix: deskripsi"
git checkout main
git merge hotfix/nama-fix
git checkout develop
git merge hotfix/nama-fix
git branch -d hotfix/nama-fix
```

## Rules

1. **Jangan commit langsung ke `main`** - Selalu via merge dari develop atau hotfix
2. **Buat PR untuk merge** - Review code sebelum merge ke develop/main
3. **Hapus branch setelah merge** - Keep repository clean
4. **Branch harus short-lived** - Maksimal 1 minggu
5. **Selalu pull sebelum push** - Hindari conflict

## Pre-commit Checklist

Sebelum commit, pastikan:

- [ ] `npm run lint` - Tidak ada lint errors
- [ ] `npm run check` - TypeScript check pass
- [ ] `npm run test` - Semua test pass
- [ ] Commit message sesuai convention


## Kiro Decision Tree

```
Task Selesai?
    │
    ├── Ya → Run checks (lint, check, test)
    │         │
    │         ├── Pass → Commit ke current branch
    │         │           │
    │         │           ├── Branch = feature/* → Merge ke develop, delete feature branch
    │         │           ├── Branch = fix/* → Merge ke develop, delete fix branch  
    │         │           ├── Branch = develop → Stay, tanya user "Ready to release?"
    │         │           │                        │
    │         │           │                        ├── Ya → Merge develop ke main
    │         │           │                        └── Tidak → Stay di develop
    │         │           └── Branch = hotfix/* → Merge ke main DAN develop
    │         │
    │         └── Fail → Fix errors dulu, jangan commit
    │
    └── Tidak → Continue working
```

## Example Kiro Actions

### Setelah selesai implement fitur:
```bash
# Check status
git status
git branch --show-current  # develop

# Run checks
npm run lint && npm run check && npm run test

# Commit (jika pass)
git add .
git commit -m "feat(auth): implement password reset"

# Push ke remote
git push origin develop
```

### Setelah milestone complete (user bilang "release"):
```bash
# Pastikan di develop dan clean
git checkout develop
npm run lint && npm run check && npm run test

# Merge ke main
git checkout main
git merge develop -m "chore(release): merge develop to main"
git push origin main
git checkout develop
```

### Hotfix urgent:
```bash
git checkout main
git checkout -b hotfix/critical-bug
# ... fix ...
git commit -m "fix(auth): resolve critical session bug"
git checkout main
git merge hotfix/critical-bug
git push origin main
git checkout develop
git merge hotfix/critical-bug
git push origin develop
git branch -d hotfix/critical-bug
```


## Versioning & Release

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH` (contoh: `1.2.3`)

| Increment | Kapan | Contoh |
|-----------|-------|--------|
| PATCH | Bug fix, tidak ada fitur baru | `0.1.0` → `0.1.1` |
| MINOR | Fitur baru, backward compatible | `0.1.0` → `0.2.0` |
| MAJOR | Breaking changes, API berubah | `0.x.x` → `1.0.0` |

### Svelteship Version Roadmap

| Version | Milestone | Status |
|---------|-----------|--------|
| `0.1.0` | UI Components Library complete | ✅ Done |
| `0.2.0` | Utilities & DX complete | 🔄 Next |
| `0.3.0` | Pages & Auth complete | ⏳ Planned |
| `1.0.0` | Production-ready boilerplate | ⏳ Planned |

### Cara Buat Release

```bash
# 1. Pastikan di develop, semua test pass
git checkout develop
npm run lint && npm run check && npm run test

# 2. Merge ke main
git checkout main
git pull origin main
git merge develop

# 3. Update version di package.json
npm version <patch|minor|major> -m "chore(release): v%s"
# Contoh: npm version minor -m "chore(release): v%s"

# 4. Push dengan tags
git push origin main --tags

# 5. Kembali ke develop
git checkout develop
git merge main
git push origin develop
```

### Kiro Release Flow

Ketika user bilang "release" atau "buat release":

1. Tanya versi: patch/minor/major?
2. Jalankan semua checks
3. Merge develop → main
4. Buat tag dengan `npm version`
5. Push ke remote dengan tags
6. Sync develop dengan main

### Release Notes Template

Setelah release, buat release notes di GitHub dengan format:

```markdown
## What's New in v0.x.0

### ✨ Features
- Feature 1
- Feature 2

### 🐛 Bug Fixes
- Fix 1

### 📦 Dependencies
- Updated X to vY

### 🔧 Internal
- Refactored Z
```

### Current Version

Check current version: `npm pkg get version`

Update manual jika perlu:
```bash
npm pkg set version="0.1.0"
```
