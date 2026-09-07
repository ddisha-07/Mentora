# Mentora — Project Rules & Architecture Guidelines

## 1. Technology Stack
- **Framework:** Next.js (App Router) + React (Server & Client Components)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL
- **API Handlers:** Next.js Route Handlers (`src/app/api/**`)
- **Authentication:** Email-based session / JWT

---

## 2. Directory Structure Conventions
Every component, route, and domain service must conform to the following target structure:

```
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # Home / Landing
│   │   ├── about/page.tsx          # About Mentora
│   │   ├── why-mentora/page.tsx    # Value Proposition
│   │   ├── blogs/page.tsx          # Blog list & [slug]
│   │   ├── faqs/page.tsx           # FAQs
│   │   └── contact/page.tsx        # Contact Form
│   ├── onboarding/
│   │   └── page.tsx                # Multi-step questionnaire UI
│   ├── dashboard/
│   │   ├── page.tsx                # Learner overview
│   │   ├── journeys/               # Learning roadmaps & level-gating
│   │   ├── community/              # Forums & discussions
│   │   ├── quizzes/                # Assessments & results
│   │   ├── leaderboard/            # Gamification points
│   │   ├── passport/               # Skill Passport
│   │   └── mentorship/             # 1:1 sessions & booking
│   ├── api/
│   │   ├── health/route.ts         # GET /api/health -> { status: 'ok' }
│   │   ├── auth/                   # Registration, login, session
│   │   ├── profile/                # User profile & preferences
│   │   ├── onboarding/             # Questions & submission
│   │   ├── journeys/               # Roadmaps & module progress
│   │   ├── modules/                # Module detail, flashcards, video, insights
│   │   ├── quizzes/                # Quizzes & attempts
│   │   ├── community/              # Posts & comments
│   │   ├── leaderboard/            # Scores & rankings
│   │   ├── passport/               # Skill passport entries
│   │   ├── mentorship/             # Sessions & bookings
│   │   ├── videos/                 # Video proxy
│   │   ├── blogs/                  # Public blog endpoints
│   │   ├── faqs/                   # Public FAQ endpoints
│   │   └── contact/                # Contact form submissions
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global Tailwind styles
├── db/
│   ├── index.ts                    # Drizzle DB client & connection pool
│   └── schema.ts                   # Drizzle PostgreSQL schema definitions
├── lib/
│   ├── personalization/            # Level Classifier, Skill-Gap Predictor, Journey Builder
│   ├── entitlements.ts             # Tier / feature access control (Free, Plus, Pro)
│   └── content/                    # Content aggregator & YouTube client
└── components/                     # Shared reusable UI components
```

---

## 3. Environment Variables & Secrets Policy
- **Server-Side Secrets:** Sensitive variables (e.g. `DATABASE_URL`, auth tokens, API keys) must be read via `process.env.VAR_NAME` strictly on the server side (Route Handlers, Server Components, or `src/lib/**`).
- **Client Variables:** Only variables prefixed with `NEXT_PUBLIC_` may be exposed to the browser.
- **Database Connection:** Always configure database connections via `process.env.DATABASE_URL`.

---

## 4. Coding & Architectural Principles
1. **Layered Separation:**
   - **Data Access Layer:** All database operations through Drizzle ORM in `src/db/`.
   - **Service / Domain Layer:** Business logic in `src/lib/` (e.g. personalization algorithms, entitlements, content aggregation).
   - **API Layer:** Lightweight route handlers under `src/app/api/**` that validate requests, delegate to services, and return standard JSON.
   - **Presentation Layer:** Responsive, accessible React components using Tailwind CSS.
2. **Type Safety:** Strict TypeScript types for all database models, API payloads, and component props.
3. **No Dead Routes:** Every route directory must contain valid page/route files.
