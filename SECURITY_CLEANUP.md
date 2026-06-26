# Security Cleanup Guide: Removing Secrets from Git History

⚠️ **IMPORTANT**: This process rewrites git history and will change all commit SHAs after the cleanup.

## Prerequisites

1. **Backup your repository** (optional but recommended)
   ```bash
   git clone --mirror https://github.com/PeterFam92/socialApp.git socialApp.backup
   ```

2. **Install git-filter-repo**
   ```bash
   # macOS with Homebrew
   brew install git-filter-repo

   # Or using pip
   pip install git-filter-repo

   # Or using apt (Ubuntu/Debian)
   sudo apt-get install git-filter-repo
   ```

## Step-by-Step Cleanup

### Step 1: Navigate to your repository
```bash
cd /path/to/PeterFam92/socialApp
```

### Step 2: Verify you're on the correct branch
```bash
git status
```

### Step 3: Run git-filter-repo to remove secrets
```bash
git filter-repo --invert-paths --paths src/config/.env.dev --paths 'src/config/*.json'
```

**What this does:**
- `--invert-paths` = keep everything EXCEPT the specified paths
- `--paths src/config/.env.dev` = remove .env.dev file
- `--paths 'src/config/*.json'` = remove all JSON files in src/config

### Step 4: Verify the cleanup
```bash
# Check that the sensitive files are gone from history
git log --all --full-history -- src/config/.env.dev
git log --all --full-history -- src/config/

# Should return: "commit info" only in the reflog, or nothing if completely removed
```

### Step 5: Force push to GitHub
```bash
git push origin --force-with-lease
```

**⚠️ WARNING**: This will rewrite the remote history. Use `--force-with-lease` (safer) instead of `--force`.

## What to Do After Cleanup

1. **Anyone with cloned copies should do:**
   ```bash
   git clone https://github.com/PeterFam92/socialApp.git
   ```

2. **Notify your team** (if applicable) about the history rewrite

3. **Update all exposed credentials:**
   - Google OAuth: Regenerate in Google Cloud Console
   - Firebase: Regenerate private keys
   - Email: Change password
   - All tokens and secrets

4. **GitHub Actions / CI/CD:**
   - Update secrets in GitHub Settings → Secrets and variables

## Troubleshooting

### If you get "not in a git repository" error:
- Make sure you're in the correct directory with `.git` folder

### If force-with-lease is rejected:
- Someone else pushed after you started
- Update your branch: `git fetch origin`
- Try again with `--force` (use with caution)

### If you need to undo:
```bash
# Only works if you haven't pushed yet
git reset --hard refs/backup-refs/heads/main
# Or restore from your backup
```

## Verification Checklist

- [ ] git-filter-repo installed successfully
- [ ] Ran filter-repo command without errors
- [ ] Verified files removed from git log
- [ ] Force pushed to GitHub
- [ ] No errors during force push
- [ ] Repository is clean in GitHub UI
- [ ] Regenerated all exposed credentials
- [ ] Updated GitHub Secrets (if using CI/CD)
- [ ] Team notified (if applicable)

---

For more help: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
