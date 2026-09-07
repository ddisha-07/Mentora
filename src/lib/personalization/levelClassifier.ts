/**
 * Mentora Personalization Engine - Level Classifier
 * Computes learner level ('beginner' | 'intermediate' | 'advanced')
 * based on years of experience and known skills count.
 */

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface LevelClassifierInput {
  yearsOfExperience: number;
  knownSkillsCount: number;
}

/**
 * Heuristic Classifier:
 * - < 2 years experience OR < 3 known relevant skills -> beginner
 * - < 5 years experience OR < 6 known relevant skills -> intermediate
 * - 5+ years experience AND 6+ known relevant skills  -> advanced
 */
export function classifyLevel(input: LevelClassifierInput): ExperienceLevel {
  const { yearsOfExperience, knownSkillsCount } = input;

  if (yearsOfExperience < 2 || knownSkillsCount < 3) {
    return 'beginner';
  }

  if (yearsOfExperience < 5 || knownSkillsCount < 6) {
    return 'intermediate';
  }

  return 'advanced';
}
