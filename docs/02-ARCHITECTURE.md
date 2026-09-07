# Mentora — System Architecture

This document describes the technical architecture of Mentora: the stack, layered design, data model, personalization engine, and integration points.

---

## 1. Technology Stack

| Layer | Technology |
| --- | --- |
| **Frontend / Framework** | Next.js (App Router) + React (Server & Client Components) |
| **Styling** | Tailwind CSS |
| **Language** | TypeScript |
| **API** | Next.js Route Handlers (`src/app/api/**`) |
| **ORM** | Drizzle ORM |
| **Database** | PostgreSQL |
| **Auth** | Email-based authentication (session/JWT) |
| **External content** | YouTube (open-source video content) |
| **Media / Live** | Recorded sessions + live mentorship (video provider) |

---

## 2. High-Level Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│  Responsive UI — any device                                     │
│  ┌──────────────┐   ┌───────────────┐   ┌───────────────────┐  │
│  │ Public Site  │   │  Onboarding    │   │  Authenticated    │  │
│  │ Home/About/  │   │  Questionnaire │   │  Dashboard, Journey│ │
│  │ Why/Blogs/   │   │                │   │  Community, Quiz,  │  │
│  │ FAQ/Contact  │   │                │   │  Passport, Leader. │  │
│  └──────────────┘   └───────────────┘   └───────────────────┘  │
└───────────────────────────────┬───────────────────────────────┘
                                 │  HTTPS (fetch / server actions)
┌───────────────────────────────▼───────────────────────────────┐
│                    NEXT.JS APP (Server)                         │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Route Handlers  (src/app/api/**)                        │  │
│  │  auth · profile · onboarding · journeys · modules ·      │  │
│  │  quizzes · community · leaderboard · passport ·          │  │
│  │  mentorship · videos · blogs · faqs · contact           │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Service / Domain Layer                                  │  │
│  │  • Personalization Engine (skill-gap + roadmap)         │  │
│  │  • Tier / Entitlement Service                           │  │
│  │  • Content Aggregator (flashcards, YT, insights)        │  │
│  │  • Progress & Gating Service                            │  │
│  └─────────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Data Access Layer — Drizzle ORM (@/db)                  │  │
│  └─────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬───────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                         ▼
┌───────────────┐      ┌──────────────────┐     ┌───────────────────┐
│  PostgreSQL    │      │  YouTube Data     │     │  Live/Recorded     │
│  (Drizzle)     │      │  (video content)  │     │  session provider  │
└───────────────┘      └──────────────────┘     └───────────────────┘
```

---

## 3. Application Layers

### 3.1 Presentation Layer
- **Public pages** (SSG/SSR): Home, About, Why Mentora, Blogs, FAQs, Contact.
- **Onboarding**: multi-step questionnaire (Client Components with server persistence).
- **Dashboard & features**: Server Components for data-heavy views, Client Components for interactivity (quizzes, flashcard flips, roadmap navigation).

### 3.2 API Layer (Route Handlers)
Thin controllers under `src/app/api/**` that validate input, enforce auth + tier entitlements, delegate to services, and return JSON.

### 3.3 Service / Domain Layer
Business logic isolated from transport and persistence:
- **Personalization Engine**
- **Tier / Entitlement Service**
- **Content Aggregator**
- **Progress & Gating Service**

### 3.4 Data Access Layer
Drizzle ORM. All DB access flows through typed queries importing the `db` client from `@/db`. Schema lives in `src/db/schema.ts`.

---

## 4. Personalization Engine

The engine converts an employee profile into a **level-gated learning journey**.

```
Profile inputs
  (role, industry, experience, skills[], interests[], goals[])
        │
        ▼
┌──────────────────────────┐
│  1. Level Classifier      │  → beginner | intermediate | advanced
│     (experience + skills) │
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  2. Skill-Gap Predictor   │  gap = desired_skills − current_skills
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  3. Journey Builder       │  order modules into a roadmap,
│     (roadmap + gating)    │  add prerequisites (level gating)
└──────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│  4. Content Aggregator    │  per module attach:
│                           │   • flashcards
│                           │   • YouTube videos
│                           │   • retired-employee insights
│                           │   • recorded session (end of module)
└──────────────────────────┘
        │
        ▼
   Personalized Dashboard + Journey
```

**Level gating rule:** module *N+1* unlocks only when module *N* is completed (status = `completed`). Journey level `intermediate` unlocks after `beginner` is complete, and so on.

---

## 5. Operating Modes

| Mode | Description | Entry point |
| --- | --- | --- |
| **User-centric** | Individual signs up, completes onboarding, gets personal journey. | Public "Create Profile" |
| **Company-collaborated** | L&D admin onboards employees, assigns/curates journeys, views analytics. | Company workspace (org-scoped) |

Both modes share the same personalization engine; company mode adds an **organization** scope and **admin analytics**.

---

## 6. Content Formats (per skill)

```
Skill
 ├── Flashcards            (concise bites, spaced repetition)
 ├── YouTube videos        (fetched by topic/skill query)
 └── Retired-employee insights (curated practical wisdom)

Module
 └── End-of-module recorded session / lecture
Journey
 └── Live mentorship sessions (scheduled)
```

---

## 7. Data Model (Entities)

```
organizations
   └──< users >── profiles (1:1)
                     │
users ──< enrollments >── journeys ──< journey_modules >── modules
   │                                                          │
   │                                                    modules ──< flashcards
   │                                                    modules ──< videos
   │                                                    modules ──< insights
   │                                                    modules ── recorded_session
   │
users ──< module_progress >── modules
users ──< learning_notes >── modules      (user-generated "generate learnings")
users ──< quiz_attempts >── quizzes ──< quiz_questions
users ──< skill_passport_entries
users ──< leaderboard (points)
users ──< community_posts ──< community_comments
users ──< mentorship_bookings >── mentorship_sessions
users ── subscription (tier)

blogs, faqs, contact_messages   (public content)
```

### Key relationships
- **User ↔ Profile:** one-to-one; profile stores onboarding answers.
- **User ↔ Journey:** many-to-many via **enrollments** (with progress + active flag).
- **Journey ↔ Module:** ordered many-to-many via **journey_modules** (position, level, prerequisite).
- **Module content:** flashcards, videos, insights, recorded session.
- **Progress:** `module_progress` drives roadmap gating.
- **Gamification:** leaderboard points from quizzes, completions, streaks.

---

## 8. Authentication & Authorization

- **Authentication:** email-based. On first login, redirect to onboarding until a profile exists.
- **Session:** server-verified session cookie / token; protected route handlers reject unauthenticated requests.
- **Authorization:**
  - **Route-level:** authenticated vs. public.
  - **Tier-level:** entitlement service checks Free / Plus / Pro before serving gated features.
  - **Role-level:** learner vs. mentor vs. L&D admin vs. platform admin.

---

## 9. Directory Structure (target)

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # Home
│   │   ├── about/page.tsx
│   │   ├── why-mentora/page.tsx
│   │   ├── blogs/page.tsx
│   │   ├── faqs/page.tsx
│   │   └── contact/page.tsx
│   ├── onboarding/page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── journeys/…
│   │   ├── community/…
│   │   ├── quizzes/…
│   │   ├── leaderboard/…
│   │   ├── passport/…
│   │   └── mentorship/…
│   ├── api/
│   │   ├── health/route.ts
│   │   ├── auth/…
│   │   ├── profile/…
│   │   ├── onboarding/…
│   │   ├── journeys/…
│   │   ├── modules/…
│   │   ├── quizzes/…
│   │   ├── community/…
│   │   ├── leaderboard/…
│   │   ├── passport/…
│   │   ├── mentorship/…
│   │   ├── videos/…
│   │   ├── blogs/…
│   │   ├── faqs/…
│   │   └── contact/…
│   ├── layout.tsx
│   └── globals.css
├── db/
│   ├── index.ts                    # db client
│   └── schema.ts                   # Drizzle schema
├── lib/
│   ├── personalization/            # engine
│   ├── entitlements.ts             # tier logic
│   └── content/                    # aggregator, youtube client
└── components/                     # shared UI
```

---

## 10. External Integrations

| Integration | Purpose | Notes |
| --- | --- | --- |
| **YouTube** | Fetch relevant video lectures/explanations per skill | Open-source content; queried via server-side API route to keep any key server-side |
| **Video session provider** | Live mentorship + recorded lectures | Scheduling stored in DB; media hosted externally |
| **Email provider** | Auth codes / notifications | Secrets read from `process.env` only |

> **Secrets policy:** all API keys read via `process.env.KEY_NAME` inside server-side route handlers. Only `NEXT_PUBLIC_*` variables reach the browser. External calls are proxied through `src/app/api/**`.

---

## 11. Responsiveness & Performance

- **Mobile-first** Tailwind layouts; fluid grids for dashboard and roadmap.
- Server Components for initial data; client hydration only where interactive.
- Lazy-load heavy content (videos, insights) and paginate community/blogs.
- Cache public pages (blogs, FAQs) and personalization results where safe.
