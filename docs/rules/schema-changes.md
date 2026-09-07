# Schema / critical changes

Before changing a database schema (or any symbol you'd call "critical" —
shared models, exported types, auth/middleware), run GitNexus impact analysis
first (`mcp__gitnexus__impact` on the table/model/symbol, upstream direction)
and show the result to the user before editing:

- If the index carries a `staleness` warning or the impact result's
  `epistemic` is `lower-bound`, don't trust it as-is — confirm with a
  repo-wide grep for the symbol name and report that instead.
- Summarize what depends on the symbol (files, processes, modules affected)
  and get explicit consent before applying the change, not after.

Applies to any agent working in this repo, not just the one that first
touches the file.
