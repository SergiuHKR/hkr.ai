---
title: "Automating Invoice Processing with AI Agents"
description: "From 3 hours of manual data entry per day to fully automated invoice-to-ERP pipeline."
category: "Operations"
date: "2026-02-20"
author: "Sergiu Poenaru"
---

## The Problem

A logistics company processed 150+ invoices daily. Each invoice had to be manually read, validated against purchase orders, entered into their ERP, and filed. Three full-time employees spent their entire day on this.

Errors were common — wrong amounts, duplicate entries, missed invoices. Month-end reconciliation took 2 full days.

## The Agentic Workflow

We built an end-to-end pipeline:

1. **Ingest**: Invoices arrive via email or upload (PDF, image, or structured data)
2. **Extract**: AI reads the invoice — vendor, line items, amounts, dates, PO numbers
3. **Validate**: Cross-reference against purchase orders in the ERP. Flag mismatches.
4. **Approve**: Auto-approve if within tolerance. Route exceptions to the right person.
5. **Post**: Push validated data directly into the ERP system.
6. **File**: Archive the original document with extracted metadata for search.

## Key Design Decisions

- **Multi-format handling**: The agent handles scanned PDFs (OCR), digital PDFs, and even photos of invoices taken on mobile.
- **Tolerance bands**: Small discrepancies (under 2%) are auto-approved with a note. Larger ones are flagged.
- **Vendor learning**: The system learns each vendor's invoice format over time, improving extraction accuracy.
- **Human-in-the-loop**: Exceptions go to a review queue with the AI's best guess pre-filled.

## Results (After 6 Weeks)

| Metric | Before | After |
|--------|--------|-------|
| Processing time per invoice | 12 min | 30 sec |
| Daily manual hours | 9 hours | 45 min (exceptions only) |
| Error rate | 4.2% | 0.3% |
| Month-end reconciliation | 2 days | 2 hours |

## Tech Stack

- **OCR + Extraction**: Claude vision for document understanding
- **Orchestration**: n8n workflow automation
- **Validation**: Custom rules engine + ERP API
- **Storage**: Supabase Storage + Postgres for metadata
- **Monitoring**: Slack alerts for exceptions and daily summary reports
