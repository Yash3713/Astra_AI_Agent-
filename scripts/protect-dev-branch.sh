#!/bin/bash

# Script to protect dev branch using GitHub API
# Usage: ./scripts/protect-dev-branch.sh <GITHUB_TOKEN>

set -e

REPO_OWNER="Yash3713"
REPO_NAME="Astra_AI_Agent-"
BRANCH="dev"

# Check if token is provided
if [ -z "$1" ]; then
  echo "❌ Error: GitHub Personal Access Token required"
  echo ""
  echo "Usage: ./scripts/protect-dev-branch.sh <GITHUB_TOKEN>"
  echo ""
  echo "To create a token:"
  echo "1. Go to https://github.com/settings/tokens"
  echo "2. Click 'Generate new token (classic)'"
  echo "3. Select scopes: 'repo' (Full control of private repositories)"
  echo "4. Generate and copy the token"
  echo ""
  exit 1
fi

GITHUB_TOKEN=$1

echo "🔒 Setting up branch protection for 'dev' branch..."
echo ""

# Create dev branch if it doesn't exist
echo "Checking if dev branch exists..."
BRANCH_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/branches/$BRANCH")

if [ "$BRANCH_EXISTS" != "200" ]; then
  echo "⚠️  Dev branch doesn't exist. Creating from current branch..."

  # Get current commit SHA
  CURRENT_SHA=$(git rev-parse HEAD)

  curl -X POST \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/git/refs" \
    -d "{\"ref\":\"refs/heads/$BRANCH\",\"sha\":\"$CURRENT_SHA\"}"

  echo "✅ Dev branch created"
else
  echo "✅ Dev branch exists"
fi

echo ""
echo "Setting up branch protection rules..."

# Apply branch protection
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/branches/$BRANCH/protection" \
  -d '{
    "required_status_checks": {
      "strict": true,
      "contexts": ["test", "code-review"]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "dismissal_restrictions": {},
      "dismiss_stale_reviews": true,
      "require_code_owner_reviews": false,
      "required_approving_review_count": 1,
      "require_last_push_approval": false
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "required_conversation_resolution": true
  }')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Branch protection rules applied successfully!"
  echo ""
  echo "Protection rules configured:"
  echo "  ✓ Requires pull request before merging"
  echo "  ✓ Requires 1 approval"
  echo "  ✓ Dismisses stale reviews on new commits"
  echo "  ✓ Requires status checks: test, code-review"
  echo "  ✓ Requires branches to be up to date"
  echo "  ✓ Requires conversation resolution"
  echo "  ✓ No force pushes allowed"
  echo "  ✓ No deletions allowed"
  echo "  ✓ Enforces rules for admins"
  echo ""
  echo "🎉 Dev branch is now protected!"
else
  echo "❌ Failed to apply branch protection rules"
  echo "HTTP Code: $HTTP_CODE"
  echo "Response: $BODY"
  exit 1
fi
