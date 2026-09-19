# Mentora — Adaptive AI Career Counseling & Learning Operating System

> **Bridge the gap from where you are to where you want to be.**  
> Mentora is a personalized career acceleration platform powered by Google Gemini AI, Firebase, and Next.js. It transforms raw LinkedIn profiles and resumes into actionable, 3-tier level-gated learning roadmaps with cryptographically verifiable skill credentials.

---

## 🌟 Core Architecture & User Flow

```
┌─────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│  1. Registration│  ───> │  2. AI Onboarding Flow │  ───> │  3. Dynamic Dashboard  │
│    (/register)  │       │     (/onboarding)      │       │      (/dashboard)      │
└─────────────────┘       └────────────────────────┘       └────────────────────────┘
  • Email / Google Auth     • LinkedIn Details & CV Upload   • Gemini Career Blueprint
  • Immediate Redirect      • Gemini 3 Flash Preview API     • Tier Badge & Readiness
                            • Real-time Skill Gap Engine     • 3-4 Actionable Courses
```

### 1. Intelligent Onboarding & Diagnostic Engine (`/onboarding`)
- **Profile Ingestion**: Paste LinkedIn experience or upload a CV/resume (PDF, TXT, MD, DOCX).
- **Goal Alignment**: Select or specify target field of interest and declared future role (e.g., *AI Engineer*, *Senior AI Systems Architect*).
- **Gemini AI Counselor**: Sequential evaluation analyzes possessed skills, determines difficulty tier (*Beginner*, *Intermediate*, *Advanced*), identifies prerequisite gaps, and recommends exactly 3–4 high-impact course paths.

### 2. Dynamic Career Blueprint & Dashboard (`/dashboard`)
- **Readiness Tier Badge**: Highlights current baseline with clear AI justification.
- **Interactive Prerequisite Gaps**: Visualizes missing skills with urgency indicators (*High*, *Medium*, *Foundational*) and impact analysis.
- **Actionable Course Recommendations**: Interactive cards with match scores, key topics, expected outcomes, and one-click pathway enrollment.

### 3. Level-Gated Learning Journeys & Quizzes
- **3-Tier Roadmaps**: Progressive gating across Foundations (Level 1), Core Application (Level 2), and System Architecture (Level 3).
- **Strict 70% Mastery Standard**: Scenario-based quizzes gate module progression to guarantee practical competence.
- **Verified Skill Passport & Leaderboard**: Earn XP, build streaks, and generate verifiable proof-of-work credentials for hiring managers.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Retro-Dense Grid System, Glassmorphic Amber/Orange Theme |
| **Authentication** | Firebase Authentication (Email/Password & Google OAuth) with server session cookies |
| **Database** | Firebase Cloud Firestore (NoSQL, Realtime) |
| **Storage** | Firebase Cloud Storage |
| **AI / LLM** | Google Gemini 3 Flash Preview via `@google/genai` with fallback resilience |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ installed
- A Firebase project with Auth and Firestore enabled
- (Optional) Google Gemini API Key from Google AI Studio

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Firebase Client Configuration (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Firebase Admin Configuration (Server Only - Never Expose to Client)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Gemini AI Configuration
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Installation & Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production build validation
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Firebase Rules

- **Client vs Server Isolation**: Private Firebase Admin credentials are kept strictly server-side (`src/utils/firebase/admin.ts`). Only public client credentials (`NEXT_PUBLIC_FIREBASE_*`) are accessed in the browser.
- **Cloud Firestore Security Rules**: Defined in `firestore.rules` with strict ownership checks (`isOwner(userId)`), authenticated read/write access for user-specific data, and admin-only gates for curated course content.
- **Cloud Storage Security Rules**: Defined in `storage.rules` ensuring authenticated asset uploads.

---

## 📁 Project Structure

```
mentora/
├── firestore.rules           # Cloud Firestore Security Rules
├── storage.rules             # Cloud Storage Security Rules
├── firebase.json             # Firebase deployment configuration
├── src/
│   ├── app/
│   │   ├── (public)/         # Public routes (Landing Page, Login, Register, About, FAQs)
│   │   ├── onboarding/       # AI-Powered CV & LinkedIn Diagnostic Wizard
│   │   ├── dashboard/        # Dynamic Dashboard & Gemini Career Blueprint
│   │   └── api/
│   │       ├── analyze-profile/ # Gemini API Profile Analysis Route
│   │       ├── auth/         # Session & Registration Handlers
│   │       └── quizzes/      # Quiz Evaluation & XP Progression
│   ├── components/           # Reusable UI components & Dashboard panels
│   ├── context/              # ThemeContext (Dark & Bright Mode)
│   └── utils/
│       └── firebase/         # Client & Admin Firebase SDK wrappers
└── public/                   # Static assets, branding, and logos
```

---

## 📄 License

Proprietary © 2026 Mentora Studio. All rights reserved.
