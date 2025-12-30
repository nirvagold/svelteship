# Branch Strategy

## Branch Types

| Branch | Purpose | Base | Merge To |
|--------|---------|------|----------|
| `main` | Production-ready code | - | - |
| `develop` | Development integration | main | main |
| `feature/*` | New features | develop | develop |
| `fix/*` | Bug fixes | develop | develop |
| `hotfix/*` | Urgent production fixes | main | main & develop |

## Workflow

```
main (production)
  │
  └── develop (integration)
        │
        ├── feature/user-settings
        ├── feature/notifications
        └── fix/login-validation
```

## Branch Naming

```bash
feature/short-description    # New feature
fix/issue-description        # Bug fix
hotfix/critical-fix          # Urgent production fix
```

## Commands

### Create Feature Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

### Finish Feature
```bash
git checkout develop
git merge feature/my-feature
git push origin develop
git branch -d feature/my-feature
```

### Create Hotfix
```bash
git checkout main
git checkout -b hotfix/critical-fix
# ... fix the issue ...
git checkout main
git merge hotfix/critical-fix
git checkout develop
git merge hotfix/critical-fix
```

## Rules

1. Never commit directly to `main`
2. Always create PR for merging to `develop` or `main`
3. Delete branch after merge
4. Keep branches short-lived (< 1 week)
