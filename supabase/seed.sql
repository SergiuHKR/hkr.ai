-- ============================================================================
-- Seed: AI Literacy Course (mandatory for all HKR team members)
-- ============================================================================

-- Course
insert into public.courses (id, slug, title, description, tier, is_published, sort_order)
values (
  'a1000000-0000-0000-0000-000000000001',
  'ai-literacy',
  'AI Literacy',
  'The foundation. Understand what AI actually is, how language models work, and why this changes everything. Mandatory for every HKR team member.',
  'beginner',
  true,
  1
);

-- Module 1: What is AI?
insert into public.modules (id, course_id, slug, title, description, sort_order)
values (
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'what-is-ai',
  'What is AI?',
  'Strip away the hype. Learn what AI actually is, what it can and cannot do, and why 2024-2026 is different from every previous "AI wave."',
  1
);

insert into public.lessons (id, module_id, slug, title, content_md, duration_minutes, xp_reward, sort_order)
values
(
  'c1000000-0000-0000-0000-000000000001',
  'b1000000-0000-0000-0000-000000000001',
  'ai-is-not-magic',
  'AI Is Not Magic',
  '# AI Is Not Magic

AI is pattern recognition at scale. That''s it. Every headline about "artificial intelligence" boils down to this: software that finds patterns in data and makes predictions based on those patterns.

## What AI actually does

1. **Takes input** — text, images, numbers, audio
2. **Compares it to patterns** learned from massive datasets
3. **Generates output** — a prediction, a classification, or new content

## What AI does NOT do

- **Think** — it has no understanding, no consciousness
- **Reason** — it mimics reasoning patterns but doesn''t truly reason
- **Know things** — it has statistical associations, not knowledge

## Why this matters for your job

When you use ChatGPT, Claude, or any AI tool at work, you''re using a very sophisticated pattern matcher. Understanding this helps you:

- Know when AI will work well (lots of data, clear patterns)
- Know when it won''t (novel situations, nuanced judgment)
- Stop being afraid of it
- Start using it effectively',
  5,
  10,
  1
),
(
  'c1000000-0000-0000-0000-000000000002',
  'b1000000-0000-0000-0000-000000000001',
  'brief-history',
  'A Brief History of AI',
  '# A Brief History of AI

AI isn''t new. What''s new is that it finally works well enough to matter for your daily job.

## The timeline

| Year | What happened |
|------|--------------|
| 1956 | "Artificial Intelligence" coined at Dartmouth |
| 1960s-80s | Expert systems, rule-based AI — limited, brittle |
| 1997 | Deep Blue beats Kasparov at chess |
| 2012 | Deep learning revolution begins (ImageNet) |
| 2017 | Transformers architecture invented (the "T" in GPT) |
| 2022 | ChatGPT launches — AI goes mainstream |
| 2024-26 | Agents, reasoning models, multimodal AI |

## Why now?

Three things converged:
1. **Compute** — GPUs became powerful enough
2. **Data** — the internet created massive training datasets
3. **Algorithms** — transformers made language models actually work

## The key insight

Every previous AI wave promised too much and delivered too little. This wave is different because the technology actually works for real business tasks — writing, analysis, coding, customer support, data processing.',
  5,
  10,
  2
),
(
  'c1000000-0000-0000-0000-000000000003',
  'b1000000-0000-0000-0000-000000000001',
  'types-of-ai',
  'Types of AI You''ll Actually Use',
  '# Types of AI You''ll Actually Use

Forget about "artificial general intelligence" and sci-fi scenarios. Here are the types of AI that matter for your work right now.

## 1. Large Language Models (LLMs)

**What:** AI that reads and generates text
**Examples:** ChatGPT, Claude, Gemini
**Use at work:** Writing emails, summarizing documents, answering questions, brainstorming

## 2. Image Generation

**What:** AI that creates images from text descriptions
**Examples:** DALL-E, Midjourney, Stable Diffusion
**Use at work:** Marketing visuals, mockups, presentations

## 3. Speech & Audio

**What:** AI that transcribes, translates, and generates speech
**Examples:** Whisper, ElevenLabs, Fireflies
**Use at work:** Meeting notes, voice assistants, translations

## 4. AI Agents

**What:** AI that can take actions, not just generate text
**Examples:** Claude Code, Devin, custom agents
**Use at work:** Automating multi-step workflows, coding, research

## The one to focus on

For 90% of people reading this, **LLMs are the tool that will change your daily work the most.** That''s what the rest of this course focuses on.',
  7,
  15,
  3
);

-- Module 2: How Language Models Work
insert into public.modules (id, course_id, slug, title, description, sort_order)
values (
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'how-llms-work',
  'How Language Models Work',
  'You don''t need a PhD to understand this. Learn the core mechanics of LLMs — tokens, context windows, temperature — so you can use them better.',
  2
);

insert into public.lessons (id, module_id, slug, title, content_md, duration_minutes, xp_reward, sort_order)
values
(
  'c1000000-0000-0000-0000-000000000004',
  'b1000000-0000-0000-0000-000000000002',
  'tokens-and-context',
  'Tokens and Context Windows',
  '# Tokens and Context Windows

Every time you type something into ChatGPT or Claude, the AI breaks your text into **tokens** — small chunks of text, roughly 3/4 of a word.

## What is a token?

- "Hello" = 1 token
- "artificial intelligence" = 2 tokens
- A typical email = ~200-400 tokens
- This entire lesson = ~500 tokens

## Why tokens matter

AI models have a **context window** — the maximum number of tokens they can process at once. Think of it as the AI''s short-term memory.

| Model | Context window |
|-------|---------------|
| GPT-4o | 128K tokens (~96K words) |
| Claude 3.5 Sonnet | 200K tokens (~150K words) |
| Gemini 1.5 Pro | 1M tokens (~750K words) |

## Practical implications

1. **Longer inputs = better answers** — give the AI more context
2. **There''s a limit** — you can''t paste an entire codebase (usually)
3. **Cost scales with tokens** — more tokens = higher API cost
4. **The AI forgets** — once you exceed the context window, early information gets lost',
  5,
  10,
  1
),
(
  'c1000000-0000-0000-0000-000000000005',
  'b1000000-0000-0000-0000-000000000002',
  'temperature-and-creativity',
  'Temperature and Creativity',
  '# Temperature and Creativity

When AI generates text, it doesn''t write word by word like a human. It predicts the next token based on probability — and **temperature** controls how "creative" or "predictable" those predictions are.

## Temperature = randomness dial

| Temperature | Behavior | Best for |
|-------------|----------|----------|
| 0 | Always picks the most likely next token | Factual answers, code, data extraction |
| 0.5-0.7 | Balanced — mostly predictable with some variety | General writing, emails, summaries |
| 1.0+ | More random, surprising choices | Creative writing, brainstorming |

## Why this matters

If you ask an AI the same question twice:
- **Low temperature** → you get nearly identical answers
- **High temperature** → you get different answers each time

## Practical tip

Most AI tools don''t let you set temperature directly. But understanding it helps you:
- Know why AI sometimes gives weird answers (temperature too high)
- Know why it''s repetitive (temperature too low)
- Adjust your prompts accordingly — be more specific when you want precision, more open-ended when you want creativity',
  5,
  10,
  2
),
(
  'c1000000-0000-0000-0000-000000000006',
  'b1000000-0000-0000-0000-000000000002',
  'hallucinations',
  'Hallucinations: When AI Lies Confidently',
  '# Hallucinations: When AI Lies Confidently

This is the single most important thing to understand about AI: **it can be confidently wrong.**

## What is a hallucination?

When an AI generates information that sounds plausible but is completely made up. It''s not lying — it doesn''t know what truth is. It''s predicting the most likely next tokens, and sometimes "likely" doesn''t mean "true."

## Examples

- Citing academic papers that don''t exist
- Making up statistics with precise numbers
- Inventing historical events
- Generating code that looks right but has subtle bugs

## Why it happens

LLMs are trained to generate fluent, coherent text — not to be factually accurate. Fluency and accuracy are different skills. The AI optimizes for "sounds right" not "is right."

## How to protect yourself

1. **Never trust AI output without verification** for anything that matters
2. **Ask for sources** — then check if those sources actually exist
3. **Cross-reference** — use AI output as a starting point, not the final answer
4. **Be extra careful with numbers** — statistics, dates, and quantities are hallucination-prone

## The golden rule

> Use AI as a co-pilot, never as autopilot.',
  7,
  15,
  3
);

-- Module 3: Using AI at Work
insert into public.modules (id, course_id, slug, title, description, sort_order)
values (
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000001',
  'ai-at-work',
  'Using AI at Work',
  'Practical, hands-on guidance for using AI tools in your daily work. No theory — just workflows that save time.',
  3
);

insert into public.lessons (id, module_id, slug, title, content_md, duration_minutes, xp_reward, sort_order)
values
(
  'c1000000-0000-0000-0000-000000000007',
  'b1000000-0000-0000-0000-000000000003',
  'prompting-basics',
  'Prompting Basics',
  '# Prompting Basics

The quality of AI output depends almost entirely on the quality of your input. Good prompting is the #1 skill to develop.

## The 4-part prompt formula

1. **Role** — Tell the AI who it is: "You are a senior customer support agent..."
2. **Context** — Give background: "Our company sells SaaS to mid-market companies..."
3. **Task** — Be specific about what you want: "Write a reply to this customer complaint..."
4. **Format** — Specify the output: "Keep it under 150 words, professional tone, include next steps"

## Bad prompt vs good prompt

**Bad:** "Write an email about the project"

**Good:** "You are a project manager at a tech consulting firm. Write a status update email to the client about the AI automation project. The project is on track, we completed the data pipeline last week, and next week we start testing. Keep it under 200 words, professional but friendly tone."

## Quick tips

- **Be specific** — vague input = vague output
- **Give examples** — show the AI what you want
- **Iterate** — first output is rarely perfect, refine it
- **Set constraints** — word limits, tone, format
- **Think step by step** — break complex tasks into steps',
  8,
  15,
  1
),
(
  'c1000000-0000-0000-0000-000000000008',
  'b1000000-0000-0000-0000-000000000003',
  'daily-workflows',
  'Daily AI Workflows',
  '# Daily AI Workflows

Here are 5 workflows you can start using today, regardless of your role.

## 1. Email drafting

Instead of staring at a blank screen:
- Paste the email you''re replying to
- Tell the AI your intent and tone
- Edit the output (never send AI text unedited)

## 2. Meeting preparation

Before any meeting:
- Ask AI to summarize the agenda context
- Generate questions to ask
- Draft talking points

## 3. Document summarization

Got a 20-page report?
- Paste it into the AI
- Ask for a 5-bullet summary
- Then ask follow-up questions about specific sections

## 4. Writing improvement

After you write something:
- Ask AI to review for clarity and grammar
- Ask it to make it more concise
- Ask it to adjust the tone (more formal, more casual, etc.)

## 5. Research acceleration

When exploring a new topic:
- Ask AI for an overview
- Then deep-dive into specific areas
- Always verify claims independently

## The 80/20 rule

AI handles 80% of the work in seconds. You add the 20% that requires judgment, context, and human touch. That combination is unbeatable.',
  8,
  15,
  2
),
(
  'c1000000-0000-0000-0000-000000000009',
  'b1000000-0000-0000-0000-000000000003',
  'ai-ethics-at-hkr',
  'AI Ethics & Security at HKR',
  '# AI Ethics & Security at HKR

Using AI at work comes with responsibilities. Here''s what every HKR team member needs to know.

## Data security rules

1. **Never paste client credentials** (API keys, passwords, tokens) into AI tools
2. **Never share PII** (names + personal data) without client consent
3. **Check your company''s AI policy** before using AI with client data
4. **Use enterprise-tier AI tools** that don''t train on your data (Claude, ChatGPT Enterprise)

## Transparency

- **Tell clients** when AI assisted your work
- **Don''t claim AI work as purely human** — it''s dishonest and clients will find out
- **Review everything** — you''re responsible for the output, not the AI

## Bias awareness

AI models reflect biases in their training data. Be aware that:
- Suggestions may reflect cultural or demographic biases
- Always apply human judgment to sensitive topics
- Challenge AI outputs that seem off

## Copyright

- AI-generated text is generally not copyrightable (laws are evolving)
- Don''t use AI to reproduce copyrighted content
- Your prompts may be stored — don''t include confidential material in free-tier tools

## The HKR standard

We use AI to be faster and better, not lazier. Every AI output gets human review. We''re transparent about AI usage. We protect client data above all.',
  10,
  20,
  3
);

-- Second course (unpublished, coming soon)
insert into public.courses (id, slug, title, description, tier, is_published, sort_order)
values (
  'a1000000-0000-0000-0000-000000000002',
  'prompt-engineering',
  'Prompt Engineering',
  'Go beyond basics. Learn advanced prompting techniques — chain-of-thought, few-shot learning, system prompts, and structured outputs.',
  'intermediate',
  false,
  2
);

-- ============================================================================
-- Seed: Gamification — Organization, Team, Season, Achievements
-- ============================================================================

-- Organization: HKR
insert into public.organizations (id, name, slug, logo_url)
values (
  'd1000000-0000-0000-0000-000000000001',
  'HKR',
  'hkr',
  null
);

-- Team: General (default team for HKR)
insert into public.teams (id, org_id, name, slug)
values (
  'e1000000-0000-0000-0000-000000000001',
  'd1000000-0000-0000-0000-000000000001',
  'General',
  'general'
);

-- Season 1: Genesis (Q1 2026)
insert into public.seasons (id, name, slug, starts_at, ends_at, is_active)
values (
  'f1000000-0000-0000-0000-000000000001',
  'Genesis',
  'genesis-q1-2026',
  '2026-01-01',
  '2026-03-31',
  true
);

-- Achievements (7 at launch)
insert into public.achievements (id, slug, title, description, icon, criteria_type, criteria_value, sort_order)
values
(
  'a2000000-0000-0000-0000-000000000001',
  'first-steps',
  'First Steps',
  'Complete your first lesson. Every journey begins with a single step.',
  'footprints',
  'first_lesson',
  '{"count": 1}',
  1
),
(
  'a2000000-0000-0000-0000-000000000002',
  'ai-literate',
  'AI Literate',
  'Complete the AI Literacy course. You now speak the language of AI.',
  'graduation-cap',
  'course_complete',
  '{"course_slug": "ai-literacy"}',
  2
),
(
  'a2000000-0000-0000-0000-000000000003',
  'on-fire',
  'On Fire',
  'Maintain a 7-day learning streak. Consistency beats intensity.',
  'flame',
  'streak',
  '{"days": 7}',
  3
),
(
  'a2000000-0000-0000-0000-000000000004',
  'unstoppable',
  'Unstoppable',
  'Maintain a 30-day learning streak. You are a machine.',
  'zap',
  'streak',
  '{"days": 30}',
  4
),
(
  'a2000000-0000-0000-0000-000000000005',
  'century-club',
  'Century Club',
  'Earn 100 XP total. Welcome to the triple digits.',
  'trophy',
  'xp_total',
  '{"xp": 100}',
  5
),
(
  'a2000000-0000-0000-0000-000000000006',
  'speed-learner',
  'Speed Learner',
  'Complete 3 lessons in a single day. Knowledge speedrun.',
  'rocket',
  'lessons_per_day',
  '{"count": 3}',
  6
),
(
  'a2000000-0000-0000-0000-000000000007',
  'early-adopter',
  'Early Adopter',
  'Join during Season 1: Genesis. You were here from the beginning.',
  'sparkles',
  'early_adopter',
  '{"season_slug": "genesis-q1-2026"}',
  7
);
