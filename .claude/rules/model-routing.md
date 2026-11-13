# Model and effort routing

Pick the cheapest model and effort that gets the task right the first time. A wrong public claim about NestJS costs more than the tokens saved, and a cold agent start costs more than a small task done in place.

## Per task

| Task sent in a session | Who does it | Model | Effort |
| --- | --- | --- | --- |
| Question, lookup, small edit, rename, formatting, anything a few tool calls settle | The session itself; start no agent | session's | session's |
| Sweep the repository, summarize long output or saved pages, bulk mechanical edits (links, dates, version strings) | General agent | `haiku` | `low` |
| Marketplace listing check | `marketplace-manager` | `haiku` | `low` |
| Research a NestJS or backend topic | `topic-scout` | `sonnet` | `medium` |
| Docs pages, translations under `docs/fa`, `docs/fr`, `docs/ja`, `docs/zh-CN`, changelog wording | General agent | `sonnet` | `medium` |
| Article or thread draft | `article-writer` | `sonnet` | `high` |
| Runnable examples and their tests under `examples/`, repository scripts, the eval runner | General agent | `sonnet` | `high` |
| New or changed skill guidance, any claim about framework behavior, cross-skill ownership | `skill-improver` | `opus` | `high` |
| Review of a change before a pull request or release, changing nothing | General agent | `opus` | `high` |
| Design of a new skill, a restructure of the collection, or a problem two attempts failed on | General agent | `fable` | `high` |

The named agents carry their model and effort in `.claude/agents/`. For a general agent, pass the row's `model` on the Agent call, and its `effort` where the call accepts one.

Relative list price per token when this was written (2026-11): `haiku` is about a twentieth of `sonnet`, `opus` is twice `sonnet`, and `fable` is twice `opus`.

## Rules

- Classify the task first and name its row in one line. A task that spans rows is split, or takes the highest row it touches.
- Delegate only when the task is larger than a few tool calls, or when the row's model is cheaper than the session's and the work is mostly reading. Otherwise do it in the session.
- Escalate one step (`haiku`, then `sonnet`, then `opus`, then `fable`) when a result fails `npm test` twice or a review finds a wrong framework claim. Change the model before raising the effort.
- Do not start at `fable`, and do not use `xhigh` or `max` unless the maintainer asks for it on that task.
- When the session's own model is weaker than the row's and the task cannot be delegated, say so and name the model to switch to with `/model`.
