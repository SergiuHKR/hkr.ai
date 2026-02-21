---
title: "From 40 Hours to 40 Minutes: AI Document Processing for Finance Teams"
description: "How a logistics company automated their invoice processing pipeline — extracting data from PDFs, matching POs, and flagging anomalies with 99.2% accuracy."
category: "Finance & Operations"
date: "2026-02-15"
author: "Sergiu Poenaru"
---

## The Pain

A logistics company processed **800+ invoices per month** across 120 vendors. Each invoice required:

1. Download the PDF from email
2. Manually key data into their ERP
3. Match against purchase orders
4. Flag discrepancies for review
5. Route for approval

Two full-time finance staff spent **~40 hours per week** on this. Errors averaged 4.3% — mostly fat-finger typos during data entry. Each error cost 2-3 hours to reconcile.

> "Our best people were doing data entry. It was soul-crushing and expensive."

## The Solution

We built a document processing pipeline using Claude's vision capabilities, a Python orchestrator, and their existing ERP's API.

### How It Works

**Step 1: Ingestion**

Invoices arrive via email. A mail rule forwards them to a processing inbox. The agent picks them up every 15 minutes.

```python
# Simplified extraction flow
async def process_invoice(pdf_path: str) -> InvoiceData:
    # Extract text + table data using Claude vision
    response = await claude.messages.create(
        model="claude-sonnet-4-20250514",
        messages=[{
            "role": "user",
            "content": [
                {"type": "image", "source": pdf_to_base64(pdf_path)},
                {"type": "text", "text": EXTRACTION_PROMPT}
            ]
        }]
    )
    return parse_structured_output(response)
```

**Step 2: Extraction**

Claude reads each PDF visually (not OCR — actual vision) and extracts:

| Field | Example |
|-------|---------|
| Vendor name | Maersk Line |
| Invoice number | INV-2026-0847 |
| Date | 2026-02-10 |
| Line items | 3x Container shipping, Rotterdam → NYC |
| Subtotal | $12,450.00 |
| Tax | $0.00 (B2B exempt) |
| Total | $12,450.00 |
| Payment terms | Net 30 |

**Step 3: PO Matching**

The agent queries the ERP for matching purchase orders using vendor name + amount range (±5%). When a match is found, it cross-references line items.

Three possible outcomes:

- **Exact match** → auto-approve, queue for payment
- **Partial match** → flag specific discrepancies for human review
- **No match** → escalate to finance manager

**Step 4: Anomaly Detection**

Before routing for approval, the agent checks for:

- Price increases > 10% vs. last invoice from same vendor
- Duplicate invoice numbers
- Unusual payment terms
- Line items not on the original PO

```
⚠ ANOMALY DETECTED
Vendor: GlobalFreight Inc.
Issue: Unit price for "Pallet Storage" increased 23% vs. last invoice
Previous: $45/pallet/day → Current: $55.35/pallet/day
Action: Flagged for finance manager review
```

## Accuracy

We ran the system in parallel with manual processing for 30 days:

| Metric | Manual | AI Agent |
|--------|--------|----------|
| Data extraction accuracy | 95.7% | **99.2%** |
| PO match rate | 91% | **94%** |
| Processing time per invoice | 3.2 min | **0.3 min** |
| False positive anomalies | N/A | 2.1% |

The 0.8% of extraction errors were edge cases: handwritten notes on invoices, unusual PDF layouts, and scanned documents at extreme angles. We added a confidence score — anything below 95% gets human review.

## The Stack

```
Incoming Email
  └── Python Orchestrator (runs on AWS Lambda)
        ├── Claude API (vision extraction)
        ├── ERP API (PO lookup + data entry)
        ├── Anomaly rules engine
        └── Slack notifications
              ├── #finance-approvals (matched invoices)
              └── #finance-review (anomalies + low confidence)
```

Total infrastructure cost: **~$180/month** (Claude API + Lambda compute).

## Impact

| Before | After |
|--------|-------|
| 40 hrs/week on invoice processing | 3 hrs/week (review + exceptions) |
| 2 FTEs dedicated to data entry | 0.2 FTE (oversight only) |
| 4.3% error rate | 0.8% error rate |
| $0 — no anomaly detection | $22K saved in Year 1 from caught overcharges |

The two finance staff now spend their time on analysis, vendor negotiations, and cash flow forecasting — work that actually moves the business forward.

## Why This Works

Three principles made this project succeed:

1. **Vision > OCR** — Claude reads PDFs like a human reads them. No brittle template matching. New vendor? New format? It just works.
2. **Human-in-the-loop** — the agent doesn't make payment decisions. It prepares everything perfectly so humans make fast, confident decisions.
3. **Confidence scoring** — the system knows when it's unsure. That honesty is what makes it trustworthy.
