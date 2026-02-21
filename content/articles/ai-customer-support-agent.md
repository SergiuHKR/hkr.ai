---
title: "Building an AI Customer Support Agent That Actually Works"
description: "How we built a support agent that resolves 73% of tickets autonomously — without hallucinating company policies."
category: "Customer Support"
date: "2026-02-21"
author: "Sergiu Poenaru"
---

## The Problem

A mid-size eCommerce company was drowning in 2,000+ support tickets per week. Their team of 8 agents couldn't keep up. Response times averaged 14 hours. Customer satisfaction was at 62%.

They'd tried a basic chatbot. It answered FAQs but escalated everything else — which was 80% of tickets.

## The Agentic Workflow

We built a multi-step AI agent using Claude that could:

1. **Classify** the ticket (refund, shipping, product question, complaint, other)
2. **Retrieve** relevant context from their knowledge base (RAG over Zendesk articles + Shopify order data)
3. **Draft** a response following their brand voice guidelines
4. **Execute** actions (issue refunds under $50, update shipping addresses, cancel orders)
5. **Escalate** to a human when confidence was low or the customer was upset

## Key Design Decisions

- **Confidence thresholds**: The agent only auto-responds when confidence > 0.85. Below that, it drafts a response for human review.
- **Action guardrails**: Refunds over $50 always require human approval. No exceptions.
- **Tone matching**: We fine-tuned the system prompt with 200 examples of their best agent responses.
- **Audit trail**: Every AI decision is logged with reasoning, so managers can review and improve.

## Results (After 8 Weeks)

| Metric | Before | After |
|--------|--------|-------|
| Auto-resolution rate | 12% | 73% |
| Average response time | 14 hours | 2 minutes |
| Customer satisfaction | 62% | 89% |
| Tickets per agent/day | 45 | 12 (complex only) |

## Tech Stack

- **LLM**: Claude 3.5 Sonnet (via API)
- **Orchestration**: Custom Python agent with tool use
- **Knowledge base**: Pinecone vector DB + Zendesk API
- **Actions**: Shopify Admin API for order management
- **Monitoring**: Custom dashboard tracking confidence scores, escalation rates, and resolution quality
