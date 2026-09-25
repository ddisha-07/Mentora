/**
 * Course Recommendation Engine based on Missing Skills Gap
 * Maps missing skills identified from the 50-role dataset to targeted courses,
 * seamlessly linking to admin-designed courses (crs_1, crs_2, crs_3, etc.).
 */

import { CourseRecommendation } from '@/app/api/analyze-profile/route';
import { mockCourses } from '@/lib/admin/data/mockCourses';

export function recommendCoursesForSkillGap(
  missingSkills: string[],
  futureGoal: string,
  currentLevel: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate'
): CourseRecommendation[] {
  const missingLower = (missingSkills || []).map((s) => s.toLowerCase());
  const recommendations: CourseRecommendation[] = [];
  const addedCourseIds = new Set<string>();

  // 1. Machine Learning & Python Gap -> crs_1 (Machine Learning Fundamentals)
  const mlKeywords = ['machine learning', 'python', 'statistics', 'deep learning', 'neural networks', 'tensorflow', 'pytorch', 'data analysis', 'data visualization', 'mlops'];
  const hasMlGap = missingLower.some((m) => mlKeywords.some((kw) => m.includes(kw)));
  if (hasMlGap) {
    const matched = missingSkills.filter((m) => mlKeywords.some((kw) => m.toLowerCase().includes(kw)));
    recommendations.push({
      id: 'crs_1',
      title: 'Machine Learning Fundamentals & Neural Systems',
      level: currentLevel === 'Advanced' ? 'Intermediate' : currentLevel,
      category: 'AI & Machine Learning',
      duration: '6 Weeks (15 Stepping Stones)',
      reason: `Directly bridges your missing prerequisites in ${matched.slice(0, 3).join(', ')} for your goal as ${futureGoal}.`,
      keyTopics: ['Linear & Logistic Foundations', 'Neural Networks & Deep Learning', 'Model Evaluation & Loss Optimization', 'AI Ethics & Validation'],
      actionableOutcome: 'Train, evaluate, and validate deep neural architectures and predictive ML pipelines with hands-on labs.',
      matchScore: 98,
      tag: 'Admin Verified Track',
      techLogo: '🧠',
      bannerBg: 'linear-gradient(135deg, #FF6B35 0%, #D84A1B 50%, #992E0B 100%)',
    });
    addedCourseIds.add('crs_1');
  }

  // 2. Web Development, React, Frontend, Full Stack Gap -> crs_2 (Full-Stack Web Development with React)
  const webKeywords = ['react', 'javascript', 'html', 'css', 'node.js', 'databases', 'frontend', 'full stack', 'apis', 'web3', 'ui development'];
  const hasWebGap = missingLower.some((m) => webKeywords.some((kw) => m.includes(kw)));
  if (hasWebGap) {
    const matched = missingSkills.filter((m) => webKeywords.some((kw) => m.toLowerCase().includes(kw)));
    recommendations.push({
      id: 'crs_2',
      title: 'Full-Stack Web Development with React',
      level: 'Intermediate',
      category: 'Web Development',
      duration: '8 Weeks (15 Stepping Stones)',
      reason: `Directly builds your missing core competencies in ${matched.slice(0, 3).join(', ')}.`,
      keyTopics: ['React State Mechanics & Hooks', 'Full-Stack Architecture & Node.js', 'Database Schemas & REST APIs', 'Production Deployment'],
      actionableOutcome: 'Engineer and deploy responsive, stateful full-stack web applications with modern React patterns.',
      matchScore: 95,
      tag: 'Admin Verified Track',
      techLogo: '⚛️',
      bannerBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
    });
    addedCourseIds.add('crs_2');
  }

  // 3. Problem Solving, Algorithms, Data Structures, System Design -> crs_3 (Data Structures & Algorithms)
  const dsaKeywords = ['algorithms', 'data structures', 'problem solving', 'system design', 'c++', 'big-o', 'computational thinking', 'architecture patterns'];
  const hasDsaGap = missingLower.some((m) => dsaKeywords.some((kw) => m.includes(kw)));
  if (hasDsaGap) {
    const matched = missingSkills.filter((m) => dsaKeywords.some((kw) => m.toLowerCase().includes(kw)));
    recommendations.push({
      id: 'crs_3',
      title: 'Data Structures & Algorithms Mastery',
      level: 'Intermediate',
      category: 'Computer Science',
      duration: '6 Weeks (15 Stepping Stones)',
      reason: `Master core computational patterns and algorithms needed to pass technical gates in ${matched.slice(0, 3).join(', ')}.`,
      keyTopics: ['Big-O & Algorithmic Complexity', 'Trees, Graphs & Dynamic Programming', 'System Design Invariants', 'Competitive Problem Solving'],
      actionableOutcome: 'Analyze and implement high-efficiency algorithms with optimal time-and-space complexity.',
      matchScore: 92,
      tag: 'Admin Verified Track',
      techLogo: '🧩',
      bannerBg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
    });
    addedCourseIds.add('crs_3');
  }

  // 4. Cloud, DevOps, Security Gap
  const cloudKeywords = ['aws', 'azure', 'docker', 'kubernetes', 'ci/cd', 'linux', 'devops', 'cloud security', 'network security', 'ethical hacking', 'cryptography'];
  const hasCloudGap = missingLower.some((m) => cloudKeywords.some((kw) => m.includes(kw)));
  if (hasCloudGap) {
    const matched = missingSkills.filter((m) => cloudKeywords.some((kw) => m.toLowerCase().includes(kw)));
    recommendations.push({
      id: 'crs_cloud_ops',
      title: 'Cloud Infrastructure & DevSecOps Engineering',
      level: 'Intermediate',
      category: 'Cloud & Security',
      duration: '7 Weeks (15 Stepping Stones)',
      reason: `Closes your infrastructure and security gaps in ${matched.slice(0, 3).join(', ')}.`,
      keyTopics: ['Containerization with Docker & K8s', 'CI/CD Pipeline Automation', 'Cloud Security & IAM Hardening', 'Linux Systems Administration'],
      actionableOutcome: 'Provision, secure, and automate resilient containerized cloud environments.',
      matchScore: 94,
      tag: 'High Industry Demand',
      techLogo: '☁️',
      bannerBg: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
    });
    addedCourseIds.add('crs_cloud_ops');
  }

  // 5. Design & Product Gap
  const designKeywords = ['figma', 'wireframing', 'prototyping', 'user research', 'design thinking', 'product strategy', 'market research', 'agile', 'photoshop', 'illustrator', 'branding'];
  const hasDesignGap = missingLower.some((m) => designKeywords.some((kw) => m.includes(kw)));
  if (hasDesignGap) {
    const matched = missingSkills.filter((m) => designKeywords.some((kw) => m.toLowerCase().includes(kw)));
    recommendations.push({
      id: 'crs_ui_ux',
      title: 'UI/UX Design Systems & Product Strategy',
      level: 'Beginner',
      category: 'Design & Creative',
      duration: '5 Weeks (15 Stepping Stones)',
      reason: `Eliminates gaps in user-centric design and product execution: ${matched.slice(0, 3).join(', ')}.`,
      keyTopics: ['Figma Component Architecture', 'User Journey Mapping & Wireframing', 'Interactive Prototyping', 'Usability Testing & Design Thinking'],
      actionableOutcome: 'Design end-to-end interactive prototypes and high-converting design systems in Figma.',
      matchScore: 91,
      tag: 'Creative Track',
      techLogo: '🎨',
      bannerBg: 'linear-gradient(135deg, #db2777 0%, #be185d 50%, #9d174d 100%)',
    });
    addedCourseIds.add('crs_ui_ux');
  }

  // Fallback to ensuring at least 3 high quality courses are returned
  if (recommendations.length < 3) {
    if (!addedCourseIds.has('crs_1')) {
      recommendations.push({
        id: 'crs_1',
        title: 'Machine Learning Fundamentals & Neural Systems',
        level: 'Intermediate',
        category: 'AI & Machine Learning',
        duration: '6 Weeks (15 Stepping Stones)',
        reason: `Fundamental core track recommended to complement your career transition into ${futureGoal}.`,
        keyTopics: ['Linear Models & Neural Networks', 'Evaluation Metrics', 'Optimization & Gradient Descent', 'AI Safety'],
        actionableOutcome: 'Build, train and evaluate machine learning models in Python.',
        matchScore: 90,
        tag: 'Admin Verified Track',
        techLogo: '🧠',
        bannerBg: 'linear-gradient(135deg, #FF6B35 0%, #D84A1B 50%, #992E0B 100%)',
      });
    }
    if (!addedCourseIds.has('crs_2') && recommendations.length < 3) {
      recommendations.push({
        id: 'crs_2',
        title: 'Full-Stack Web Development with React',
        level: 'Intermediate',
        category: 'Web Development',
        duration: '8 Weeks (15 Stepping Stones)',
        reason: `Provides full-stack production skills to build web interfaces for ${futureGoal}.`,
        keyTopics: ['React 19 Hooks', 'Component Composition', 'Node.js APIs', 'State Management'],
        actionableOutcome: 'Create responsive web applications backed by real APIs.',
        matchScore: 88,
        tag: 'Admin Verified Track',
        techLogo: '⚛️',
        bannerBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
      });
    }
    if (!addedCourseIds.has('crs_3') && recommendations.length < 3) {
      recommendations.push({
        id: 'crs_3',
        title: 'Data Structures & Algorithms Mastery',
        level: 'Intermediate',
        category: 'Computer Science',
        duration: '6 Weeks (15 Stepping Stones)',
        reason: `Essential computer science foundation for technical interviews and efficient code architecture.`,
        keyTopics: ['Big-O Notation', 'Trees & Graphs', 'Dynamic Programming', 'System Invariants'],
        actionableOutcome: 'Solve complex algorithmic challenges and optimize system runtime performance.',
        matchScore: 87,
        tag: 'Admin Verified Track',
        techLogo: '🧩',
        bannerBg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
      });
    }
  }

  return recommendations.slice(0, 4);
}

/**
 * Returns a precise suggested course for any individual skill gap and its level
 */
export function getSuggestedCourseForSpecificSkill(
  skillName: string,
  futureGoal: string,
  level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Intermediate'
): CourseRecommendation {
  const sLower = (skillName || '').toLowerCase().trim();

  // 1. Python, ML, Stats, Data Analysis, AI
  if (
    sLower.includes('python') ||
    sLower.includes('machine learning') ||
    sLower.includes('statistics') ||
    sLower.includes('deep learning') ||
    sLower.includes('neural') ||
    sLower.includes('data analysis') ||
    sLower.includes('visualization') ||
    sLower.includes('tensorflow') ||
    sLower.includes('pytorch') ||
    sLower.includes('mlops') ||
    sLower.includes('ai')
  ) {
    return {
      id: 'crs_1',
      title: 'Machine Learning Fundamentals & Neural Systems',
      level: sLower.includes('deep') || sLower.includes('mlops') ? 'Advanced' : 'Intermediate',
      category: 'AI & Machine Learning',
      duration: '6 Weeks (15 Stepping Stones)',
      reason: `Directly targets and bridges your specific skill gap in "${skillName}". Features curated video lectures, interactive flashcards, AI Mentor dialogue, and evaluated checkpoint gates.`,
      keyTopics: ['Core Foundations & Statistical Intuition', 'Model Optimization & Mechanics', 'Production Validation & Evaluation'],
      actionableOutcome: `Master ${skillName} with hands-on exercises and real-world project gates.`,
      matchScore: 99,
      tag: 'Admin Verified Track',
      techLogo: '🧠',
      bannerBg: 'linear-gradient(135deg, #FF6B35 0%, #D84A1B 50%, #992E0B 100%)',
    };
  }

  // 2. React, Web, Frontend, JavaScript, HTML, CSS, Node, Databases
  if (
    sLower.includes('react') ||
    sLower.includes('javascript') ||
    sLower.includes('html') ||
    sLower.includes('css') ||
    sLower.includes('node') ||
    sLower.includes('database') ||
    sLower.includes('sql') ||
    sLower.includes('frontend') ||
    sLower.includes('web') ||
    sLower.includes('full stack') ||
    sLower.includes('api') ||
    sLower.includes('solidity') ||
    sLower.includes('smart contract')
  ) {
    return {
      id: 'crs_2',
      title: 'Full-Stack Web Development with React',
      level: 'Intermediate',
      category: 'Web Development',
      duration: '8 Weeks (15 Stepping Stones)',
      reason: `Specifically targets your gap in "${skillName}" through structured hands-on components, architecture breakdowns, and live projects.`,
      keyTopics: ['Component State & Hooks Architecture', 'Full-Stack Integration with Node.js', 'Database Schema Modeling & APIs'],
      actionableOutcome: `Build and deploy production-grade software demonstrating mastery of ${skillName}.`,
      matchScore: 98,
      tag: 'Admin Verified Track',
      techLogo: '⚛️',
      bannerBg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #075985 100%)',
    };
  }

  // 3. Algorithms, Data Structures, Problem Solving, System Design, Big-O, C++
  if (
    sLower.includes('algorithm') ||
    sLower.includes('data structure') ||
    sLower.includes('problem solving') ||
    sLower.includes('system design') ||
    sLower.includes('big-o') ||
    sLower.includes('c++') ||
    sLower.includes('c#') ||
    sLower.includes('architecture pattern') ||
    sLower.includes('competitive')
  ) {
    return {
      id: 'crs_3',
      title: 'Data Structures & Algorithms Mastery',
      level: 'Intermediate',
      category: 'Computer Science',
      duration: '6 Weeks (15 Stepping Stones)',
      reason: `Directly builds your analytical ability and code efficiency in "${skillName}" through algorithm breakdowns and problem-solving gates.`,
      keyTopics: ['Big-O & Algorithmic Complexity', 'Trees, Graphs & Dynamic Programming', 'High-Scale System Invariants'],
      actionableOutcome: `Solve complex engineering problems and design optimal solutions for ${skillName}.`,
      matchScore: 97,
      tag: 'Admin Verified Track',
      techLogo: '🧩',
      bannerBg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
    };
  }

  // 4. Cloud, DevOps, Docker, K8s, Security, Linux
  if (
    sLower.includes('aws') ||
    sLower.includes('azure') ||
    sLower.includes('cloud') ||
    sLower.includes('docker') ||
    sLower.includes('kubernetes') ||
    sLower.includes('ci/cd') ||
    sLower.includes('linux') ||
    sLower.includes('security') ||
    sLower.includes('hacking') ||
    sLower.includes('network')
  ) {
    return {
      id: 'crs_cloud_ops',
      title: 'Cloud Infrastructure & DevSecOps Engineering',
      level: 'Intermediate',
      category: 'Cloud & Security',
      duration: '7 Weeks (15 Stepping Stones)',
      reason: `Eliminates your operational infrastructure gap in "${skillName}" through automated CI/CD and containerized environments.`,
      keyTopics: ['Docker & Container Orchestration', 'Automated CI/CD & Testing', 'Cloud Hardening & Security'],
      actionableOutcome: `Deploy, monitor, and scale secure infrastructure utilizing ${skillName}.`,
      matchScore: 96,
      tag: 'High Industry Demand',
      techLogo: '☁️',
      bannerBg: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
    };
  }

  // 5. Design, UX, UI, Figma
  if (
    sLower.includes('figma') ||
    sLower.includes('wireframing') ||
    sLower.includes('prototyping') ||
    sLower.includes('design') ||
    sLower.includes('ui') ||
    sLower.includes('ux') ||
    sLower.includes('photoshop') ||
    sLower.includes('branding')
  ) {
    return {
      id: 'crs_ui_ux',
      title: 'UI/UX Design Systems & Product Strategy',
      level: 'Beginner',
      category: 'Design & Creative',
      duration: '5 Weeks (15 Stepping Stones)',
      reason: `Bridges your user experience and visual design gap in "${skillName}" with structured layout principles and prototypes.`,
      keyTopics: ['Figma Component Architecture', 'User Journey Mapping', 'Interactive Prototyping & Usability'],
      actionableOutcome: `Create functional design systems and interactive interfaces utilizing ${skillName}.`,
      matchScore: 95,
      tag: 'Creative Track',
      techLogo: '🎨',
      bannerBg: 'linear-gradient(135deg, #db2777 0%, #be185d 50%, #9d174d 100%)',
    };
  }

  // Default fallback (e.g. for general business, management, communication)
  return {
    id: 'crs_3',
    title: 'Data Structures & Algorithms Mastery',
    level: level,
    category: 'Computer Science',
    duration: '6 Weeks (15 Stepping Stones)',
    reason: `Recommended foundation track to build core technical and structural competencies related to "${skillName}".`,
    keyTopics: ['Algorithmic Thinking', 'Step-by-Step Logic & Invariants', 'Structured Problem Resolution'],
    actionableOutcome: `Gain structural confidence and systematic execution skills for ${skillName}.`,
    matchScore: 92,
    tag: 'Admin Verified Track',
    techLogo: '🧩',
    bannerBg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
  };
}
