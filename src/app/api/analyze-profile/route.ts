import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  CAREER_ROLES_DATASET,
  calculateSkillGap,
  getRequiredSkillsForGoal,
  extractSkillsFromCV,
} from '@/lib/career/careerRolesDataset';
import { recommendCoursesForSkillGap } from '@/lib/career/courseRecommendationMatcher';

export const runtime = 'nodejs';

export interface CourseRecommendation {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: string;
  reason: string;
  keyTopics: string[];
  actionableOutcome: string;
  matchScore: number;
  tag?: string;
  techLogo?: string;
  bannerBg?: string;
}

export interface PrerequisiteGap {
  skill: string;
  impact: string;
  urgency: 'High' | 'Medium' | 'Foundational';
}

export interface CareerAnalysisResult {
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  levelExplanation: string;
  fieldOfInterest: string;
  futureGoal: string;
  possessedSkills: string[];
  missingSkills: string[];
  currentProfileEvaluation: {
    summary: string;
    strengths: string[];
    experienceAssessment: string;
  };
  prerequisiteGaps: PrerequisiteGap[];
  targetedCourseRecommendations: CourseRecommendation[];
  rawMarkdown?: string;
}

const SYSTEM_INSTRUCTION = `You are an expert AI Career Counselor and Course Recommendation Agent for Mentora.

TRAINING KNOWLEDGE GRAPH - 50 CAREER ROLES & REQUIRED SKILLSETS:
${CAREER_ROLES_DATASET.slice(0, 30).map((r) => `${r.srNo}. ${r.futureGoal}: [${r.skillsNeeded.join(', ')}]`).join('\n')}
... (and remaining dataset roles covering Engineering, AI, Cloud, Design, Security, and Professional domains).

YOUR STRICT WORKFLOW:
1. Examine the user's acquired skills (extracted from their CV/resume and confirmed by the user in the onboarding UI).
2. Look up the user's declared "Future Goal" (e.g. Data Scientist, UI/UX Designer, Full Stack Developer, Machine Learning Engineer, Cloud Engineer, or custom goal).
3. Determine the required skills for this goal from the 50-role dataset.
4. Calculate the EXACT SKILL GAP: missingSkills = requiredSkills - possessedSkills.
5. Recommend 3-4 targeted courses specifically tailored to bridge those missing skills. Where appropriate, prioritize Mentora's admin-verified courses:
   - "Machine Learning Fundamentals & Neural Systems" (id: "crs_1") for ML, Python, Statistics, Deep Learning gaps.
   - "Full-Stack Web Development with React" (id: "crs_2") for React, JavaScript, HTML/CSS, Node.js, Databases gaps.
   - "Data Structures & Algorithms Mastery" (id: "crs_3") for Algorithms, Data Structures, Problem Solving, System Design gaps.

DETERMINE DIFFICULTY TIER:
- Beginner: Possesses foundational or entry-level skills.
- Intermediate: Competent in core languages/frameworks; ready for production architectures.
- Advanced: Has senior/lead exposure, deep systems engineering or architectural expertise.

OUTPUT FORMAT:
You MUST respond with a valid JSON object adhering to this structure:
{
  "currentLevel": "Beginner" | "Intermediate" | "Advanced",
  "levelExplanation": "Short justification based on detected skills and experience",
  "fieldOfInterest": "...",
  "futureGoal": "...",
  "possessedSkills": ["Skill A", "Skill B"],
  "missingSkills": ["Missing Skill 1", "Missing Skill 2"],
  "currentProfileEvaluation": {
    "summary": "Detailed evaluation of their current strengths and trajectory",
    "strengths": ["Strength 1", "Strength 2"],
    "experienceAssessment": "Assessment of tools, projects, and work history"
  },
  "prerequisiteGaps": [
    {
      "skill": "Skill Name",
      "impact": "Why this gap matters for their future goal",
      "urgency": "High" | "Medium" | "Foundational"
    }
  ],
  "targetedCourseRecommendations": [
    {
      "id": "crs_1",
      "title": "Exact Course Name",
      "level": "Intermediate",
      "category": "Domain Category",
      "duration": "6 Weeks",
      "reason": "Why this directly bridges the prerequisite gap",
      "keyTopics": ["Topic 1", "Topic 2"],
      "actionableOutcome": "What they will build",
      "matchScore": 95,
      "tag": "Admin Verified Track"
    }
  ]
}
`;

function extractJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    // Try finding json block inside markdown fences
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch {}
    }

    // Try finding first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(text.substring(firstBrace, lastBrace + 1));
      } catch {}
    }

    return null;
  }
}

function generateDynamicFallback(
  linkedinText: string,
  cvText: string,
  fieldOfInterest: string,
  futureGoal: string,
  selectedSkills?: string[]
): CareerAnalysisResult {
  const combined = `${linkedinText} ${cvText}`.toLowerCase();
  
  // 1. Determine possessed skills: prioritize explicitly selected skills from CV/onboarding
  let possessed: string[] = [];
  if (Array.isArray(selectedSkills) && selectedSkills.length > 0) {
    possessed = [...selectedSkills];
  } else {
    possessed = extractSkillsFromCV(`${linkedinText}\n${cvText}`);
  }

  if (possessed.length === 0) {
    possessed = ['Python', 'Problem Solving', 'Data Analysis', 'Communication'];
  }

  // 2. Determine difficulty tier
  let level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate';
  if (
    combined.includes('intern') ||
    combined.includes('student') ||
    combined.includes('junior') ||
    possessed.length <= 3
  ) {
    if (combined.includes('agentic') || combined.includes('pytorch') || combined.includes('architecture')) {
      level = 'Intermediate';
    } else {
      level = 'Beginner';
    }
  } else if (
    combined.includes('senior') ||
    combined.includes('lead') ||
    combined.includes('architect') ||
    combined.includes('fine-tuning')
  ) {
    level = 'Advanced';
  }

  const targetGoal = futureGoal || 'AI Engineer';
  const targetField = fieldOfInterest || 'Artificial Intelligence & Machine Learning';

  // 3. Grounded Skill Gap from the 50-Role Dataset
  const gapResult = calculateSkillGap(possessed, targetGoal);
  const missingSkills = gapResult.missingSkills.length > 0 
    ? gapResult.missingSkills 
    : ['System Design', 'Production Deployment', 'Performance Optimization'];

  // 4. Targeted Course Recommendations to Bridge the Skill Gap
  const courses: CourseRecommendation[] = recommendCoursesForSkillGap(missingSkills, targetGoal, level);

  // 5. Prerequisite Gaps
  const prerequisiteGaps: PrerequisiteGap[] = missingSkills.slice(0, 4).map((skill, idx) => ({
    skill,
    impact: `Essential requirement for ${targetGoal} industry roles and technical assessments.`,
    urgency: idx === 0 ? 'High' : idx === 1 ? 'High' : idx === 2 ? 'Medium' : 'Foundational',
  }));

  return {
    currentLevel: level,
    levelExplanation: `Based on your CV and verified skills (${possessed.slice(0, 4).join(', ')}), your baseline is in the ${level} tier for ${targetGoal}.`,
    fieldOfInterest: targetField,
    futureGoal: targetGoal,
    possessedSkills: possessed,
    missingSkills,
    currentProfileEvaluation: {
      summary: `Your profile demonstrates verified competency in ${possessed.slice(0, 3).join(', ')}. To achieve your target role as ${targetGoal}, the curriculum focuses on bridging your missing prerequisites: ${missingSkills.slice(0, 3).join(', ')}.`,
      strengths: [
        `Hands-on proficiency in ${possessed.slice(0, 2).join(' and ')}`,
        'Demonstrated capability in technical workflows and problem solving',
        'Strong trajectory aligned with modern industry benchmarks',
      ],
      experienceAssessment: `Verified experience confirms proficiency in core fundamentals. Prerequisite gap analysis indicates targeted readiness to acquire ${missingSkills.slice(0, 2).join(' and ')}.`,
    },
    prerequisiteGaps,
    targetedCourseRecommendations: courses,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      linkedinText = '',
      cvText = '',
      fieldOfInterest = 'Artificial Intelligence & Machine Learning',
      futureGoal = 'AI Engineer',
      selectedSkills = [],
      possessedSkills = [],
    } = body;

    const userSkills: string[] = (Array.isArray(selectedSkills) && selectedSkills.length > 0)
      ? selectedSkills
      : (Array.isArray(possessedSkills) && possessedSkills.length > 0)
      ? possessedSkills
      : extractSkillsFromCV(`${linkedinText}\n${cvText}`);

    const apiKey = process.env['GEMINI_API_KEY'];

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not configured. Utilizing dynamic profile analysis engine.');
      const fallbackResult = generateDynamicFallback(linkedinText, cvText, fieldOfInterest, futureGoal, userSkills);
      return NextResponse.json({
        success: true,
        source: 'dynamic-engine',
        data: fallbackResult,
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const generationConfig = {
      temperature: 1,
      max_output_tokens: 65536,
      topP: 0.95,
      thinkingLevel: 'high',
    };

    const userInput = `
User Profile Input for Analysis:
- User Acquired Skills (Extracted from CV/Resume & Selected):
${userSkills.length > 0 ? userSkills.join(', ') : 'None explicitly specified'}

- Declared Future Goal: "${futureGoal}"
- Field / Domain: "${fieldOfInterest}"

- Uploaded CV / Resume Text:
"""
${cvText || 'Not provided'}
"""

- LinkedIn Profile Details:
"""
${linkedinText || 'Not provided'}
"""

Please execute your sequential evaluation workflow now. Calculate the exact skill gap between the user's acquired skills and the required skills for "${futureGoal}" using the 50-role dataset knowledge base, and return the structured JSON result.
`;

    let responseText: string | null = null;

    // 1. Try ai.interactions.create as configured in AI Studio
    try {
      const interaction = await ai.interactions.create({
        model: 'models/gemini-3-flash-preview',
        input: userInput,
        system_instruction: SYSTEM_INSTRUCTION,
        generation_config: generationConfig,
      } as any);

      if (interaction && (interaction as any).output_text) {
        responseText = (interaction as any).output_text;
      }
    } catch (interactionError: any) {
      console.warn('ai.interactions.create attempt notice:', interactionError?.message || interactionError);
    }

    // 2. Fallback to ai.models.generateContent if interactions did not return text
    if (!responseText) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userInput,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 1,
            maxOutputTokens: 8192,
          },
        });
        responseText = response.text || null;
      } catch (modelError: any) {
        console.warn('ai.models.generateContent attempt notice:', modelError?.message || modelError);
      }
    }

    // If Gemini provided a response, parse it
    if (responseText) {
      const parsed = extractJson(responseText);
      if (parsed && parsed.currentLevel && parsed.targetedCourseRecommendations) {
        return NextResponse.json({
          success: true,
          source: 'gemini-api',
          data: {
            ...parsed,
            rawMarkdown: responseText,
          },
        });
      }
    }

    // Dynamic fallback if parsing was unsuccessful or API was unavailable
    const fallbackResult = generateDynamicFallback(linkedinText, cvText, fieldOfInterest, futureGoal, userSkills);
    return NextResponse.json({
      success: true,
      source: 'dynamic-engine-fallback',
      data: {
        ...fallbackResult,
        rawMarkdown: responseText || undefined,
      },
    });
  } catch (error: any) {
    console.error('Profile Analysis Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to analyze profile',
      },
      { status: 500 }
    );
  }
}
