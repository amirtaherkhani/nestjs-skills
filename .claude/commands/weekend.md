---
description: Weekly maintenance run - one skill improvement, a marketplace check and an article draft, delivered as one pull request for review.
---

Run the weekly NestJS Skills routine. The result is one pull request and a short report. Nothing goes public without the maintainer.

## Hard limits

Never merge, tag, release, change the collection version, publish an article, post to X, sign in to a marketplace or submit a form. `AGENTS.md` applies in full.

## Steps

1. **Preflight.** Stop and report, changing nothing, if any of these is true: the working tree is not clean; a `weekly/*` pull request is still open (`gh pr list --search "head:weekly/"`); `npm ci` or `npm test` fails on the base branch. Otherwise update `main` and create the branch `weekly/<YYYY-MM-DD>`.
2. **Improve.** Run the `skill-improver` agent. If it reports no change, continue; the article then covers an existing example.
3. **In parallel**, run:
   - `marketplace-manager`;
   - `article-writer`, giving it the skill-improver report.
4. **Check.** Run `npm test`. On failure, do not commit; report the failing output and stop.
5. **Deliver.** Stage only the files these agents changed, review the staged diff, commit, push the branch and open a pull request against `main`. The pull request body has four parts: what changed in the skill and why it matters in production; the marketplace checklist; the article and thread file paths; what was not verified.
6. **Report** in a few lines: the pull request link, the manual steps waiting for the maintainer (merge, release, marketplace updates, publishing the article on DEV then Hashnode then X, adding the new links to `docs/guide/publications.md`), and anything that failed.
