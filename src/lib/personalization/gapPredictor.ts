/**
 * Mentora Personalization Engine - Skill Gap Predictor
 * Compares current skills against target role requirements (and desired skills),
 * producing an ordered and deduplicated list of missing skills.
 */

export interface SkillGapInput {
  currentSkills: string[];
  targetRoleSkills: string[];
  desiredSkills?: string[];
  prerequisiteOrder?: string[];
}

export interface SkillGapResult {
  missingSkills: string[];
  acquiredSkills: string[];
  matchPercentage: number;
}

/**
 * Predicts skill gaps:
 * skill_gap = (targetRoleSkills ∪ desiredSkills) - currentSkills
 * Returns sorted missing skills based on optional prerequisite ordering followed by alphabetical order.
 */
export function predictSkillGaps(input: SkillGapInput): SkillGapResult {
  const normalizedCurrent = new Set(
    (input.currentSkills || []).map((s) => s.trim().toLowerCase())
  );

  // Union of target role skills and desired skills
  const targetMap = new Map<string, string>();
  for (const s of [...(input.targetRoleSkills || []), ...(input.desiredSkills || [])]) {
    const trimmed = s.trim();
    if (trimmed && !targetMap.has(trimmed.toLowerCase())) {
      targetMap.set(trimmed.toLowerCase(), trimmed);
    }
  }

  const missing: string[] = [];
  const acquired: string[] = [];

  for (const [norm, original] of targetMap.entries()) {
    if (normalizedCurrent.has(norm)) {
      acquired.push(original);
    } else {
      missing.push(original);
    }
  }

  // Sorting: respect prerequisiteOrder if specified, otherwise sort alphabetically
  const orderMap = new Map<string, number>();
  if (input.prerequisiteOrder) {
    input.prerequisiteOrder.forEach((skill, index) => {
      orderMap.set(skill.trim().toLowerCase(), index);
    });
  }

  missing.sort((a, b) => {
    const aOrder = orderMap.has(a.toLowerCase()) ? orderMap.get(a.toLowerCase())! : 999;
    const bOrder = orderMap.has(b.toLowerCase()) ? orderMap.get(b.toLowerCase())! : 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.localeCompare(b);
  });

  const total = targetMap.size;
  const matchPercentage = total > 0 ? Math.round((acquired.length / total) * 100) : 100;

  return {
    missingSkills: missing,
    acquiredSkills: acquired,
    matchPercentage,
  };
}
