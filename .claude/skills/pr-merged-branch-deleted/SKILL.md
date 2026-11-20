---
name: pr-merged-branch-deleted
description: Use when the user directly invokes /pr-merged-branch-deleted to say they have merged the PR and deleted the feature branch, so the local repo should be brought back in sync with main. Never trigger automatically.
disable-model-invocation: true
---

# PR Merged, Branch Deleted

The user is telling you: **"I have merged the PR and deleted the feature branch."** Bring the local repo in sync with `main` and clean up the leftover local branch.

## Process

1. **Find the branch.** If the user gave a branch name as an argument, use it. Otherwise it is the current branch (`git branch --show-current`). If the current branch is already `main` and no name was given, ask which branch to clean up. Never target `main`.
2. **Check the working tree.** If there are uncommitted changes, stop and ask the user before switching branches.
3. **Confirm the PR is really merged.** Run `gh pr list --repo <owner>/<repo> --head <branch> --state all --json number,state,mergedAt`. If the PR is not `MERGED`, tell the user and stop. Do not delete the branch.
4. **Sync `main`.** Use the project's configured remote (check `git remote -v` and `remote.pushDefault`). Run `git checkout main`, then `git pull --ff-only <remote> main`. If the fast-forward fails, report it and stop.
5. **Delete the local branch.** Try `git branch -d <branch>`. Squash merges make the branch look unmerged, so if that fails and step 3 confirmed the PR is `MERGED`, use `git branch -D <branch>`.
6. **Prune stale remote refs:** `git fetch --prune <remote>`. If the remote branch still exists, tell the user; do not delete it unless asked.
7. **Report:** the branch cleaned up, the PR number, the commit `main` is now at, and that the working tree is clean.

## Rules

- Never delete `main`, and never force-delete a branch whose PR is not confirmed `MERGED`.
- Never commit or push anything.
- On Windows, if a git command hangs, retry it with `git -c core.fsmonitor=false`.
