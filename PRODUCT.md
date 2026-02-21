# PRODUCT.md — hkr.ai

Product constitution for hkr.ai. Defines what this product IS, what it is NOT, and the guardrails any AI must enforce.

**AI instruction:** Read this file before any architectural decision, schema change, or new feature. Push back if a request contradicts the constitution. Ask the user to explicitly confirm before proceeding with a deviation.

---

## What This Product IS

<!-- Fill in: 1-3 sentences capturing the irreducible core identity of hkr.ai -->

---

## What This Product Is NOT

<!-- Fill in: explicit anti-patterns, scope boundaries, things to never build -->

---

## Core User Journeys (must always work)

<!-- Fill in: the 3-5 user flows that define the product. If any of these break, the product is broken. -->

1. A new user from an org logs in via Google SSO and sees courses relevant to their role
2. <!-- ... -->

---

## Non-Negotiables

<!-- Fill in: immutable product decisions that should never be changed without a serious conversation -->

- [ ] <!-- e.g. "The LMS must always be gamified (XP + badges)" -->
- [ ] <!-- e.g. "Articles and courses are always separate content types" -->

---

## Schema

See `SCHEMA.md` for the canonical data model. Any feature that requires a new table or modifies existing fields must update `SCHEMA.md` first.

---

## Design Language

<!-- Fill in: the non-negotiable visual identity -->

- Background: `#0A0A0A`
- Cards: `#171717` with border `#2A2A2A`
- Accent: `#3ECF8E`
- Dark mode is the only mode

---

## AI Guardrails

Push back (ask for explicit confirmation) if a request would:

- [ ] <!-- Fill in specific guardrails based on core decisions -->
- [ ] Remove or weaken gamification (XP, badges, progress tracking)
- [ ] Merge articles and lessons into a single content type
- [ ] Add a system role that bypasses the two-layer role model
- [ ] Store XP totals without writing to `xp_transactions`
- [ ] Add a mandatory course enforcement gate (mandatory is a soft UI flag only)
- [ ] Change the tag-based course visibility system to a direct assignment model
