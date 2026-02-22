---
title: "The AI Meeting Summarizer That Replaced 6 Hours of Notes"
description: "How a consulting firm automated meeting notes, action items, and CRM updates — giving consultants 6 hours back per week."
category: "Operations"
date: "2026-02-08"
author: "Sergiu Poenaru"
---

## The Problem

A 50-person consulting firm had 200+ client meetings per week. After each meeting, consultants were expected to write up notes, extract action items, update the CRM, and send a follow-up email. In practice, most of this didn't happen. Notes were incomplete or missing entirely. Action items fell through cracks. CRM data was always stale.

The firm estimated each consultant spent 6+ hours per week on post-meeting administrative work — time that should have been billable.

## The Solution

We built a meeting summarizer agent that:

1. **Records and transcribes meetings** via Fireflies (Zoom, Google Meet, Teams)
2. **Generates structured summaries** — key decisions, discussion topics, open questions
3. **Extracts action items** with owners and deadlines
4. **Updates the CRM** — logs meeting notes, updates deal stage, creates follow-up tasks
5. **Drafts follow-up emails** — personalized recaps sent to the client within 1 hour of the meeting

## The Workflow

The process is fully automated:

1. Meeting ends → transcript is available within 5 minutes
2. AI agent processes the transcript → generates summary, action items, and follow-up draft
3. Summary + action items are posted to the project's Slack channel
4. CRM is updated with meeting notes and next steps
5. Follow-up email draft is sent to the consultant for review + send

The consultant's only action: review and click "send" on the follow-up email. Everything else is automatic.

## The Technology

| Component | Tool |
|-----------|------|
| Recording + transcription | Fireflies.ai |
| Summary generation | Claude 3.5 Sonnet |
| Action item extraction | Structured outputs with role assignment |
| CRM integration | HubSpot API |
| Email drafting | Claude with client context + tone matching |
| Orchestration | Custom Node.js pipeline |

The summary prompt is carefully designed to distinguish between decisions (final), action items (assigned + deadlined), and discussion points (context for future reference). It uses the CRM's existing deal data to contextualize the conversation.

## The Results

| Metric | Before | After |
|--------|--------|-------|
| Post-meeting admin time | 6 hrs/week per consultant | 30 min/week |
| Follow-up email sent within 1 hour | 15% | 92% |
| CRM accuracy (notes up to date) | ~30% | 98% |
| Action items tracked | ~40% | 95% |
| Consultant satisfaction | Low | High |

The biggest surprise: client satisfaction improved noticeably. Clients started commenting on how organized the firm was — because they received detailed, professional follow-up emails within an hour of every meeting.

## Key Takeaways

- **Post-meeting admin is the highest-ROI automation target for knowledge workers.** It's repetitive, time-consuming, and nobody likes doing it. Automate it first.
- **Structured outputs beat free-form summaries.** Separate decisions, action items, and discussion points into distinct sections. This makes the output actionable, not just informative.
- **CRM integration is the multiplier.** A summary that only goes to Slack is useful. A summary that updates the CRM, creates tasks, and drafts follow-ups is transformative.
- **Let humans review, not create.** The agent generates 95% of the content. The human reviews and adjusts. This is faster than starting from scratch and produces better results than skipping the work entirely.
