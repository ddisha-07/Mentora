# Mentora — Technologies, Hardware, & Implementation Methodology

> **Document Reference:** `docs/05-TECHNOLOGIES-AND-METHODOLOGY.md`  
> **Target Audience:** Engineering Leads, Software Developers, Cloud Architects, DevOps Engineers, and L&D Project Stakeholders.  
> **Complementary Documents:** [`01-REQUIREMENTS.md`](file:///c:/Users/anshi/Mentora/Mentora/Mentora/docs/01-REQUIREMENTS.md), [`02-ARCHITECTURE.md`](file:///c:/Users/anshi/Mentora/Mentora/Mentora/docs/02-ARCHITECTURE.md), [`03-ENDPOINTS.md`](file:///c:/Users/anshi/Mentora/Mentora/Mentora/docs/03-ENDPOINTS.md), [`04-SOLUTIONS.md`](file:///c:/Users/anshi/Mentora/Mentora/Mentora/docs/04-SOLUTIONS.md), [`mentora-development-roadmap.md`](file:///c:/Users/anshi/Mentora/Mentora/Mentora/docs/mentora-development-roadmap.md).

---

## 1. Executive Summary

Mentora is an enterprise-grade, personalized learning ecosystem engineered for corporate Learning & Development (L&D) departments and working professionals. By shifting the paradigm from static **"Topic → Course"** to dynamic **"Person → Context → Skill Gap → Learning Journey"**, Mentora requires a robust, scalable, modern technological foundation and an agile, verifiable implementation methodology.

This document details:
1. **The Technology Stack** (Programming languages, frameworks, libraries, APIs, and cloud services).
2. **Hardware & Infrastructure Requirements** (Developer environments, cloud hosting/server specifications, and end-user client devices).
3. **Software Engineering Methodology** (Agile/Scrum principles, architectural standards, and design patterns).
4. **End-to-End Implementation Process** (Lifecycle phases, quality assurance, CI/CD deployment pipeline, and operational governance).

---

## 2. Technologies to be Used

```
┌────────────────────────────────────────────────────────────────────────┐
│                          MENTORA TECH STACK                            │
├──────────────────┬─────────────────────────────────────────────────────┤
│ Languages        │ TypeScript 5.x, JavaScript (ES2024), SQL, HTML5/CSS3│
│ Frontend Layer   │ Next.js 16 (App Router), React 19, Tailwind CSS v4  │
│ UI & Animation   │ Framer Motion, Lucide React, Glassmorphic Tokens    │
│ Backend / API    │ Next.js Server Route Handlers, Express 5.x          │
│ Database / Store │ Firebase Firestore, PostgreSQL (Drizzle ORM)        │
│ Cloud & Storage  │ Firebase Cloud Storage, Google Cloud Platform (GCP) │
│ Generative AI    │ Google GenAI SDK (@google/genai) — Gemini 2.0 / 2.5 │
│ Security & Auth  │ Jose, JSON Web Tokens (JWT), Bcrypt.js, RBAC Guard  │
│ Tooling & CI/CD  │ Node.js 20+ LTS, ESLint, TypeScript, Git, PostCSS   │
└──────────────────┴─────────────────────────────────────────────────────┘
```

### 2.1 Programming Languages

| Language | Version / Target | Role & Application in Mentora |
| --- | --- | --- |
| **TypeScript** | `v5.x` (Strict mode) | Primary application language across client UI, server Route Handlers, personalization logic, and type definitions. Guarantees end-to-end type safety. |
| **JavaScript** | `ECMAScript 2024 (ES15)` | Dynamic execution runtime in Node.js and browser environments; compilation target for client bundles. |
| **CSS3** | Modern Standards | Styling and responsive design via Tailwind CSS v4, custom utility classes, CSS variables, glassmorphism, and hardware-accelerated animations. |
| **HTML5** | Semantic HTML5 | Structured, accessible DOM rendering (`<main>`, `<header>`, `<nav>`, `<aside>`, `<section>`, `<article>`), meeting WCAG 2.1 AA accessibility. |
| **SQL** | PostgreSQL Dialect | Relational data querying, migration schemas, and index declarations managed via Drizzle ORM. |

---

### 2.2 Frontend Frameworks & Libraries

- **Next.js 16.3+ (App Router):**
  - Modern full-stack React framework utilizing Server Components (RSC) for instantaneous page loads, zero client-bundle overhead for data rendering, and Client Components (`"use client"`) for rich interactive widgets.
  - Nested layout hierarchy (`layout.tsx`, `template.tsx`, `loading.tsx`, `error.tsx`) providing seamless state persistence across sub-routes.
  - Streaming SSR with React Suspense boundaries for progressive content hydration.

- **React 19.2+:**
  - Powers user interfaces with concurrent rendering, actions, and optimistic UI transitions.
  - Context API for global state: `AdminLayoutContext`, `ThemeContext` (Dark / Bright Sand modes), `ToastContext`, and `XpContext`.

- **Tailwind CSS v4 & PostCSS:**
  - Modern engine leveraging native `@theme` directives, custom color tokens (`--color-ember-500`, `--color-ink-100`, etc.), dynamic media queries, and responsive grid layouts.
  - Dual-theme system supporting high-contrast Dark Mode and warm "Bright Desert Sand" Light Mode (`html.bright`).

- **Framer Motion (`v13.2+`):**
  - Hardware-accelerated animations, spring physics, layout animations (`layoutId="active-nav"`), and staggered entrance transitions for cards, modals, and journey roadmaps.

- **Lucide React (`v1.43+`):**
  - Consistent, lightweight, accessible SVG iconography throughout both the learner dashboard and the enterprise admin panel.

---

### 2.3 Backend, API & Data Access Layer

- **Next.js Server Route Handlers (`src/app/api/**`):**
  - RESTful HTTP micro-endpoints running in Node.js server runtimes.
  - Standardized JSON responses with HTTP status codes (`200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`).

- **Firebase Admin SDK (`v14.4+`) & Client SDK (`v12.19+`):**
  - Primary document persistence for flexible, real-time entities: User profiles, courses, module steps, community discussions, activity streams, and daily quests.
  - Native Firestore queries with indexing for rapid multi-filter operations.

- **Drizzle ORM & PostgreSQL:**
  - Relational mapping layer for strict relational models: enterprise organization hierarchies, role authorizations, financial tiers, and structured analytics.

- **Bcryptjs (`v3.0+`) & Jose / JWT (`v6.2+`):**
  - High-entropy cryptographic password hashing (salt rounds: 10).
  - Stateless, signed session verification and HTTP-only cookie validation.

---

### 2.4 Generative AI & Machine Learning Stack

- **Google GenAI SDK (`@google/genai v2.23+`):**
  - Native integration with Google Cloud's latest Gemini models (Gemini 2.0 Flash / Gemini 2.5).
- **Core AI Capabilities Implemented:**
  1. **AI Course Studio:** Automated curriculum generation, syllabus creation, and milestone breakdowns based on corporate prompts.
  2. **Interactive Dialogue Tutor:** In-lesson Socratic chatbot that reprompts, challenges misconceptions, and evaluates learner understanding.
  3. **Personalization & Skill-Gap Analysis:** Dynamic semantic analysis mapping employee profiles to missing prerequisites and optimal learning roadmaps.
  4. **Quiz & Flashcard Synthesizer:** Automatic extraction of knowledge checkpoints from long-form text or video transcripts.

---

### 2.5 Media & External Integrations

- **YouTube Data API v3 & Embedded Players:**
  - Curated open-access video learning modules embedded via responsive, distraction-free custom player containers.
- **Firebase Cloud Storage:**
  - Secure object storage for course media assets, downloadable resources, user avatars, and badge imagery with CDN edge caching.

---

## 3. Hardware & Infrastructure Requirements

```
┌────────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE TOPOLOGY                         │
│                                                                        │
│   DEVELOPER WORKSTATION      CLOUD HOSTING / EDGE         END-USER     │
│   ┌────────────────────┐    ┌─────────────────────┐   ┌────────────┐   │
│   │ Node 20 LTS        │    │ Vercel / GCP Run    │   │ Desktop    │   │
│   │ 16GB RAM, SSD      │───▶│ Next.js SSR Engine  │──▶│ Laptop     │   │
│   │ VS Code / IDE      │    │ Firebase Firestore  │   │ Tablet     │   │
│   └────────────────────┘    │ Google Cloud GenAI  │   │ Smartphone │   │
│                             └─────────────────────┘   └────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Developer Workstation Specifications

To ensure fast local compilation, HMR (Hot Module Replacement), and multi-service emulation:

| Specification Component | Minimum Requirement | Recommended Specification |
| --- | --- | --- |
| **Processor (CPU)** | Quad-Core 2.4 GHz (Intel i5 10th Gen / AMD Ryzen 5 / Apple M1) | 8-Core 3.2 GHz+ (Intel i7 12th+ Gen / AMD Ryzen 7 / Apple M2/M3 Pro) |
| **System Memory (RAM)** | 8 GB DDR4 / Unified | 16 GB – 32 GB DDR4/DDR5 / Unified Memory |
| **Local Storage** | 256 GB SSD (at least 20 GB free space) | 512 GB+ NVMe M.2 SSD (>1000 MB/s read/write) |
| **Operating System** | Windows 10/11 (64-bit), macOS 12+, or Ubuntu 22.04+ LTS | Windows 11 Pro 64-bit / macOS Sonoma / Linux |
| **Runtime & Tooling** | Node.js v20.x LTS, npm v10.x, Git v2.40+ | Node.js v20.x LTS, Git, VS Code with TypeScript & Tailwind extensions |
| **Network** | 25 Mbps broadband (for dependency installations & API calls) | 100+ Mbps high-speed fiber connection |

---

### 3.2 Server, Cloud Hosting & Compute Infrastructure

Mentora is architected for **serverless edge deployments** with horizontal elasticity.

| Infrastructure Layer | Service / Provider | Sizing / Configuration | Scaling Policy |
| --- | --- | --- | --- |
| **Web & API Host** | Vercel / Google Cloud Run | Node.js 20 Container / Serverless Functions (1024 MB RAM, 1 vCPU per instance) | Autoscaling from 0 to 1,000+ concurrent instances based on traffic spikes |
| **Database** | Firebase Firestore / Cloud SQL (PostgreSQL) | Managed multi-region replication; Automatic backup snapshots | Automatic horizontal sharding; connection pooling (pgBouncer for PostgreSQL) |
| **Object Storage** | Firebase Cloud Storage (GCS) | Standard storage class with multi-region redundancy; CDN caching enabled | Elastic storage (Petabyte scale) |
| **AI Inference** | Google Vertex AI / Google AI Studio API | Gemini 2.0 Flash / Pro endpoints with dedicated quota allocations | Multi-region load-balanced API routing with client-side exponential backoff |
| **DNS & Edge CDN** | Cloudflare / Vercel Edge Network | Edge caching for static assets (`_next/static/**`, `/images/**`), SSL/TLS 1.3 termination | Global Anycast network with DDoS mitigation |

---

### 3.3 End-User Client Device Requirements

Mentora is a 100% responsive, web-based platform accessible across corporate workstations and personal mobile devices:

| Device Category | Supported Devices | Minimum Hardware Specs | Recommended Display & Network |
| --- | --- | --- | --- |
| **Desktop / Laptop** | Windows PC, Mac, Chromebook, Linux | Dual-Core CPU, 4 GB RAM, 1024×768 resolution | 1920×1080 (Full HD), 8 GB RAM, hardware acceleration enabled |
| **Tablet** | iPad (Air, Pro, Mini), Android Tablets | 2 GB RAM, 64-bit ARM CPU, 9.7" screen | 10.5"+ Retina / OLED, landscape & portrait support |
| **Smartphone** | iPhone (iOS 15+), Android (v10.0+) | 2 GB RAM, Quad-Core processor, 5.5" screen | 4G/5G mobile data or Wi-Fi, touch-responsive viewport |
| **Supported Browsers** | Chrome 110+, Edge 110+, Safari 16+, Firefox 115+ | HTML5, CSS Grid, ES6 module support | Latest evergreen versions with JavaScript enabled |
| **Network Bandwidth** | Minimum: 1.5 Mbps (text/quizzes) | Recommended: 10+ Mbps (HD video streaming & real-time dialogue chat) | Latency: <150ms to nearest edge node |

---

## 4. Software Development Methodology

Mentora is engineered using an **Agile Scrum Methodology** infused with modern DevOps and Test-Driven iteration cycles.

```
       ┌────────────────────────────────────────────────────────┐
       │                 AGILE SCRUM LIFECYCLE                  │
       │                                                        │
       │   [Sprint Planning] ──▶ [Daily Standup & Pair Dev]     │
       │           ▲                                │           │
       │           │                                ▼           │
       │   [Retrospective]   ◀── [Sprint Demo & QA Review]      │
       └────────────────────────────────────────────────────────┘
```

### 4.1 Agile Scrum Framework

1. **Sprint Cycles:**
   - Two-week iteration sprints focusing on discrete, shippable increments.
   - Sprints are planned from prioritized user stories with defined **Acceptance Criteria (AC)** and **Definitions of Done (DoD)**.
2. **Scrum Ceremonies:**
   - **Sprint Planning (Day 1):** Team commits to story points and tasks.
   - **Daily Sync (15 min):** Blockers, yesterday's achievements, and today's objectives.
   - **Sprint Review & Demo (Final Day):** Live functional demo of implemented features.
   - **Sprint Retrospective (Final Day):** Engineering process improvement review.
3. **Issue Tracking & User Stories:**
   - Jira / GitHub Projects using standard format:  
     `As a [Role], I want to [Capability], so that [Business Benefit].`

---

### 4.2 Architectural Design Principles

Mentora adheres strictly to industry standard software patterns:

1. **Domain-Driven Modularization:**
   - Code is isolated by functional domain: `admin/`, `auth/`, `courses/`, `dashboard/`, `gamification/`, `mentorship/`, and `personalization/`.
2. **Separation of Concerns (SoC):**
   - **Presentation Layer:** Pure React client components handling rendering and user interaction.
   - **State Layer:** React Contexts and hooks (`useTheme`, `useAdminLayout`, `useXp`).
   - **Domain / Service Layer:** Business logic functions located in `src/lib/` (e.g., skill gap calculation, heuristic classification).
   - **Data Access Layer:** Direct database abstractions isolated in `src/lib/firebase/` or `src/db/`.
3. **API-First & Contract-Driven:**
   - All backend communication follows the specifications laid out in [`03-ENDPOINTS.md`](file:///c:/Users/anshi/Mentora/Mentora/Mentora/docs/03-ENDPOINTS.md).
4. **Resilience & Defensive Engineering:**
   - Strict input validation on all Route Handlers.
   - Graceful degradation: Fallback UI states, empty states (`EmptyState.tsx`), error boundaries, and skeleton loaders.

---

## 5. End-to-End Implementation Process

The implementation lifecycle is broken down into structured, verifiable phases:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                     IMPLEMENTATION PROCESS LIFECYCLE                         │
│                                                                              │
│  PHASE 0 ──▶ PHASE 1 ──▶ PHASE 2 ──▶ PHASE 3 ──▶ PHASE 4 ──▶ PHASE 5 ──▶ ...  │
│  Setup &     Auth &      Public      Onboard &   Learner     Quizzes &       │
│  Tooling     Schema      Portal      Personal.   Dashboard   Passport        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Phase 0: Project Foundation & Environment Baseline
- Initialize Next.js 16 App Router repository with TypeScript strict mode and Tailwind CSS v4.
- Configure ESLint, Prettier, PostCSS, and Git branching rules (`main`, `develop`, `feature/*`).
- Establish directory taxonomy (`src/app/`, `src/components/`, `src/context/`, `src/lib/`, `src/types/`).
- Set up environment variables (`.env.local`, `.env.production`) and secure Firebase configuration.
- Implement and verify base probe endpoint: `GET /api/health`.

### Phase 1: Authentication, Data Schema & Role Security
- Implement data models in Firebase Firestore and PostgreSQL Drizzle schemas.
- Build email-based registration, password hashing via `bcryptjs`, and stateless JWT session generation (`jose`).
- Create authentication middleware protecting `/admin/**` and `/dashboard/**` routes.
- Build role-based access control (RBAC) ensuring Learner, Mentor, and L&D Admin permission barriers.

### Phase 2: Public Presentation & Brand Portal
- Construct responsive marketing pages: Landing/Home, About, Why Mentora, Blogs showcase, FAQs, and Contact.
- Deploy dynamic theme switching system (Dark Mode vs. Bright Warm Sand Mode).
- Wire public contact submission endpoint `POST /api/contact` to persistent datastore.

### Phase 3: Onboarding & Personalization Engine
- Construct multi-step interactive onboarding questionnaire gathering:
  - Professional role, experience level, current competencies.
  - Learning format preferences, weekly time commitment.
  - Career aspirations and skill-gap targets.
- Develop the core heuristic pipeline in `src/lib/personalization/`:
  - **Level Classifier:** Calculates learner baseline (`Beginner`, `Intermediate`, `Advanced`).
  - **Skill-Gap Predictor:** Identifies missing competencies relative to target career milestones.
  - **Roadmap Generator:** Dynamically composes an ordered, prerequisite-gated learning journey.

### Phase 4: Learner Workspace & Content Delivery
- Build the learner dashboard with active journey tracking, progress bars, and upcoming deadlines.
- Construct the interactive module workspace:
  - Video lecture player with YouTube stream support.
  - Interactive flashcards with flip animations and recall marking.
  - Key takeaways, lesson summary notes, and downloadable cheat-sheets.
- Implement completion state tracking: `POST /api/modules/:id/complete`.

### Phase 5: Assessment Engine & Skill Passport
- Build modular quiz generator and evaluation engine (multiple choice, true/false, code analysis).
- Real-time scoring and instant feedback mechanism.
- Implement the **Skill Passport**: An immutable digital ledger recording validated competencies, earned badges, and milestone completion certificates.

### Phase 6: Community Engagement & Mentorship Scheduling
- Build peer discussion forum: Topics, thread creation, comment nesting, and upvoting.
- Develop 1-on-1 mentorship module: Mentor availability calendars, session booking, and calendar invites.
- Deploy gamification loop: Daily task streaks, XP point accumulation, and real-time competitive leaderboards.

### Phase 7: AI Course Studio & L&D Enterprise Admin Portal
- Develop the comprehensive L&D Admin Suite:
  - Metrics overview: Total active users, enrollment stats, course completion rates.
  - User management: Role assignment, access revocation, individual progress auditing.
  - AI Course Studio: Instantaneous course generation from corporate skill briefs using Gemini AI.
  - Dialogue chat tutor configuration and blog publication manager.

### Phase 8: Quality Assurance, Performance Hardening & Launch
- Execute end-to-end integration tests, load tests, and security penetration audits.
- Core Web Vitals optimization: Sub-second First Contentful Paint (FCP), 95+ Lighthouse performance scores.
- Zero-downtime production deployment with continuous telemetry logging.

---

## 6. Quality Assurance & Testing Strategy

```
               ┌───────────────────────┐
               │    E2E & UI Tests     │  ◄── Cypress / Playwright
               ├───────────────────────┤
               │   Integration Tests   │  ◄── Next.js Route Handlers & DB
               ├───────────────────────┤
               │   Unit & Logic Tests  │  ◄── Personalization & Helpers
               └───────────────────────┘
```

| Testing Tier | Scope & Focus Areas | Tools & Execution |
| --- | --- | --- |
| **Unit Testing** | Personalization heuristics, level classification math, XP award logic, date formatting, and utility functions. | Node.js Test Runner / Vitest / Tsx test scripts |
| **Integration Testing** | Next.js Route Handlers (`src/app/api/**`), Firestore transactions, JWT token verification, and error handlers. | API Route test harnesses with mock database fixtures |
| **Static Code Analysis** | TypeScript type checking without compilation (`tsc --noEmit`), ESLint standard compliance, and unused imports. | Automated pre-commit hooks and CI pipelines |
| **Cross-Browser & UI** | Responsive layout validation across mobile (375px), tablet (768px), and desktop (1440px) viewports in Chrome, Safari, and Firefox. | Headless browser audits and manual visual regression checks |
| **Performance Benchmarks** | Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1), bundle size budgets, and lazy loading validation. | Google Lighthouse CI, Chrome DevTools Performance Profiler |

---

## 7. DevOps, CI/CD Pipeline & Deployment Process

```
┌──────────┐     ┌───────────────┐     ┌────────────────┐     ┌────────────┐
│ Developer│     │ GitHub Pull   │     │ CI Validation: │     │ Production │
│ Push     │────▶│ Request       │────▶│ Lint, Typecheck│────▶│ Deployment │
│ (Git)    │     │ (Code Review) │     │ Build & Test   │     │ (Vercel)   │
└──────────┘     └───────────────┘     └────────────────┘     └────────────┘
```

1. **Version Control & Branching Strategy:**
   - `main`: Production-ready code; protected branch requiring passing checks.
   - `develop`: Staging environment containing accepted sprint features.
   - `feature/<name>`: Isolated developer branches for individual user stories.
2. **Automated CI Workflow (GitHub Actions):**
   - On every pull request:
     1. Dependency caching and clean install (`npm ci`).
     2. TypeScript strict validation (`npx tsc --noEmit`).
     3. ESLint static analysis (`npm run lint`).
     4. Build artifact generation (`npm run build`).
3. **Continuous Deployment (CD):**
   - PR preview environments generated automatically for design and functional sign-off.
   - Merge to `main` triggers automated atomic production build and zero-downtime edge rollout.
4. **Environment Secret Management:**
   - Production API credentials, database keys, and Gemini AI tokens stored securely in encrypted platform environment vaults (never committed to repository).

---

## 8. Operational Governance & Maintenance

- **Health & Uptime Monitoring:**
  - Automated continuous polling of `GET /api/health` probes.
  - Alert dispatching on latency spikes (>1000ms) or 5xx status codes.
- **Security & Vulnerability Audits:**
  - Regular dependency audits via `npm audit` to mitigate CVE vulnerabilities.
  - Strict Content Security Policies (CSP) and CORS configuration preventing cross-site scripting.
- **Continuous AI & Learning Refinement:**
  - Periodic review of generated AI curriculums against real-world industry certifications.
  - Learner feedback telemetry utilized to tune the recommendation engine weights.

---

*Mentora Engineering & Documentation Team — Confidential & Proprietary*
