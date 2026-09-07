/**
 * Mentora Personalization Engine - End-to-End Pipeline Demonstration & Test
 *
 * Compares two distinct professional profiles:
 * 1. Software Developer transitioning to Senior AI Software Engineer
 * 2. Product Manager transitioning to AI Product Manager
 *
 * Demonstrates how the 3-stage pipeline (classifyLevel -> predictSkillGaps -> buildJourney)
 * produces distinctly customized learning roadmaps for each persona.
 */

import { classifyLevel } from './levelClassifier';
import { predictSkillGaps } from './gapPredictor';
import { buildJourney } from './journeyBuilder';

function runPipelineTest() {
  console.log('='.repeat(80));
  console.log('MENTORA PERSONALIZATION ENGINE — PIPELINE VERIFICATION TEST');
  console.log('='.repeat(80));

  // --------------------------------------------------------------------------
  // Profile 1: Software Developer
  // --------------------------------------------------------------------------
  const devProfile = {
    role: 'Software Developer',
    targetRole: 'Senior AI Software Engineer',
    yearsOfExperience: 3,
    currentSkills: ['JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'],
    targetRoleSkills: [
      'Python',
      'GenAI Foundations',
      'Prompt Engineering',
      'Embeddings & RAG',
      'LLM APIs & Tool Calling',
      'Vector Databases',
      'LangChain / AI Agents',
      'Model Fine-Tuning',
      'AI System Architecture',
    ],
  };

  console.log('\n[1] PROCESSING PERSONA 1: Software Developer');
  console.log(`    Current Role: ${devProfile.role} (${devProfile.yearsOfExperience} yrs exp)`);
  console.log(`    Target Role:  ${devProfile.targetRole}`);
  console.log(`    Known Skills: ${devProfile.currentSkills.join(', ')}`);

  const devLevel = classifyLevel({
    yearsOfExperience: devProfile.yearsOfExperience,
    knownSkillsCount: devProfile.currentSkills.length,
  });
  console.log(`    -> Computed Level: [${devLevel.toUpperCase()}]`);

  const devGaps = predictSkillGaps({
    currentSkills: devProfile.currentSkills,
    targetRoleSkills: devProfile.targetRoleSkills,
  });
  console.log(`    -> Skill Match:    ${devGaps.matchPercentage}%`);
  console.log(`    -> Missing Skills (${devGaps.missingSkills.length}): ${devGaps.missingSkills.join(' | ')}`);

  const devJourney = buildJourney({
    role: devProfile.targetRole,
    missingSkills: devGaps.missingSkills,
    userLevel: devLevel,
  });

  console.log(`\n    --- Generated 3-Level Journey for Developer ---`);
  devJourney.levels.forEach((lvl) => {
    const statusIcon = lvl.isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED';
    console.log(`    Level ${lvl.level}: ${lvl.name} (${statusIcon}) [${lvl.modules.length} modules]`);
    lvl.modules.forEach((mod) => {
      console.log(`      • [${mod.status.toUpperCase()}] #${mod.order} ${mod.title} (${mod.estimatedHours} hrs)`);
    });
  });

  // --------------------------------------------------------------------------
  // Profile 2: Product Manager
  // --------------------------------------------------------------------------
  const pmProfile = {
    role: 'Product Manager',
    targetRole: 'AI Product Manager',
    yearsOfExperience: 6,
    currentSkills: [
      'Product Discovery',
      'User Research',
      'Agile / Scrum',
      'Roadmapping',
      'Stakeholder Management',
      'A/B Testing',
      'Data Analytics',
    ],
    targetRoleSkills: [
      'AI Fundamentals',
      'Understanding LLM Capabilities',
      'AI Product Strategy',
      'AI UX & Product Design',
      'Evaluating AI Products & Metrics',
      'AI Ethics & Governance',
      'AI Product Roadmap Execution',
    ],
  };

  console.log('\n' + '-'.repeat(80));
  console.log('[2] PROCESSING PERSONA 2: Product Manager');
  console.log(`    Current Role: ${pmProfile.role} (${pmProfile.yearsOfExperience} yrs exp)`);
  console.log(`    Target Role:  ${pmProfile.targetRole}`);
  console.log(`    Known Skills: ${pmProfile.currentSkills.join(', ')}`);

  const pmLevel = classifyLevel({
    yearsOfExperience: pmProfile.yearsOfExperience,
    knownSkillsCount: pmProfile.currentSkills.length,
  });
  console.log(`    -> Computed Level: [${pmLevel.toUpperCase()}]`);

  const pmGaps = predictSkillGaps({
    currentSkills: pmProfile.currentSkills,
    targetRoleSkills: pmProfile.targetRoleSkills,
  });
  console.log(`    -> Skill Match:    ${pmGaps.matchPercentage}%`);
  console.log(`    -> Missing Skills (${pmGaps.missingSkills.length}): ${pmGaps.missingSkills.join(' | ')}`);

  const pmJourney = buildJourney({
    role: pmProfile.targetRole,
    missingSkills: pmGaps.missingSkills,
    userLevel: pmLevel,
  });

  console.log(`\n    --- Generated 3-Level Journey for Product Manager ---`);
  pmJourney.levels.forEach((lvl) => {
    const statusIcon = lvl.isUnlocked ? '🔓 UNLOCKED' : '🔒 LOCKED';
    console.log(`    Level ${lvl.level}: ${lvl.name} (${statusIcon}) [${lvl.modules.length} modules]`);
    lvl.modules.forEach((mod) => {
      console.log(`      • [${mod.status.toUpperCase()}] #${mod.order} ${mod.title} (${mod.estimatedHours} hrs)`);
    });
  });

  // --------------------------------------------------------------------------
  // COMPARISON & ASSERTIONS
  // --------------------------------------------------------------------------
  console.log('\n' + '='.repeat(80));
  console.log('COMPARISON & DIFFERENTIATION ANALYSIS');
  console.log('='.repeat(80));

  console.log(`1. Experience Classification:`);
  console.log(`   - Software Developer: ${devLevel} (3 yrs, 5 skills)`);
  console.log(`   - Product Manager:    ${pmLevel} (6 yrs, 7 skills)`);
  if (devLevel === pmLevel) {
    throw new Error('Assertion failed: Levels should reflect differences in experience/skills.');
  }
  console.log('   ✓ Verified distinct experience classification.');

  console.log(`\n2. Skill Gap Divergence:`);
  const devMissingSet = new Set(devGaps.missingSkills.map((s) => s.toLowerCase()));
  const pmMissingSet = new Set(pmGaps.missingSkills.map((s) => s.toLowerCase()));
  const overlappingSkills = [...devMissingSet].filter((x) => pmMissingSet.has(x));

  console.log(`   - Dev Missing: ${devGaps.missingSkills.length} skills`);
  console.log(`   - PM Missing:  ${pmGaps.missingSkills.length} skills`);
  console.log(`   - Skill Overlap: ${overlappingSkills.length} skills`);
  if (overlappingSkills.length > 0) {
    throw new Error('Assertion failed: Distinct tracks should have targeted skill gaps.');
  }
  console.log('   ✓ Verified 100% role-specific skill gap personalization.');

  console.log(`\n3. Journey Structure & Modules:`);
  console.log(`   - Dev Total Modules: ${devJourney.totalModules} modules across 3 levels`);
  console.log(`   - PM Total Modules:  ${pmJourney.totalModules} modules across 3 levels`);

  const devTitles = devJourney.levels.flatMap((l) => l.modules.map((m) => m.title));
  const pmTitles = pmJourney.levels.flatMap((l) => l.modules.map((m) => m.title));
  const overlappingTitles = devTitles.filter((t) => pmTitles.includes(t));

  if (overlappingTitles.length > 0) {
    throw new Error('Assertion failed: Module curricula must not overlap between Developer and PM tracks.');
  }
  console.log('   ✓ Verified distinct module curricula between Software Developer and Product Manager.');

  console.log('\n' + '='.repeat(80));
  console.log('ALL PIPELINE ASSERTIONS PASSED SUCCESSFULLY! 🚀');
  console.log('='.repeat(80));
}

// Execute test
runPipelineTest();
