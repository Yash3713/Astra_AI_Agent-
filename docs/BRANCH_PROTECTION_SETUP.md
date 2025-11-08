# Dev Branch Protection Setup Guide

## Quick Start (Automated)

### Using the Script

1. **Create a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click **"Generate new token (classic)"**
   - Give it a name: `Branch Protection Setup`
   - Select scopes:
     - ✅ `repo` (Full control of private repositories)
   - Click **"Generate token"**
   - **Copy the token** (you won't see it again!)

2. **Run the protection script:**
   ```bash
   ./scripts/protect-dev-branch.sh YOUR_GITHUB_TOKEN
   ```

3. **Verify protection is active:**
   - Go to https://github.com/Yash3713/Astra_AI_Agent-/settings/branches
   - You should see protection rules on the `dev` branch

---

## Manual Setup (Web Interface)

If you prefer to set this up manually through GitHub's web interface:

### Step 1: Navigate to Branch Settings

1. Go to your repository: https://github.com/Yash3713/Astra_AI_Agent-
2. Click **Settings** tab (top right)
3. Click **Branches** in left sidebar

### Step 2: Add Branch Protection Rule

1. Click **"Add branch protection rule"** or **"Add rule"**
2. In **"Branch name pattern"**, enter: `dev`

### Step 3: Configure Protection Rules

Check the following options:

#### ✅ Require a pull request before merging
- ✅ **Require approvals:** `1`
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
- ✅ **Require review from Code Owners** (optional)

#### ✅ Require status checks to pass before merging
- ✅ **Require branches to be up to date before merging**
- In the search box, add these status checks:
  - `test`
  - `code-review`

  *(Note: These will appear after you set up GitHub Actions)*

#### ✅ Require conversation resolution before merging

#### ✅ Do not allow bypassing the above settings
- This ensures even admins must follow the rules

#### ✅ Restrict who can push to matching branches (Optional)
- Leave empty to allow all team members to create PRs

#### Additional Settings:
- ❌ **Allow force pushes:** OFF
- ❌ **Allow deletions:** OFF

### Step 4: Save

1. Click **"Create"** or **"Save changes"** at the bottom
2. You should see a green confirmation message

---

## What This Protection Does

| Rule | What It Means |
|------|---------------|
| **Require PR** | No direct commits to `dev` - must go through Pull Request |
| **1 Approval Required** | At least one person must approve before merging |
| **Dismiss Stale Reviews** | If code changes after approval, re-approval needed |
| **Status Checks** | GitHub Actions (tests, code review) must pass |
| **Up to Date** | Branch must be current with `dev` before merging |
| **Conversation Resolution** | All PR comments must be resolved |
| **No Force Push** | Can't overwrite history (protects against accidents) |
| **No Deletion** | Can't delete the `dev` branch |

---

## Creating the Dev Branch

If the `dev` branch doesn't exist yet:

### Option 1: From Current Branch
```bash
git checkout -b dev
git push -u origin dev
```

### Option 2: From Main Branch
```bash
git checkout main
git pull origin main
git checkout -b dev
git push -u origin dev
```

---

## Verification Steps

After setup, verify the protection is working:

### Test 1: Try Direct Push (Should Fail)
```bash
git checkout dev
echo "test" >> test.txt
git add test.txt
git commit -m "test"
git push origin dev
```

**Expected Result:** ❌ Push rejected with message about requiring pull request

### Test 2: Create PR (Should Succeed)
```bash
git checkout -b feature/test-protection
git push -u origin feature/test-protection
```

Then create a PR on GitHub → Should allow PR creation

---

## Troubleshooting

### Issue: "Status checks not found"

**Cause:** GitHub Actions workflows haven't run yet

**Solution:**
1. Complete CI/CD setup first (Step 4 of main plan)
2. Or temporarily remove status check requirement
3. Re-add status checks after first workflow run

### Issue: "You must be an admin to set branch protection rules"

**Cause:** Insufficient permissions

**Solution:**
1. Ensure you're the repository owner
2. Or ask the repo owner to add you as admin
3. Or ask owner to run the script

### Issue: Script fails with 403 error

**Cause:** Token doesn't have correct permissions

**Solution:**
1. Regenerate token with `repo` scope
2. Ensure you're using classic token (not fine-grained)

---

## Next Steps

After protecting the `dev` branch:

- [ ] Step 2: Set up branch naming enforcement (Git hooks)
- [ ] Step 3: Set up local testing (pre-commit hooks)
- [ ] Step 4: Set up PR review pipeline (GitHub Actions)

See the main CI/CD setup guide for complete instructions.

---

## Rolling Back

If you need to remove branch protection:

### Via Web:
1. Go to Settings → Branches
2. Find the `dev` rule
3. Click **Delete** button

### Via Script:
```bash
curl -X DELETE \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/Yash3713/Astra_AI_Agent-/branches/dev/protection"
```

---

**Last Updated:** 2025-11-08
**Repository:** Yash3713/Astra_AI_Agent-
