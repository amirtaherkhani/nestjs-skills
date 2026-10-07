# NestJS Skills repository workflow

## Commit completed work

- When a user authorizes a change in this repository, finish the requested scope, run the relevant checks, stage only the files owned by that task, review the staged diff, and make a local commit without waiting for another reminder.
- Do not commit unfinished work, unrelated changes, secrets, or generated/private files. Keep unrelated dirty files untouched. If required checks fail, leave the change uncommitted and report the failure.
- A commit does not authorize a push, merge, release, tag, or deployment. Do only the remote actions the user authorized.

## Clean up completed worktrees and branches

- After a branch is confirmed merged into the agreed base, remove its linked worktree and local branch when the worktree is clean, has no untracked files, and is not in use by an active task. Use normal `git worktree remove` and `git branch -d`; never force cleanup.
- Remove a remote branch only when cleanup is authorized, it is confirmed merged, it has no unique commits or open pull request, and no active task needs it. Use a normal remote delete. If any state is uncertain, preserve the branch and report why.
- Preserve base branches, unfinished work, unique commits, user changes, and private or generated files such as `.codegraph/`.
