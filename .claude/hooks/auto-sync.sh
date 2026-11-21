#!/usr/bin/env bash
# Auto-replicate the working tree to GitHub remote `smartai4u` via a pull request.
#
# Flow (runs when Claude finishes a response):
#   1. Snapshot the working tree (respecting .gitignore) as ONE commit on top of
#      smartai4u/main, using a temporary index. Nothing is checked out or staged.
#   2. Force-push that commit to the throwaway branch `auto-sync`.
#   3. If the local branch is `main`: open a PR auto-sync -> main and squash-merge it,
#      then fast-forward the local `main` pointer to the merged commit (index only;
#      the working tree is untouched). On any other local branch, stop after step 2.
# Never commits or pushes directly to `main`. Always exits 0 so it never blocks Claude.

REMOTE="smartai4u"
BRANCH="auto-sync"
BASE="main"

cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
URL="$(git remote get-url "$REMOTE" 2>/dev/null)" || exit 0
REPO="$(echo "$URL" | sed -E 's#^(https://github.com/|git@github.com:)##; s#\.git$##')"

G="git -c core.fsmonitor=false"
say() { echo "{\"systemMessage\": \"auto-sync: $1\"}"; }

# Minimum gap between replications (seconds). Override with AUTO_SYNC_MIN_SECONDS.
MIN_GAP="${AUTO_SYNC_MIN_SECONDS:-300}"
STAMP="$(git rev-parse --git-dir)/auto-sync-last"
NOW="$(date +%s)"
LAST="$(cat "$STAMP" 2>/dev/null || echo 0)"
if [ $((NOW - LAST)) -lt "$MIN_GAP" ]; then
  exit 0   # too soon; changes are picked up by the next run after the gap
fi

timeout 60 $G fetch "$REMOTE" "$BASE" >/dev/null 2>&1
PARENT="$($G rev-parse -q --verify "refs/remotes/$REMOTE/$BASE" 2>/dev/null)" || exit 0

TMP_INDEX="$(mktemp)"
trap 'rm -f "$TMP_INDEX"' EXIT
export GIT_INDEX_FILE="$TMP_INDEX"
$G read-tree "$PARENT" || exit 0
$G add -A . >/dev/null 2>&1 || exit 0
TREE="$($G write-tree)" || exit 0
unset GIT_INDEX_FILE

# Nothing new relative to remote main.
[ "$TREE" = "$($G rev-parse "$PARENT^{tree}")" ] && exit 0

TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
# Author as the account Vercel recognises (the repo owner); otherwise Vercel
# blocks the auto-sync preview deployments. Override via AUTO_SYNC_AUTHOR_NAME/EMAIL.
AUTHOR_NAME="${AUTO_SYNC_AUTHOR_NAME:-smartai4u}"
AUTHOR_EMAIL="${AUTO_SYNC_AUTHOR_EMAIL:-subhadarshi@smartai4u.com}"
COMMIT="$(GIT_AUTHOR_NAME="$AUTHOR_NAME" GIT_AUTHOR_EMAIL="$AUTHOR_EMAIL" \
  GIT_COMMITTER_NAME="$AUTHOR_NAME" GIT_COMMITTER_EMAIL="$AUTHOR_EMAIL" \
  $G commit-tree "$TREE" -p "$PARENT" \
  -m "chore: auto-sync $TS" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>")" || exit 0
$G update-ref "refs/heads/$BRANCH" "$COMMIT" || exit 0

if ! timeout 90 $G push --force "$REMOTE" "refs/heads/$BRANCH:refs/heads/$BRANCH" >/dev/null 2>&1; then
  say "committed locally but push to $REMOTE failed (check gh login)"
  exit 0
fi

echo "$NOW" > "$STAMP"   # record the replication time (only after a successful push)

CUR="$($G symbolic-ref --short -q HEAD)"
if [ "$CUR" != "$BASE" ]; then
  say "pushed ${COMMIT:0:7} to $REMOTE/$BRANCH (on branch '$CUR', so no PR opened)"
  exit 0
fi

PR="$(timeout 60 gh pr list --repo "$REPO" --head "$BRANCH" --base "$BASE" --state open --json number --jq '.[0].number' 2>/dev/null)"
if [ -z "$PR" ]; then
  PR_URL="$(timeout 60 gh pr create --repo "$REPO" --base "$BASE" --head "$BRANCH" \
    --title "chore: auto-sync $TS" \
    --body "Automatic sync of local changes by the Claude Code Stop hook.

🤖 Generated with [Claude Code](https://claude.com/claude-code)" 2>/dev/null)"
  PR="${PR_URL##*/}"
fi
[ -z "$PR" ] && { say "pushed $BRANCH but could not open a PR"; exit 0; }

# Branch protection requires the "ci" check, so enable auto-merge instead of merging at once:
# GitHub squash-merges the PR as soon as ci passes (and deletes the branch on merge).
ENABLED=""
for i in 1 2 3 4 5; do
  if timeout 60 gh pr merge "$PR" --repo "$REPO" --auto --squash >/dev/null 2>&1; then ENABLED=1; break; fi
  sleep 3
done
if [ -z "$ENABLED" ]; then
  say "PR #$PR opened but auto-merge could not be enabled (check branch protection / allow_auto_merge)"
  exit 0
fi

# The merge now happens asynchronously on GitHub, so local main is not moved here;
# the next sync (and a normal pull) picks up the merged commit.
say "PR #$PR opened with auto-merge: it will squash-merge into $BASE on $REMOTE once ci passes"
exit 0
