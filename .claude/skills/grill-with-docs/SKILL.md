---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADRs and glossary) as we go.
disable-model-invocation: true
---

Run a relentless grill-me interview to sharpen this plan or design — and, as it unfolds, actively build the project's domain model: sharpen vocabulary into `CONTEXT.md` and capture genuinely hard-to-reverse decisions as ADRs.

## The interview

Conduct the grilling exactly as described in the [grill-me skill](../grill-me/SKILL.md): one question at a time, highest-impact first, walking down each branch of the design tree and resolving dependencies before moving on. Track the phase internally, state brief conclusions, and prefer exploring the codebase over asking when a question can be answered there.

## Building docs as you go

While grilling, follow the active domain-modeling discipline in [DOMAIN-MODELING.md](./DOMAIN-MODELING.md). The key habits:

- **Challenge fuzzy or conflicting terms** the moment they come up, and propose a precise canonical word.
- **Cross-reference with the code** — surface contradictions between what the user says and what the code does.
- **Update `CONTEXT.md` inline** the instant a term is resolved, using [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md). Keep it a glossary, free of implementation details.
- **Offer an ADR sparingly** — only when a decision is hard to reverse, surprising without context, and the result of a real trade-off. Use [ADR-FORMAT.md](./ADR-FORMAT.md).

Capture decisions and terms as they crystallise — don't batch them up for the end.
