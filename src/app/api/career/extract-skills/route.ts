import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { extractSkillsFromCV, ALL_DATASET_SKILLS } from '@/lib/career/careerRolesDataset';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { cvText = '', linkedinText = '' } = body;

    const combinedText = `${linkedinText}\n${cvText}`.trim();
    if (!combinedText) {
      return NextResponse.json({ success: true, skills: [] });
    }

    // 1. Fast deterministic extraction from the 50-role dataset ontology
    const deterministicSkills = extractSkillsFromCV(combinedText);

    // 2. Enhance with Gemini if API key is provided
    const apiKey = process.env['GEMINI_API_KEY'];
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are an AI resume parser trained on an industry skill dataset.
Dataset skills reference:
${ALL_DATASET_SKILLS.slice(0, 80).join(', ')}

Document to parse:
"""
${combinedText.slice(0, 10000)}
"""

Extract all technical, analytical, domain, and soft skills possessed by this candidate that are explicitly mentioned or directly evidenced in this text.
Return ONLY a valid JSON array of skill name strings. Example: ["Python", "SQL", "React", "Docker"]`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.2,
            maxOutputTokens: 2048,
          },
        });

        const rawText = response.text || '';
        const match = rawText.match(/\[[\s\S]*\]/);
        if (match) {
          const aiSkills: string[] = JSON.parse(match[0]);
          if (Array.isArray(aiSkills)) {
            const merged = new Set<string>([...deterministicSkills]);
            aiSkills.forEach((s) => {
              if (typeof s === 'string' && s.trim().length > 1) {
                // Capitalize first letter of each word
                const cleaned = s.trim().replace(/\b\w/g, (c) => c.toUpperCase());
                merged.add(cleaned);
              }
            });
            return NextResponse.json({
              success: true,
              skills: Array.from(merged),
              source: 'gemini-ai+dataset',
            });
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini skill extraction fallback to dataset ontology:', geminiErr?.message);
      }
    }

    // Return deterministic skills from the 50-role dataset
    return NextResponse.json({
      success: true,
      skills: deterministicSkills,
      source: 'dataset-ontology',
    });
  } catch (error: any) {
    console.error('Skill extraction error:', error);
    return NextResponse.json({ success: false, error: error.message, skills: [] }, { status: 500 });
  }
}
