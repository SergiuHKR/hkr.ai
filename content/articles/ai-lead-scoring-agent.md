---
title: "AI Lead Scoring That Actually Predicts Revenue"
description: "A B2B SaaS company replaced gut-feeling lead scoring with an AI agent — increasing conversion rates by 34%."
category: "Sales & Revenue"
date: "2026-02-14"
author: "Sergiu Poenaru"
---

## The Problem

A B2B SaaS company with 2,000 monthly leads had a classic sales problem: their CRM lead scores were worthless. Marketing assigned scores based on a static point system — download a whitepaper (+10), visit pricing page (+20), have a .edu email (-50). But the scores didn't correlate with actual revenue.

Sales reps ignored the scores entirely and cherry-picked leads based on gut feeling. Pipeline reviews were debates about which deals to prioritize. Win rates sat at 12%.

## The Solution

We built an AI lead scoring agent that:

1. **Analyzes 40+ signals** per lead — not just website activity, but firmographic data, tech stack, hiring patterns, funding rounds, and engagement velocity
2. **Predicts 90-day revenue probability** — not just "hot/warm/cold" but expected deal value and close timeline
3. **Explains every score** — reps see exactly why a lead scored high or low
4. **Updates in real-time** — scores change as new signals come in (email reply, meeting booked, competitor mentioned)
5. **Learns from outcomes** — closed-won and closed-lost deals retrain the model monthly

## The Architecture

The scoring pipeline runs on three layers:

**Data enrichment layer:** CRM data + Clearbit firmographics + website activity + email engagement + LinkedIn data + G2 intent signals.

**Feature engineering:** Raw signals get transformed into meaningful features. "Visited pricing page 3 times in 2 days" becomes `pricing_urgency_score: 0.87`. "Company raised Series B last month" becomes `budget_expansion_signal: 0.72`.

**Prediction model:** A gradient-boosted model predicts two things: probability of closing within 90 days, and expected contract value. The output is a single composite score from 0-100.

## The Results

| Metric | Before | After |
|--------|--------|-------|
| Lead-to-opportunity conversion | 8% | 14% |
| Opportunity win rate | 12% | 18% |
| Average sales cycle | 67 days | 49 days |
| Revenue per rep per quarter | $180K | $242K |
| Rep adoption of scoring | ~10% | 89% |

The key unlock was transparency. When reps can see "This lead scored 82 because they match 4 of your top 10 closed-won firmographic patterns and visited pricing 6 times this week," they trust and use the scores.

## Key Takeaways

- **Static point systems don't work.** The relationship between signals and revenue is non-linear and changes over time. You need a learning system.
- **Explain every score.** Black-box scores get ignored. Transparent scores get used. Every prediction should come with a human-readable rationale.
- **Firmographic signals matter more than behavioral ones.** Company size, industry, tech stack, and funding stage predict revenue better than page visits.
- **Retrain monthly, not quarterly.** Market conditions change fast. A model trained on Q3 data makes bad predictions in Q1. Monthly retraining keeps accuracy high.
