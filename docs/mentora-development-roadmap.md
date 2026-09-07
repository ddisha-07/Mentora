# Mentora — Development Roadmap

A phase-by-phase build plan derived from `01-REQUIREMENTS.md`, `02-ARCHITECTURE.md`, `03-ENDPOINTS.md`, and `04-SOLUTIONS.md`. Ordered so every phase only depends on what's already built — schema and auth first, personalization engine before content, content before gamification/community, admin/org last, polish throughout.

**Stack:** Next.js (App Router) + TypeScript + Tailwind · Drizzle ORM + PostgreSQL · Route Handlers under `src/app/api/**` · email auth.

---

## Phase 0 — Project Setup (≈3–5 days)

**Goal:** empty but correctly-shaped repo, deployable from day one.

- Initialize Next.js (App Router, TS, Tailwind, ESLint/Prettier).
- Set up the target directory structure from `02-ARCHITECTURE.md §9` (`(public)/`, `onboarding/`, `dashboard/`, `api/`, `db/`, `lib/`, `components/`).
- Provision PostgreSQL (local + hosted, e.g. Neon/Supabase/RDS).
- Install & configure Drizzle ORM; `src/db/index.ts` client, `src/db/schema.ts` stub.
- `.env` conventions: server-only secrets via `process.env`, `NEXT_PUBLIC_*` only for client-safe values.
- `GET /api/health` route handler — first working endpoint, used for CI/deploy checks.
- CI pipeline (lint, typecheck, build) + hosting/deploy target.

**Exit criteria:** health check green in a deployed environment; schema file compiles with Drizzle Kit.

---

## Phase 1 — Data Model & Auth Foundation (≈1–1.5 weeks)

**Goal:** every entity from `02-ARCHITECTURE.md §7` exists in the DB; users can register, verify, log in, and hold a session.

1. **Schema (Drizzle):** `organizations`, `users`, `profiles`, `subscriptions`, `enrollments`, `journeys`, `journey_modules`, `modules`, `flashcards`, `videos`, `insights`, `recorded_sessions`, `module_progress`, `learning_notes`, `quizzes`, `quiz_questions`, `quiz_attempts`, `skill_passport_entries`, `leaderboard_points`, `community_posts`, `community_comments`, `mentorship_sessions`, `mentorship_bookings`, `blogs`, `faqs`, `contact_messages`.
2. **Auth:** email-based registration/verification/login, server-verified session (cookie or JWT).
   - `POST /api/auth/register`, `POST /api/auth/verify`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session`
3. **Session/route middleware:** distinguishes public vs. authenticated routes; rejects unauthenticated requests on protected handlers.
4. **Roles:** learner / mentor / L&D admin / platform admin — modeled on `users` (or a join table) even if only "learner" is exercised this phase.

**Exit criteria:** a new user can register → verify → log in → `GET /api/auth/session` returns `{ onboardingComplete: false }`.

---

## Phase 2 — Public Site (≈3–5 days, parallelizable with Phase 1)

**Goal:** the unauthenticated marketing shell — mostly static, can be built alongside auth.

- Pages: Home, About, Why Mentora, Blogs (list + `[slug]`), FAQs, Contact.
- `GET /api/blogs`, `GET /api/blogs/:slug`, `GET /api/faqs`, `POST /api/contact`.
- "Login / Create Profile" entry point wired to auth flow.
- Mobile-first responsive layout baseline (this is the first UI, so it sets the design system used everywhere else).

**Exit criteria:** all public pages render on mobile/tablet/desktop; contact form persists a `contact_messages` row.

---

## Phase 3 — Onboarding & the Personalization Engine (≈2 weeks)

**Goal:** the core differentiator. Without this, nothing downstream (journeys, dashboard, content) has anything to render.

1. **Onboarding questionnaire UI** (multi-step, client component + server persistence) covering personal / professional / preferences / career, per `01-REQUIREMENTS.md §3.1`.
   - `GET /api/onboarding/questions`, `POST /api/onboarding`
2. **`lib/personalization/` engine**, built as the 4-stage pipeline in `02-ARCHITECTURE.md §4`:
   - **Level Classifier** — heuristic from `04-SOLUTIONS.md §2.2` (experience + skill overlap → beginner/intermediate/advanced).
   - **Skill-Gap Predictor** — `desired_skills ∪ role_target_skills − current_skills`, ranked by goal relevance + prerequisite order.
   - **Journey Builder** — maps ranked gaps to a catalog of modules, orders by prerequisite, groups into levels (produces the level-gated roadmap structure).
   - **Content Aggregator hook** — stub for now; wired fully in Phase 4.
3. A **module/skill catalog** seed (enough real content to prove two different roles produce two different journeys — recreate the Software Developer vs. Product Manager examples from the requirements doc as a smoke test).
4. `GET /api/profile`, `PUT /api/profile`.
5. `GET /api/personalization/skill-gaps`, `POST /api/personalization/regenerate` (tier-gated stub, enforced fully in Phase 7).

**Exit criteria:** submitting onboarding answers for the two worked examples in the spec produces two visibly different generated journeys.

---

## Phase 4 — Journeys, Modules & Content Formats (≈2 weeks)

**Goal:** the roadmap is explorable and level-gating actually works.

1. **Journeys & roadmap:**
   - `GET /api/journeys`, `POST /api/journeys`, `GET /api/journeys/:id`, `GET /api/journeys/:id/roadmap`, `DELETE /api/journeys/:id`
   - Roadmap UI: locked/unlocked levels, module status chips (`locked | available | in_progress | completed`).
2. **Progress & Gating Service** (`module_progress` as source of truth):
   - `POST /api/modules/:id/complete` → transitions status, unlocks successors, awards points (leaderboard hook, fleshed out in Phase 5).
3. **Module detail + three content forms** (`01-REQUIREMENTS.md §6`):
   - `GET /api/modules/:id`, `/flashcards`, `/videos`, `/insights` (tier-gated), `/session` (tier-gated).
4. **YouTube proxy integration** (`04-SOLUTIONS.md §5`):
   - `GET /api/videos/search?q=` — server-side only, key in `process.env`, query built from `module.skill + journey.domain + level`, response normalized to `{videoId,title,channel,thumbnail,url}`.
5. **"Generate my learnings" notes:**
   - `GET/POST /api/modules/:id/notes`, `PUT /api/notes/:noteId`.

**Exit criteria:** a user can walk a full journey end-to-end — view roadmap, open a module, watch a suggested video, flip flashcards, complete the module, watch the next level unlock, write a learning note.

---

## Phase 5 — Gamification & Skill Passport (≈1–1.5 weeks)

**Goal:** turn completions into visible progress/motivation, and connect learning to a career artifact.

- **Quizzes:** `GET /api/quizzes`, `GET /api/quizzes/:id`, `POST /api/quizzes/:id/attempt`, `GET /api/quizzes/:id/attempts`.
- **Leaderboard:** `GET /api/leaderboard` (`?scope=global|org&period=all|month|week`), `GET /api/leaderboard/me`. Points sourced from module completion + quiz success + streaks.
- **Skill Passport:** `GET /api/passport`, `POST /api/passport/entries`, `GET /api/passport/:userId/public`.

**Exit criteria:** completing a module and passing a quiz visibly moves the leaderboard rank and adds a passport entry.

---

## Phase 6 — Community & Mentorship (≈1.5 weeks)

**Goal:** social + human layer on top of the solo learning path.

- **Community:** `GET/POST /api/community/posts`, `GET /api/community/posts/:id`, `POST /api/community/posts/:id/comments`, `POST /api/community/posts/:id/like`. Free tier read-only enforced here (real enforcement lands in Phase 7).
- **Mentorship:** `GET /api/mentorship/sessions`, `GET /api/mentorship/sessions/:id`, `POST/DELETE /api/mentorship/sessions/:id/book`. Integrate chosen video/session provider for scheduling; media hosted externally per the architecture doc.

**Exit criteria:** a user can post/comment/like, and book + cancel a mentorship session with correct capacity/limit checks.

---

## Phase 7 — Tiering & Entitlements (≈1 week, cuts across everything above)

**Goal:** the Free/Plus/Pro matrix from `01-REQUIREMENTS.md §4` and `04-SOLUTIONS.md §6` is centrally and consistently enforced.

- Build the **Tier / Entitlement Service** (`lib/entitlements.ts`) as a single source of truth for feature limits (active journeys: 1/3/∞, insights, recorded sessions, community posting, mentorship access, org analytics).
- Retrofit tier checks (🏷️) into every route flagged tier-gated in `03-ENDPOINTS.md`: journeys creation, personalization regenerate, module insights/session, community post/comment, mentorship booking, org analytics.
- `GET /api/subscription`, `POST /api/subscription/upgrade`.
- UI: locked/upsell states for gated features per tier.

**Exit criteria:** a Free-tier account is provably blocked (403) from every Plus/Pro-only action; upgrading unlocks them immediately.

---

## Phase 8 — Company-Collaborated Mode (L&D Admin) (≈1.5 weeks)

**Goal:** the second operating mode from `01-REQUIREMENTS.md §5.4` — org-scoped onboarding, curation, and analytics.

- Extend schema/queries with `organization_id` scoping across users/journeys where relevant.
- `GET /api/org/employees`, `POST /api/org/employees/invite`, `POST /api/org/journeys/assign`, `GET /api/org/analytics` (Pro-gated).
- Admin-facing UI: employee roster + progress, journey assignment/curation, analytics dashboard.
- Role-level authorization (🛠️): platform/L&D admin only.

**Exit criteria:** an L&D admin can invite employees, assign a curated journey, and see aggregate progress/analytics — without ever touching another org's data.

---

## Phase 9 — Non-Functional Hardening & QA (≈1–2 weeks)

Cross-cutting work that should also be revisited at the end of every phase above, not just at the end:

- **Responsiveness/Accessibility:** mobile-first pass on roadmap (vertical stepper on small screens), semantic HTML, keyboard nav, contrast audit.
- **Performance:** Server Components for data-heavy views, lazy-loading for videos/insights, pagination on community/blogs, caching for public pages + personalization results.
- **Security:** confirm no secret ever reaches `NEXT_PUBLIC_*`; all external calls proxied server-side; session/route-guard audit; rate limiting (`429`) on auth and video-search endpoints.
- **Error contract:** consistent `{ error: { code, message } }` across all route handlers; verify 400/401/403/404/409/429/500 paths are actually reachable and tested.
- **Testing:** unit tests for the personalization engine (level classifier, gap predictor, journey builder are the highest-risk logic), integration tests for gating/entitlements, e2e smoke test of the full onboarding→journey→completion flow.

---

## Phase 10 — Launch Readiness

- Seed a real module/content catalog beyond the smoke-test set.
- Analytics/success-metric instrumentation from `01-REQUIREMENTS.md §10` (journey completion rate, skill-gap reduction, time-to-first-relevant-content, quiz pass rate, engagement).
- Staging → production deploy, monitoring/alerting on `/api/health` and error rates.
- Soft launch with one pilot org (exercises company-collaborated mode end-to-end) before general availability.

---

## Suggested Sequencing Summary

| Phase | Focus | Depends on |
|---|---|---|
| 0 | Project setup | — |
| 1 | Schema + Auth | 0 |
| 2 | Public site | 0 (parallel to 1) |
| 3 | Onboarding + Personalization Engine | 1 |
| 4 | Journeys, Modules, Content | 3 |
| 5 | Gamification + Passport | 4 |
| 6 | Community + Mentorship | 1 (parallel to 4/5) |
| 7 | Tiering enforcement | 4, 5, 6 |
| 8 | Company/L&D mode | 4, 7 |
| 9 | Hardening & QA | ongoing + all above |
| 10 | Launch | all above |

**Rough total:** ~13–16 weeks for a single small team building sequentially; Phases 2 and 6 can run in parallel tracks to compress the timeline.

**Riskiest/highest-value phase to prototype earliest:** Phase 3 (personalization engine) — it's the entire value proposition of Mentora and everything else is scaffolding around it. Consider spiking the level classifier + skill-gap predictor logic in isolation (even before full onboarding UI) to validate the two-different-journeys-from-one-interest promise early.
