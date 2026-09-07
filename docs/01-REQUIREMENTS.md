# Mentora — Requirements Specification

> **Mentora** is a personalized learning ecosystem for the Learning & Development (L&D) departments of industries and companies. It creates customized learning journeys for employees based on their professional and personal learning context.

---

## 1. Vision & Purpose

Mentora is a web-based, fully responsive application designed to help working professionals **learn, practice, and gain new professional skills** on a single, unified platform. It is built to serve employees of *any* job profile and to be usable on *any* device.

Mentora shifts the learning paradigm from:

```
Topic  →  Course        (traditional platforms)
```

to:

```
Person  →  Context  →  Skill Gap  →  Learning Journey     (Mentora)
```

---

## 2. The Core Problem

Working professionals struggle to identify **what they should learn next**, because existing platforms provide large amounts of generic content without adequately considering an individual's role, experience, interests, skills, and career goals.

### 2.1 One-size-fits-all learning
Employees in the same organization have completely different learning needs. A *Junior Software Engineer* and a *Senior Software Engineer* may both be interested in AI, but their requirements differ. The same course is not effective for both.

### 2.2 Information overload
There are thousands of courses, articles, videos, and certifications online. A search for *"AI for software development"* returns hundreds of results. Which one is worth the professional's limited time?

### 2.3 Lack of personalization
Traditional platforms map **Topic → Course**. Mentora maps **Person → Context → Skill Gap → Learning Journey**.

### 2.4 Time constraints
Professionals juggle work, meetings, projects, deadlines, and personal responsibilities. Learning must be **relevant, efficient, and manageable**.

### 2.5 Unclear career direction
An employee may know *"I want to move into AI"* but not know what skills they already have, what they are missing, what to learn first, what comes next, or which resources are worth their time. There is a gap between **aspiration** and an **actionable plan**.

### 2.6 Learning disconnected from career
Employees complete assigned courses. But *"Course completed ✅"* does not mean *"This contributed meaningfully to my career ✅"*. Mentora connects learning directly to professional context and goals.

---

## 3. Proposed Solution

A **personalized learning ecosystem** that builds customized learning journeys from an employee's professional and personal learning context.

### 3.1 The Employee Profile
The journey begins by understanding the employee across three dimensions:

**Professional Information**
- Job role
- Industry
- Years of experience
- Current skills
- Technical / non-technical background

**Learning Preferences**
- Areas of interest
- Preferred topics
- Learning format preferences
- Existing knowledge

**Career Context**
- Career goals
- Desired skills
- Potential career transitions
- Areas for improvement

### 3.2 Journeys, not courses
Instead of recommending a single course, Mentora structures learning into a **journey (roadmap)**.

**Example — Employee A** *(Software Developer, 3 yrs, interest: Generative AI, goal: Build AI apps)*
```
Generative AI Foundations
        ↓
LLMs & Prompt Engineering
        ↓
Embeddings & RAG
        ↓
Tool Calling
        ↓
AI Agents
        ↓
Building AI Applications
```

**Example — Employee B** *(Product Manager, 6 yrs, interest: AI, goal: Lead AI products)*
```
AI Fundamentals
        ↓
Understanding LLM Capabilities
        ↓
AI Product Strategy
        ↓
AI UX & Product Design
        ↓
Evaluating AI Products
        ↓
Building an AI Product Roadmap
```

Same broad interest (**AI**), completely different journeys. **That is the point of personalization.**

---

## 4. Subscription Tiers

| Feature | Free | Plus | Pro |
| --- | --- | --- | --- |
| Personalized dashboard | ✅ (limited) | ✅ | ✅ |
| Personalization filters | Basic | Extended | All |
| Learning journeys | 1 active | 3 active | Unlimited |
| Flashcards | ✅ | ✅ | ✅ |
| YouTube video suggestions | ✅ | ✅ | ✅ |
| Retired-employee insights | ❌ | ✅ | ✅ |
| Quizzes & skill checks | Limited | ✅ | ✅ |
| Skill Passport | Basic | ✅ | ✅ (verified) |
| Community access | Read-only | ✅ | ✅ |
| Leaderboard | ✅ | ✅ | ✅ |
| End-of-module recorded sessions | ❌ | ✅ | ✅ |
| Live mentorship sessions | ❌ | Limited | ✅ |
| Company analytics (L&D) | ❌ | ❌ | ✅ |

---

## 5. Personalization Model

### 5.1 Skill levels (initial stage)
Three levels are supported initially:
- **Beginner**
- **Intermediate**
- **Advanced**

### 5.2 Personalization filters
Dashboards and journeys are personalized using filters such as:
- Current job profile / role
- Industry & industry experience
- Years of experience
- Current skills
- Interests & preferred topics
- Career goals / desired transition

### 5.3 Model responsibilities
The model:
1. Predicts the employee's **skill gaps** (desired skills − current skills).
2. Suggests **courses / modules** aligned to their future goals.
3. Generates a **roadmap** where prior levels must be completed before proceeding.
4. After each module / learning bite, lets the user **generate their learnings (summary/notes)**.
5. Suggests **relevant YouTube videos** (open-source content source) per skill.

### 5.4 Two operating modes
- **User-centric:** an individual professional signs up and personalizes their own journey.
- **Company-collaborated:** an organization's L&D onboards employees, assigns/curates journeys, and views analytics.

---

## 6. Content Formats

Every skill is delivered in **three forms**:
1. **Flash cards** — concise, spaced-repetition-friendly bites.
2. **Related YouTube videos** — fetched from YouTube (open-source content).
3. **Retired-employee insights** — practical wisdom from experienced/retired professionals.

Additional content:
- **End-of-module recorded sessions / lectures.**
- **Live mentorship sessions** conducted with mentors.

---

## 7. Functional Requirements

### 7.1 Public / Landing site
The landing experience must include:
- **Home**
- **About**
- **Why Mentora?**
- **Blogs**
- **FAQs**
- **Quick Links → Contact Us**
- **Login / Create Profile** entry point

### 7.2 Onboarding
- Authenticate via **email address**.
- On first login, present an **onboarding questionnaire** collecting personal details, current job profile, industry experience, skills, and future goals.
- Use the answers to **personalize the dashboard** and generate journeys.

### 7.3 Dashboard (authenticated)
- Personalized overview of progress, active journeys, next steps, and recommendations.
- Reflects tier-based feature access.

### 7.4 Platform features
- **Community** — discussion / posts among employees.
- **Skill Passport** — a portable record of skills and achievements.
- **Quizzes** — knowledge checks tied to modules.
- **Leaderboard** — gamified ranking.
- **Learning journey / roadmap** — level-gated progression.
- **Learning-bite summaries** — user-generated learnings after modules.
- **Mentorship sessions** — scheduling & attendance.

### 7.5 Roadmap gating
Users must **complete prior levels** before unlocking the next. Progress is tracked per module and per journey.

---

## 8. Non-Functional Requirements

| Category | Requirement |
| --- | --- |
| **Responsiveness** | Must work on any device (mobile, tablet, desktop). |
| **Performance** | Fast dashboard loads; content lazy-loaded where possible. |
| **Scalability** | Support many employees across many organizations. |
| **Security** | Email authentication, protected routes, secrets server-side only. |
| **Accessibility** | Semantic HTML, keyboard-navigable, readable contrast. |
| **Maintainability** | Modular Next.js App Router structure, typed DB via Drizzle. |
| **Extensibility** | Easy to add new skill levels, journeys, and content sources. |

---

## 9. Users & Roles

| Role | Description |
| --- | --- |
| **Employee (Learner)** | Primary user; learns via personalized journeys. |
| **Mentor** | Conducts live mentorship sessions; contributes insights. |
| **L&D Admin (Company)** | Manages employees, curates content, views analytics. |
| **Platform Admin** | Manages content catalog, tiers, and system config. |

---

## 10. Success Metrics

- Journey completion rate.
- Skill-gap reduction over time (desired vs. acquired skills).
- Time-to-first-relevant-content.
- Quiz pass rates and skill-passport growth.
- Engagement: community participation, mentorship attendance.
- L&D-reported alignment of learning to career outcomes.
