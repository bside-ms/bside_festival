---
name: grill-me
description: Interview the user relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree. Use when user wants to stress-test a plan, get grilled on their design, or mentions "grill me".
---

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

Track the grilling phase internally. Use phases such as: core assumptions, design tradeoffs, implementation shape, edge cases, and final tightening. Only mention the phase when it changes, and phrase it naturally, for example: "Now that the goal is settled, let's move into implementation shape."

Prefer high-impact questions first. Track each question's importance internally, but do not print rigid labels like "Importance: high". Instead, communicate importance through natural wording in the question setup, such as "the main architectural choice", "one smaller cleanup decision", or "a final edge-case check".

Before asking the next question, make sure the current question has reached a clear conclusion. If the answer is ambiguous, incomplete, or opens a dependency that must be settled first, ask a follow-up about that same question instead of moving on.

When a question is concluded, briefly state the conclusion before moving on. Keep the conclusion very short, ideally one sentence or less, then ask exactly one next question.

If the remaining questions are mostly low-importance, say so transparently and conversationally, then enter a final pass. In the final pass, ask at most 3 more questions, then summarize the agreed conclusions and unresolved risks.

Keep visible output human and compact. Preserve brief conclusions and recommended answers, but avoid repetitive mini-headlines such as "Phase:", "Question 2", or "Importance:" unless the user explicitly asks for structured output.

If a question can be answered by exploring the codebase, explore the codebase instead.
