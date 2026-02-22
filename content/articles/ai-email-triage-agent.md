---
title: "How an AI Email Triage Agent Saved 14 Hours Per Week"
description: "A logistics company automated email classification and routing — reducing response time from 6 hours to 12 minutes."
category: "Operations"
date: "2026-02-18"
author: "Sergiu Poenaru"
---

## The Problem

A mid-size logistics company received 800+ emails per day across shared inboxes. Customer inquiries, shipment updates, vendor communications, and internal requests all landed in the same place. A team of 4 spent their mornings manually reading, categorizing, and forwarding emails to the right department.

Average time to first response: **6 hours**. Critical shipment alerts sometimes sat unread for half a day.

## The Solution

We built an AI email triage agent that:

1. **Reads every incoming email** within seconds of arrival
2. **Classifies intent** into 12 categories (shipment inquiry, pricing request, complaint, vendor invoice, etc.)
3. **Extracts key entities** — order numbers, tracking IDs, customer names, dates
4. **Routes to the correct team** with a pre-drafted response suggestion
5. **Escalates urgent items** (shipment delays, safety concerns) immediately via Slack

The agent runs on a simple pipeline: Gmail API webhook → classification model → entity extraction → routing rules → draft response generation.

## The Architecture

| Component | Technology |
|-----------|-----------|
| Email ingestion | Gmail API + webhooks |
| Classification | GPT-4o with few-shot examples |
| Entity extraction | Structured outputs with JSON schema |
| Routing engine | Rule-based with fallback to AI |
| Response drafting | Claude 3.5 with company knowledge base |
| Escalation | Slack webhook + PagerDuty |

The classification prompt uses 12 labeled examples — one per category — and achieves 94% accuracy on production emails. Misclassified emails are flagged for human review and used to improve the few-shot examples quarterly.

## The Results

| Metric | Before | After |
|--------|--------|-------|
| Avg response time | 6 hours | 12 minutes |
| Manual triage hours/week | 56 hours | 4 hours (review only) |
| Misrouted emails | ~15% | ~3% |
| Critical alert response | 2-4 hours | Under 5 minutes |

The 4-person triage team was reassigned to customer relationship work — higher-value tasks that actually need human judgment.

## Key Takeaways

- **Start with classification, not generation.** Getting emails to the right person fast matters more than auto-replying.
- **12 categories is the sweet spot.** Too few and routing is vague. Too many and accuracy drops.
- **Always have a human review lane.** Low-confidence classifications go to a review queue — this catches edge cases and builds training data.
- **Measure response time, not just accuracy.** A 90%-accurate system that responds in minutes beats a manual process that takes hours.
