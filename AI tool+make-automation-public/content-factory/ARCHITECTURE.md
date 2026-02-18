# 🏗 Content Factory Architecture

---

# 1. High-Level Architecture


            ┌──────────────────────┐
            │     Keyword Master    │
            └──────────┬───────────┘
                       │
                       ▼
             ┌──────────────────┐
             │ Daily Keyword    │
             │ Agent (Make)     │
             └──────────┬───────┘
                        │
                        ▼
              ┌─────────────────┐
              │ Research Inbox  │
              │ (Notion DB)     │
              └──────────┬──────┘
                         │
                         ▼
               ┌─────────────────┐
               │ NotebookLM      │
               │ (5 Insight Types)│
               └──────────┬──────┘
                          │
                          ▼
               ┌─────────────────┐
               │ Newsletter Input│
               └──────────┬──────┘
                          │
                          ▼
             ┌────────────────────┐
             │ AI Content Engine  │
             │ (GPT / Claude)     │
             └──────────┬─────────┘
                        │
                        ▼
             ┌────────────────────┐
             │ Newsletter Archive │
             └──────────┬─────────┘
                        │
                        ▼
             ┌────────────────────┐
             │ Sales Playbook     │
             │ Generator          │
             └──────────┬─────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ Inbound Sales   │
               │ Team            │
               └──────────┬──────┘
                          │
                          ▼
                  ┌───────────────┐
                  │ Conversion    │
                  │ Data          │
                  └──────┬────────┘
                         │
                         ▼
                  ┌───────────────┐
                  │ Keyword Score │
                  └───────────────┘


---

# 2. Data Flow Explanation

## Step 1 – Market Sensing
- Top 3 keywords selected
- ~10 articles collected daily
- Stored in Research Inbox

## Step 2 – Intelligence Extraction
- NotebookLM extracts:
  - Repeated Problems
  - Trends
  - Insights
  - Hooks
  - Sales Angles

## Step 3 – Content Production
- AI generates structured content
- Categorized by:
  - Business Unit
  - Topic
  - Funnel Stage

## Step 4 – Revenue Layer
- Sales Playbook auto-generated:
  - Customer Intent
  - First Response Script
  - Objection Handling
  - Closing

## Step 5 – Feedback Loop
- Conversions linked to keywords
- Sales Interest Score recalculated
- Next day's Top Keywords adjusted

---

# 3. Operational Safeguards

## Timebox Control



Work Started
↓
Sleep 3600s
↓
Status != Completed?
↓
Send Company Email Alert


---

# 4. Key Automation Triggers

- 09:00 Daily Keyword Agent
- Draft Requested → Generate Content
- Published → Generate Sales Playbook
- New Inbound → Auto Sales Email
- 16:00 → Today Sales Keywords

---

# 5. Future Extensions (v3)

- Predictive Keyword Modeling
- Deal Probability Scoring
- Sales Performance Learning Loop
- Multi-channel Deployment (Blog + Email + LinkedIn)

---

END
