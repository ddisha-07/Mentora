// src/lib/ai/geminiClient.ts
// Google Gemini Client for Mentora AI Course Architect

import { MENTORA_MASTER_SYSTEM_PROMPT } from "./mentoraMasterPrompt";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY || "";

const PRIMARY_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const BACKUP_MODEL = "gemini-3.7-flash";

interface GenerateOptions {
  model?: string;
  temperature?: number;
  systemInstruction?: string;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

export async function callGemini(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const model = options.model || PRIMARY_MODEL;
  const systemInstruction =
    options.systemInstruction || MENTORA_MASTER_SYSTEM_PROMPT;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const payload: any = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.4,
      maxOutputTokens: options.maxOutputTokens ?? 8192,
      ...(options.responseMimeType ? { responseMimeType: options.responseMimeType } : {}),
    },
  };

  if (systemInstruction) {
    payload.system_instruction = {
      parts: [{ text: systemInstruction }],
    };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`Gemini call to ${model} returned ${res.status}: ${errText}`);
      if (model !== BACKUP_MODEL) {
        console.log(`Retrying with backup model ${BACKUP_MODEL}...`);
        return callGemini(prompt, { ...options, model: BACKUP_MODEL });
      }
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text returned in Gemini candidate response.");
    }

    return text;
  } catch (err: any) {
    if (model !== BACKUP_MODEL) {
      console.warn(`Attempt with ${model} failed (${err.message}). Retrying with ${BACKUP_MODEL}...`);
      return callGemini(prompt, { ...options, model: BACKUP_MODEL });
    }
    throw err;
  }
}

export function sanitizeJsonString(jsonStr: string): string {
  let inString = false;
  let isEscaped = false;
  let result = "";

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (inString) {
      if (isEscaped) {
        // Valid escape characters in JSON: " \ / b f n r t u
        const validEscapes = ['"', "\\", "/", "b", "f", "n", "r", "t", "u"];
        if (!validEscapes.includes(char)) {
          // Bad escape character: escape the backslash itself
          result += `\\\\${char}`;
        } else {
          result += `\\${char}`;
        }
        isEscaped = false;
      } else if (char === "\\") {
        isEscaped = true;
      } else if (char === '"') {
        result += char;
        inString = false;
      } else if (char === "\n") {
        result += "\\n";
      } else if (char === "\r") {
        result += "\\r";
      } else if (char === "\t") {
        result += "\\t";
      } else if (char.charCodeAt(0) < 32) {
        result += `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}`;
      } else {
        result += char;
      }
    } else {
      result += char;
      if (char === '"') {
        inString = true;
      }
    }
  }

  if (isEscaped) {
    result += "\\\\";
  }

  return result;
}

/**
 * Clean and parse JSON response from Gemini, removing code block markdown wrappers
 */
export function extractJsonFromResponse<T = any>(rawText: string): T {
  let cleaned = rawText.trim();

  // If response has ```json ... ``` wrapper, strip it
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  // Find first { and last } or first [ and last ]
  const firstBrace = cleaned.indexOf("{");
  const firstBracket = cleaned.indexOf("[");

  let startIdx = 0;
  let endIdx = cleaned.length;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    const lastBrace = cleaned.lastIndexOf("}");
    if (lastBrace !== -1) {
      endIdx = lastBrace + 1;
    }
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    const lastBracket = cleaned.lastIndexOf("]");
    if (lastBracket !== -1) {
      endIdx = lastBracket + 1;
    }
  }

  const jsonSubstring = cleaned.slice(startIdx, endIdx);

  try {
    return JSON.parse(jsonSubstring);
  } catch (err1: any) {
    try {
      const sanitized = sanitizeJsonString(jsonSubstring);
      return JSON.parse(sanitized);
    } catch (err2: any) {
      console.error("JSON parsing error on string:", jsonSubstring.slice(0, 500));
      throw new Error(`Failed to parse structured JSON from Gemini output: ${err2.message}`);
    }
  }
}

export async function callGeminiJson<T = any>(
  prompt: string,
  options: GenerateOptions = {}
): Promise<T> {
  const rawText = await callGemini(prompt, {
    ...options,
    responseMimeType: options.responseMimeType || "application/json",
  });
  return extractJsonFromResponse<T>(rawText);
}
