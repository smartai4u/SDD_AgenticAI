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
COMMIT="$($G commit-tree "$TREE" -p "$PARENT" \
  -m "chore: auto-sync $TS" \
  -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>")" || exit 0
$G update-ref "refs/heads/$BRANCH" "$COMMIT" || exit 0

if ! timeout 90 $G push --force "$REMOTE" "refs/heads/$BRANCH:refs/heads/$BRANCH" >/dev/null 2>&1; then
  say "committed locally but push to $REMOTE failed (check gh login)"
  exit 0
fi

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

MERGED=""
for i in 1 2 3 4 5; do
  if timeout 60 gh pr merge "$PR" --repo "$REPO" --squash --delete-branch >/dev/null 2>&1; then MERGED=1; break; fi
  sleep 3
done
if [ -z "$MERGED" ]; then
  say "PR #$PR opened but could not be merged automatically"
  exit 0
fi

# Move local main to the merged commit (index + ref only; working tree already matches).
timeout 60 $G fetch "$REMOTE" "$BASE" >/dev/null 2>&1
$G reset --mixed -q "refs/remotes/$REMOTE/$BASE" >/dev/null 2>&1
say "PR #$PR squash-merged into $BASE on $REMOTE"
exit 0
