# Mentora — API Endpoints Reference

All endpoints are implemented as **Next.js Route Handlers** under `src/app/api/**` and return JSON. Authenticated endpoints require a valid session; tier-gated endpoints additionally check the user's subscription (Free / Plus / Pro).

**Conventions**
- Base path: `/api`
- Auth: `🔒` = authenticated, `🏷️` = tier-gated, `🌐` = public, `🛠️` = admin/L&D
- Standard responses: `200/201` success, `400` validation, `401` unauthenticated, `403` forbidden/tier, `404` not found, `409` conflict, `500` server error.
- Errors: `{ "error": { "code": string, "message": string } }`

---

## 1. Health

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | 🌐 | Liveness/readiness probe. Returns `{ status: "ok" }`. |

---

## 2. Authentication

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | 🌐 | Start account creation with email. |
| POST | `/api/auth/verify` | 🌐 | Verify email code / token. |
| POST | `/api/auth/login` | 🌐 | Log in with email (code/password). |
| POST | `/api/auth/logout` | 🔒 | Invalidate session. |
| GET | `/api/auth/session` | 🔒 | Current session + whether onboarding is complete. |

**POST `/api/auth/register`**
```json
// request
{ "email": "jane@acme.com" }
// response 201
{ "userId": "u_123", "onboardingComplete": false, "verificationSent": true }
```

---

## 3. Profile & Onboarding

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/profile` | 🔒 | Get current user profile. |
| PUT | `/api/profile` | 🔒 | Update profile fields. |
| GET | `/api/onboarding/questions` | 🔒 | Get onboarding questionnaire. |
| POST | `/api/onboarding` | 🔒 | Submit answers → builds profile + triggers personalization. |

**POST `/api/onboarding`**
```json
// request
{
  "personal":   { "fullName": "Jane Doe", "location": "Pune" },
  "professional": {
    "jobRole": "Software Developer",
    "industry": "IT Services",
    "yearsOfExperience": 3,
    "background": "technical",
    "currentSkills": ["JavaScript", "REST APIs"]
  },
  "preferences": { "interests": ["Generative AI"], "preferredFormats": ["video","flashcards"] },
  "career":      { "goals": ["Build AI-powered applications"], "desiredSkills": ["RAG","AI Agents"] }
}
// response 201
{
  "profileId": "p_1",
  "detectedLevel": "intermediate",
  "skillGaps": ["Prompt Engineering","RAG","AI Agents"],
  "generatedJourneyId": "j_1"
}
```

---

## 4. Personalization

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/dashboard` | 🔒 | Personalized dashboard payload (progress, next steps, recommendations). |
| GET | `/api/personalization/skill-gaps` | 🔒 | Current skill-gap analysis. |
| POST | `/api/personalization/regenerate` | 🔒🏷️ | Re-run engine (e.g., after goal change). Plus/Pro. |

---

## 5. Journeys & Roadmap

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/journeys` | 🔒 | List user's journeys (active + available). |
| POST | `/api/journeys` | 🔒🏷️ | Create/enroll in a new journey (tier limits apply). |
| GET | `/api/journeys/:id` | 🔒 | Journey detail: ordered modules + gating status. |
| GET | `/api/journeys/:id/roadmap` | 🔒 | Roadmap view with locked/unlocked levels. |
| DELETE | `/api/journeys/:id` | 🔒 | Leave / archive a journey. |

**GET `/api/journeys/:id/roadmap` (excerpt)**
```json
{
  "journeyId": "j_1",
  "title": "Generative AI for Developers",
  "levels": [
    { "level": "beginner", "unlocked": true,  "modules": [ { "id":"m1","title":"GenAI Foundations","status":"completed" } ] },
    { "level": "intermediate", "unlocked": true, "modules": [ { "id":"m2","title":"LLMs & Prompt Engineering","status":"in_progress" } ] },
    { "level": "advanced", "unlocked": false, "modules": [ { "id":"m5","title":"AI Agents","status":"locked" } ] }
  ]
}
```

---

## 6. Modules & Content

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/modules/:id` | 🔒 | Module detail + attached content. |
| GET | `/api/modules/:id/flashcards` | 🔒 | Flashcards for the module. |
| GET | `/api/modules/:id/videos` | 🔒 | Related YouTube videos. |
| GET | `/api/modules/:id/insights` | 🔒🏷️ | Retired-employee insights (Plus/Pro). |
| GET | `/api/modules/:id/session` | 🔒🏷️ | End-of-module recorded session (Plus/Pro). |
| POST | `/api/modules/:id/complete` | 🔒 | Mark complete → unlocks next module/level. |

**POST `/api/modules/:id/complete`**
```json
// response 200
{ "moduleId": "m2", "status": "completed", "unlocked": ["m3"], "pointsAwarded": 50 }
```

---

## 7. Learning Notes ("Generate my learnings")

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/modules/:id/notes` | 🔒 | Get user's learning notes for a module. |
| POST | `/api/modules/:id/notes` | 🔒 | Create/generate learnings summary after a module/bite. |
| PUT | `/api/notes/:noteId` | 🔒 | Edit a learning note. |

---

## 8. Videos (YouTube proxy)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/videos/search?q=` | 🔒 | Server-side proxy to fetch relevant YouTube videos for a skill/topic. |

> Keeps any API key server-side (`process.env`). Returns normalized `{ videoId, title, channel, thumbnail, url }[]`.

---

## 9. Quizzes

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/quizzes` | 🔒 | List available quizzes (per module/journey). |
| GET | `/api/quizzes/:id` | 🔒 | Quiz with questions. |
| POST | `/api/quizzes/:id/attempt` | 🔒 | Submit answers → score + points. |
| GET | `/api/quizzes/:id/attempts` | 🔒 | User's past attempts. |

---

## 10. Skill Passport

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/passport` | 🔒 | User's skill passport (acquired skills, badges, level). |
| POST | `/api/passport/entries` | 🔒 | Add an achievement/skill entry (system or verified). |
| GET | `/api/passport/:userId/public` | 🌐 | Public shareable passport view. |

---

## 11. Leaderboard

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/leaderboard` | 🔒 | Ranked users by points (global or org-scoped). |
| GET | `/api/leaderboard/me` | 🔒 | Current user's rank + points. |

Query params: `?scope=global|org&period=all|month|week`.

---

## 12. Community

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/community/posts` | 🔒 | List posts (paginated). |
| POST | `/api/community/posts` | 🔒🏷️ | Create post (Free = read-only). |
| GET | `/api/community/posts/:id` | 🔒 | Post detail + comments. |
| POST | `/api/community/posts/:id/comments` | 🔒🏷️ | Add comment. |
| POST | `/api/community/posts/:id/like` | 🔒 | Toggle like. |

---

## 13. Mentorship

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/mentorship/sessions` | 🔒 | Upcoming live sessions. |
| GET | `/api/mentorship/sessions/:id` | 🔒 | Session detail. |
| POST | `/api/mentorship/sessions/:id/book` | 🔒🏷️ | Book a live session (Plus limited / Pro full). |
| DELETE | `/api/mentorship/sessions/:id/book` | 🔒 | Cancel booking. |

---

## 14. Subscription / Tiers

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/subscription` | 🔒 | Current tier + entitlements. |
| POST | `/api/subscription/upgrade` | 🔒 | Change tier (Free → Plus → Pro). |

---

## 15. Public Content

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/blogs` | 🌐 | List published blog posts. |
| GET | `/api/blogs/:slug` | 🌐 | Single blog post. |
| GET | `/api/faqs` | 🌐 | List FAQs. |
| POST | `/api/contact` | 🌐 | Submit "Contact Us" (quick links). |

**POST `/api/contact`**
```json
// request
{ "name": "Jane Doe", "email": "jane@acme.com", "message": "Interested in company plan." }
// response 201
{ "id": "c_1", "received": true }
```

---

## 16. Company / L&D (Admin)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/org/employees` | 🛠️ | List org employees + progress. |
| POST | `/api/org/employees/invite` | 🛠️ | Invite employees by email. |
| POST | `/api/org/journeys/assign` | 🛠️ | Assign/curate a journey for employees. |
| GET | `/api/org/analytics` | 🛠️🏷️ | Org-level analytics (Pro). |

---

## 17. Status Codes Summary

| Code | Meaning |
| --- | --- |
| 200 | OK |
| 201 | Created |
| 400 | Validation error |
| 401 | Not authenticated |
| 403 | Forbidden (role or tier) |
| 404 | Not found |
| 409 | Conflict (e.g., already enrolled) |
| 429 | Rate limited |
| 500 | Server error |
