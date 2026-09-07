# Mentora — Solutions & Design Decisions

This document maps each identified **problem** to Mentora's concrete **solution**, and details how the personalization, content, gamification, and delivery mechanisms work together.

---

## 1. Problem → Solution Matrix

| # | Problem | Mentora Solution |
| --- | --- | --- |
| 1 | **One-size-fits-all learning** | Level classifier (beginner/intermediate/advanced) + role/experience-aware journeys. Two employees with the same interest get different roadmaps. |
| 2 | **Information overload** | Curated, ordered modules per journey; only the *next relevant* content is surfaced. YouTube results are scoped to the specific skill in context. |
| 3 | **Lack of personalization** | `Person → Context → Skill Gap → Learning Journey` model driven by onboarding profile. |
| 4 | **Time constraints** | Bite-sized flashcards, short videos, and a linear "what to do next" roadmap remove decision fatigue. |
| 5 | **Unclear career direction** | Skill-gap predictor turns *"I want to move into AI"* into an ordered, actionable plan (what you have → what's missing → what to learn first → what's next). |
| 6 | **Learning disconnected from career** | Learning notes, Skill Passport, and goal-linked journeys tie every completion back to career context. |

---

## 2. Personalization Solution (Deep Dive)

### 2.1 Inputs (from onboarding)
- **Professional:** job role, industry, years of experience, current skills, technical/non-technical background.
- **Preferences:** interests, preferred topics/formats, existing knowledge.
- **Career:** goals, desired skills, potential transitions, areas to improve.

### 2.2 Step 1 — Level classification
A heuristic (extensible to ML) assigns **beginner / intermediate / advanced** using years of experience + depth/breadth of current skills relative to the target domain.

```
if experience < 2 or few relevant skills      → beginner
elif experience < 5 or moderate skill overlap → intermediate
else                                          → advanced
```

### 2.3 Step 2 — Skill-gap prediction
```
skill_gap = desired_skills ∪ role_target_skills  −  current_skills
```
Gaps are ranked by relevance to the stated **career goal** and by prerequisite ordering.

### 2.4 Step 3 — Journey (roadmap) construction
Ranked gaps are mapped to catalog **modules**, ordered by prerequisites and grouped into levels. The result is a **level-gated roadmap**.

**Worked example — Software Developer, GenAI goal**
```
GenAI Foundations → LLMs & Prompt Engineering → Embeddings & RAG
        → Tool Calling → AI Agents → Building AI Applications
```

**Worked example — Product Manager, AI-products goal**
```
AI Fundamentals → Understanding LLM Capabilities → AI Product Strategy
        → AI UX & Product Design → Evaluating AI Products → AI Product Roadmap
```

### 2.5 Step 4 — Content attachment
Each module is enriched by the **Content Aggregator** with flashcards, YouTube videos, retired-employee insights, and an end-of-module recorded session.

### 2.6 Regeneration
When a user changes goals/skills, Plus/Pro users can **regenerate** the journey; progress on still-relevant modules is preserved.

---

## 3. Roadmap Gating Solution

Learning is **progressive**: a user must complete prior levels to unlock the next.

```
[Beginner]  ✅ completed  ──unlocks──▶  [Intermediate]  🔓
[Intermediate] 🔓 in progress ──gates──▶ [Advanced]     🔒 locked
```

- Each module has `status`: `locked | available | in_progress | completed`.
- `POST /api/modules/:id/complete` transitions status and **unlocks successors**.
- Prevents skipping fundamentals and keeps the path manageable (addresses Problem 4).

---

## 4. Content-Format Solution (Three Forms per Skill)

| Format | Purpose | Source |
| --- | --- | --- |
| **Flash cards** | Fast recall, spaced repetition, low time cost | Authored catalog |
| **Related videos** | Visual/deep explanations | **YouTube** (open-source content, fetched server-side) |
| **Retired-employee insights** | Real-world practical wisdom | Curated (Plus/Pro) |

Plus, per **module**: an **end-of-module recorded session/lecture**; per **journey**: **live mentorship sessions**.

### 4.1 "Generate my learnings"
After each module/bite, the user can capture a **learning note** (`POST /api/modules/:id/notes`) — reinforcing retention and tying learning to career context (addresses Problem 6).

---

## 5. YouTube Integration Solution

- All YouTube requests are proxied through `GET /api/videos/search` (server-side) so any API key stays in `process.env` and never reaches the browser.
- Queries are **context-scoped**: built from `module.skill + journey.domain + level` (e.g., *"RAG embeddings tutorial for developers"*), not a broad topic — directly countering information overload (Problem 2).
- Results normalized to `{ videoId, title, channel, thumbnail, url }`.

---

## 6. Tiering Solution (Free / Plus / Pro)

Entitlements are enforced centrally by the **Tier / Entitlement Service** and checked in gated route handlers.

| Capability | Free | Plus | Pro |
| --- | --- | --- | --- |
| Active journeys | 1 | 3 | ∞ |
| Personalization filters | basic | extended | all |
| Insights / recorded sessions | ❌ | ✅ | ✅ |
| Community posting | ❌ (read-only) | ✅ | ✅ |
| Live mentorship | ❌ | limited | full |
| Org analytics | ❌ | ❌ | ✅ |

This monetizes value while keeping a genuinely useful **free** entry point.

---

## 7. Gamification & Motivation Solution

- **Quizzes** validate learning and award points.
- **Leaderboard** (global/org) drives friendly competition.
- **Skill Passport** provides a portable, shareable record of acquired skills and badges — connecting learning to demonstrable career growth (Problem 6).
- Points awarded on module completion, quiz success, and streaks.

---

## 8. Community & Mentorship Solution

- **Community** turns solitary learning into social learning (Q&A, sharing wins).
- **Mentorship** adds live, human guidance — including **retired-employee insights** as async wisdom and **live sessions** for real-time help.
- Together they address motivation, unclear direction (Problem 5), and career relevance (Problem 6).

---

## 9. Two Operating Modes Solution

### 9.1 User-centric
An individual creates a profile, completes onboarding, and receives a personal journey. Ideal for self-driven professionals.

### 9.2 Company-collaborated (L&D)
An organization onboards employees, curates/assigns journeys, and views analytics. Solves the L&D department's core pain: delivering **relevant, role-aware** learning at scale instead of generic content.

Both share one engine; company mode adds **org scope** + **admin analytics**.

---

## 10. Onboarding Flow Solution

```
Landing (Home/About/Why/Blogs/FAQ/Contact)
        │  click "Login / Create Profile"
        ▼
Email authentication
        │  first login?
        ├── yes ──▶ Onboarding questionnaire
        │              (personal · professional · preferences · career)
        │                     │ submit
        │                     ▼
        │              Personalization engine runs
        │                     │
        └── no ─────────────► Personalized Dashboard
```

Onboarding is the data source for **all** personalization — so it is required before the dashboard unlocks.

---

## 11. Responsiveness & Accessibility Solution

- **Mobile-first** Tailwind layouts; the roadmap collapses to a vertical stepper on small screens.
- Semantic HTML, keyboard navigation, adequate contrast.
- Works across job profiles and devices — a core non-functional requirement.

---

## 12. Security & Secrets Solution

- **Email authentication** with server-verified sessions; onboarding gate on protected routes.
- **Tier + role** checks in route handlers.
- **Secrets** read only via `process.env.KEY_NAME` in server code; external APIs (YouTube, email, video) proxied through `src/app/api/**`. Only `NEXT_PUBLIC_*` reaches the client.

---

## 13. Data Persistence Solution

- **PostgreSQL via Drizzle ORM**; schema in `src/db/schema.ts`, client from `@/db`.
- Progress (`module_progress`) is the single source of truth for roadmap gating.
- Learning notes, quiz attempts, passport entries, and points are all persisted to keep the career-linked history intact.

---

## 14. Roadmap for Future Enhancements

1. **ML-based level classification & gap prediction** replacing heuristics.
2. **Adaptive difficulty** based on quiz performance.
3. **Auto-summarized learning notes** from module content.
4. **Richer YouTube ranking** (freshness, engagement, relevance scoring).
5. **Deeper L&D analytics** (skill-gap heatmaps across teams).
6. **Certifications & verified Skill Passport** issuance.
7. **More granular levels** beyond beginner/intermediate/advanced.

---

## 15. Summary

Mentora replaces generic, topic-first learning with a **person-first, context-aware, goal-linked** ecosystem. By combining a personalization engine, level-gated roadmaps, three complementary content formats, gamification, community, and mentorship — delivered through both user-centric and company-collaborated modes — it directly resolves the six core problems and connects every learning action back to the employee's career.
