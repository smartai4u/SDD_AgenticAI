#!/usr/bin/env bash
# Auto-replicate the working tree to the `auto-sync` branch on remote `smartai4u`.
# - Never checks out, commits to, or pushes `main`.
# - Uses a temporary index, so the working branch and its staging area are untouched.
# - Respects .gitignore. Always exits 0 so it never blocks Claude.

REMOTE="smartai4u"
BRANCH="auto-sync"

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
git remote get-url "$REMOTE" >/dev/null 2>&1 || exit 0

G="git -c core.fsmonitor=false"
TMP_INDEX="$(mktemp)"
trap 'rm -f "$TMP_INDEX"' EXIT
export GIT_INDEX_FILE="$TMP_INDEX"

# Parent: existing auto-sync, else the remote's main (or local main).
PARENT="$($G rev-parse -q --verify "refs/heads/$BRANCH" 2>/dev/null)"
[ -z "$PARENT" ] && PARENT="$($G rev-parse -q --verify "refs/remotes/$REMOTE/main" 2>/dev/null)"
[ -z "$PARENT" ] && PARENT="$($G rev-parse -q --verify refs/heads/main 2>/dev/null)"

if [ -n "$PARENT" ]; then
  $G read-tree "$PARENT" || exit 0
fi
$G add -A . >/dev/null 2>&1 || exit 0
TREE="$($G write-tree)" || exit 0

# Nothing new to sync.
if [ -n "$PARENT" ] && [ "$TREE" = "$($G rev-parse "$PARENT^{tree}")" ]; then
  exit 0
fi

MSG="chore: auto-sync $(date -u +%Y-%m-%dT%H:%M:%SZ)"
if [ -n "$PARENT" ]; then
  COMMIT="$($G commit-tree "$TREE" -p "$PARENT" -m "$MSG" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>")" || exit 0
else
  COMMIT="$($G commit-tree "$TREE" -m "$MSG" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>")" || exit 0
fi

$G update-ref "refs/heads/$BRANCH" "$COMMIT" || exit 0
unset GIT_INDEX_FILE

# Push only the auto-sync branch; never main.
if timeout 90 $G push "$REMOTE" "refs/heads/$BRANCH:refs/heads/$BRANCH" >/dev/null 2>&1; then
  echo "{\"systemMessage\": \"auto-sync: pushed ${COMMIT:0:7} to $REMOTE/$BRANCH\"}"
else
  echo "{\"systemMessage\": \"auto-sync: committed locally to $BRANCH but push to $REMOTE failed (check gh login)\"}"
fi
exit 0
