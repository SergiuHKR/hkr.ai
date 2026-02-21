---
title: "An AI Agent That Qualifies Leads While You Sleep"
description: "We built an autonomous sales pipeline agent that scores inbound leads, enriches CRM data, and drafts personalized outreach — reducing time-to-first-contact from 6 hours to 11 minutes."
category: "Sales & Revenue"
date: "2026-02-18"
author: "Sergiu Poenaru"
---

## The Bottleneck

A B2B SaaS company with 3 sales reps was losing deals before they even started. Inbound leads from the website sat in HubSpot for **6+ hours** before anyone touched them. By then, the prospect had already booked a demo with a competitor.

The math was brutal:

| Metric | Before | Industry Best |
|--------|--------|---------------|
| Time to first contact | 6.2 hours | < 5 minutes |
| Lead response rate | 34% | 78% |
| Qualified leads per week | 12 | — |
| Rep time on qualification | 18 hrs/week | — |

> "We knew we were leaving money on the table. We just didn't have enough hands."
> — VP of Sales

## What We Built

An autonomous agent pipeline with three stages, orchestrated through n8n and powered by Claude:

### Stage 1: Enrichment

When a lead submits a form, the agent immediately:

- Pulls company data from Clearbit
- Scrapes their LinkedIn company page
- Checks for existing CRM history
- Estimates company size and revenue tier

```json
{
  "company": "Acme Corp",
  "employees": 142,
  "revenue_tier": "$5M-$10M",
  "industry": "eCommerce",
  "icp_score": 87,
  "signals": ["recently_hired_vp_ops", "series_b_funded"]
}
```

### Stage 2: Scoring & Routing

The agent runs a scoring model:

- **90-100**: Hot lead → immediate Slack alert to senior rep
- **70-89**: Warm lead → auto-enroll in personalized email sequence
- **Below 70**: Nurture track → weekly educational content

The scoring isn't a black box. Every score comes with a **reasoning summary** so reps can override it:

```
Score: 87/100
Reasoning: Mid-market eCommerce (ICP match), recently hired VP Ops
(buying signal), visited pricing page 3x in 2 days (intent signal).
Recommended action: Priority outreach within 1 hour.
```

### Stage 3: Personalized Outreach

For warm and hot leads, the agent drafts a first-touch email that references:

- The specific page they visited
- Their company's industry challenges
- A relevant case study from our library

Each draft is reviewed by the sales rep before sending. The agent learns from edits — if a rep consistently changes the tone, it adapts.

## The Architecture

```
Website Form → Webhook → n8n Workflow
                          ├── Clearbit API (enrich)
                          ├── Claude (score + reason)
                          ├── HubSpot API (update CRM)
                          ├── Claude (draft email)
                          └── Slack (notify rep)
```

Every step logs to a shared Google Sheet so the team can audit decisions and spot patterns.

## Results After 90 Days

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Time to first contact | 6.2 hrs | 11 min | **97% faster** |
| Lead response rate | 34% | 71% | **+109%** |
| Qualified leads per week | 12 | 23 | **+92%** |
| Rep time on qualification | 18 hrs/week | 4 hrs/week | **-78%** |
| Pipeline value (monthly) | $180K | $340K | **+89%** |

## Lessons Learned

1. **Don't automate the close** — the agent qualifies and drafts, humans close. Trust is built person-to-person.
2. **Transparency matters** — showing the scoring reasoning made reps trust the system within 2 weeks instead of fighting it.
3. **Start with the bottleneck** — we could have built a full sales AI. Instead, we solved the one thing killing deals: slow response time.

## The Takeaway

This wasn't a $500K AI transformation project. It was a focused, 3-week build targeting one metric: time-to-first-contact. The ROI was visible in the first month.

**The best AI agents don't replace your team. They remove the bottleneck that's holding your team back.**
