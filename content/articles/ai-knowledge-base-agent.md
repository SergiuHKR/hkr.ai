---
title: "Building an Internal Knowledge Base Agent"
description: "How a 200-person company made tribal knowledge searchable — reducing onboarding time from 3 months to 6 weeks."
category: "HR & People Ops"
date: "2026-02-15"
author: "Sergiu Poenaru"
---

## The Problem

A growing SaaS company had 200 employees and a serious knowledge problem. Product specs lived in Google Docs. Engineering decisions were buried in Slack threads. Customer edge cases existed only in senior support reps' heads. New hires took 3 months to become productive because no one could find answers to basic questions.

The wiki had 2,000+ pages. The search was keyword-based and useless. People defaulted to "ask someone on Slack" — which interrupted deep work across the company.

## The Solution

We built a RAG-powered knowledge base agent that:

1. **Indexes all company knowledge** — Google Docs, Confluence, Slack channels, Notion, and recorded meetings
2. **Answers questions in natural language** with citations to source documents
3. **Maintains freshness** by re-indexing updated documents every 6 hours
4. **Knows what it doesn't know** — when confidence is low, it suggests the right person to ask
5. **Learns from corrections** — when someone flags an incorrect answer, it updates the index weight

## How It Works

The system uses a hybrid search approach:

- **Semantic search** for conceptual questions ("How do we handle enterprise SSO?")
- **Keyword search** for specific lookups ("What's the API rate limit for the /users endpoint?")
- **Metadata filtering** for scoped queries ("Show me engineering decisions from Q4 2025")

Documents are chunked into ~500 token segments, embedded with OpenAI's `text-embedding-3-large`, and stored in Supabase pgvector. The retrieval step pulls the top 8 chunks, re-ranks them, and feeds them to Claude for answer synthesis.

## The Results

| Metric | Before | After |
|--------|--------|-------|
| New hire time-to-productivity | 12 weeks | 6 weeks |
| "Where do I find X?" Slack messages/week | ~120 | ~15 |
| Knowledge search satisfaction | 23% | 87% |
| Documents indexed | 0 (effectively) | 4,200+ |

The agent handles 300+ queries per day. The most common: "How does [feature] work?" and "What's our policy on [topic]?"

## Key Takeaways

- **Start with the 50 most-asked questions.** Before building anything, survey your team. The top 50 questions tell you exactly what knowledge is missing and where to focus indexing.
- **Citation is non-negotiable.** People won't trust an AI answer without seeing the source. Every response includes clickable links to the original document.
- **Freshness beats completeness.** A system that indexes 80% of docs but stays current is more valuable than one that indexes everything but goes stale.
- **The "I don't know" response is the most important feature.** A confident wrong answer is worse than no answer. When the agent isn't sure, it says so — and points to a human who can help.
