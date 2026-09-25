/**
 * Mentora Career Roles & Required Skills Dataset
 * Ground truth training dataset mapping 50 industry career roles to their required prerequisite skillsets.
 */

export interface CareerRoleRecord {
  srNo: number;
  name: string;
  futureGoal: string;
  skillsNeeded: string[];
  category: 'AI & Data' | 'Engineering' | 'Design & Creative' | 'Cloud & Security' | 'Business & Management' | 'Professional & Services';
}

export const CAREER_ROLES_DATASET: CareerRoleRecord[] = [
  {
    srNo: 1,
    name: 'Aarav Sharma',
    futureGoal: 'Data Scientist',
    skillsNeeded: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Data Visualization'],
    category: 'AI & Data',
  },
  {
    srNo: 2,
    name: 'Ananya Verma',
    futureGoal: 'UI/UX Designer',
    skillsNeeded: ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Thinking'],
    category: 'Design & Creative',
  },
  {
    srNo: 3,
    name: 'Rohan Mehta',
    futureGoal: 'Cybersecurity Analyst',
    skillsNeeded: ['Network Security', 'Ethical Hacking', 'SIEM', 'Linux', 'Cryptography'],
    category: 'Cloud & Security',
  },
  {
    srNo: 4,
    name: 'Priya Singh',
    futureGoal: 'Digital Marketing Manager',
    skillsNeeded: ['SEO', 'SEM', 'Social Media Marketing', 'Analytics', 'Content Strategy'],
    category: 'Business & Management',
  },
  {
    srNo: 5,
    name: 'Aditya Kumar',
    futureGoal: 'Cloud Engineer',
    skillsNeeded: ['AWS', 'Azure', 'Linux', 'Networking', 'Docker', 'Kubernetes'],
    category: 'Cloud & Security',
  },
  {
    srNo: 6,
    name: 'Sneha Gupta',
    futureGoal: 'Human Resources Manager',
    skillsNeeded: ['Recruitment', 'Employee Relations', 'HR Analytics', 'Communication', 'Leadership'],
    category: 'Business & Management',
  },
  {
    srNo: 7,
    name: 'Arjun Patel',
    futureGoal: 'Full Stack Developer',
    skillsNeeded: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Databases'],
    category: 'Engineering',
  },
  {
    srNo: 8,
    name: 'Isha Nair',
    futureGoal: 'Financial Analyst',
    skillsNeeded: ['Financial Modeling', 'Excel', 'Accounting', 'Data Analysis', 'Forecasting'],
    category: 'Business & Management',
  },
  {
    srNo: 9,
    name: 'Rahul Joshi',
    futureGoal: 'Product Manager',
    skillsNeeded: ['Product Strategy', 'Market Research', 'Agile', 'Communication', 'Leadership'],
    category: 'Business & Management',
  },
  {
    srNo: 10,
    name: 'Kavya Rao',
    futureGoal: 'Graphic Designer',
    skillsNeeded: ['Photoshop', 'Illustrator', 'Typography', 'Branding', 'Visual Design'],
    category: 'Design & Creative',
  },
  {
    srNo: 11,
    name: 'Vikram Shah',
    futureGoal: 'Machine Learning Engineer',
    skillsNeeded: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'MLOps'],
    category: 'AI & Data',
  },
  {
    srNo: 12,
    name: 'Meera Iyer',
    futureGoal: 'Content Strategist',
    skillsNeeded: ['Content Planning', 'SEO', 'Copywriting', 'Analytics', 'Storytelling'],
    category: 'Business & Management',
  },
  {
    srNo: 13,
    name: 'Karan Malhotra',
    futureGoal: 'DevOps Engineer',
    skillsNeeded: ['CI/CD', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Cloud Computing'],
    category: 'Cloud & Security',
  },
  {
    srNo: 14,
    name: 'Simran Kaur',
    futureGoal: 'Teacher / Educator',
    skillsNeeded: ['Lesson Planning', 'Communication', 'Classroom Management', 'Digital Teaching'],
    category: 'Professional & Services',
  },
  {
    srNo: 15,
    name: 'Yash Thakur',
    futureGoal: 'Mobile App Developer',
    skillsNeeded: ['Flutter', 'Dart', 'Android', 'APIs', 'Firebase', 'UI Development'],
    category: 'Engineering',
  },
  {
    srNo: 16,
    name: 'Neha Kapoor',
    futureGoal: 'Business Analyst',
    skillsNeeded: ['Requirement Analysis', 'SQL', 'Excel', 'Power BI', 'Communication'],
    category: 'Business & Management',
  },
  {
    srNo: 17,
    name: 'Siddharth Jain',
    futureGoal: 'Robotics Engineer',
    skillsNeeded: ['Robotics', 'Python', 'C++', 'Sensors', 'ROS', 'Control Systems'],
    category: 'Engineering',
  },
  {
    srNo: 18,
    name: 'Riya Das',
    futureGoal: 'Event Manager',
    skillsNeeded: ['Event Planning', 'Budgeting', 'Vendor Management', 'Communication', 'Leadership'],
    category: 'Business & Management',
  },
  {
    srNo: 19,
    name: 'Manish Gupta',
    futureGoal: 'Database Administrator',
    skillsNeeded: ['SQL', 'Database Management', 'Backup & Recovery', 'Security', 'Performance Tuning'],
    category: 'Engineering',
  },
  {
    srNo: 20,
    name: 'Pooja Mishra',
    futureGoal: 'Public Relations Specialist',
    skillsNeeded: ['Media Relations', 'Communication', 'Press Releases', 'Crisis Management', 'Networking'],
    category: 'Business & Management',
  },
  {
    srNo: 21,
    name: 'Dev Agarwal',
    futureGoal: 'Blockchain Developer',
    skillsNeeded: ['Solidity', 'Blockchain', 'Smart Contracts', 'Web3', 'Cryptography'],
    category: 'Engineering',
  },
  {
    srNo: 22,
    name: 'Tanvi Shah',
    futureGoal: 'Fashion Designer',
    skillsNeeded: ['Fashion Illustration', 'Textile Knowledge', 'Pattern Making', 'Creativity', 'Trend Analysis'],
    category: 'Design & Creative',
  },
  {
    srNo: 23,
    name: 'Nikhil Bansal',
    futureGoal: 'Software Architect',
    skillsNeeded: ['System Design', 'Cloud Architecture', 'APIs', 'Databases', 'Design Patterns'],
    category: 'Engineering',
  },
  {
    srNo: 24,
    name: 'Aditi Roy',
    futureGoal: 'Psychologist',
    skillsNeeded: ['Counseling', 'Communication', 'Psychological Assessment', 'Research', 'Empathy'],
    category: 'Professional & Services',
  },
  {
    srNo: 25,
    name: 'Harsh Vardhan',
    futureGoal: 'AI Research Scientist',
    skillsNeeded: ['Python', 'Mathematics', 'Machine Learning', 'Deep Learning', 'Research Methodology'],
    category: 'AI & Data',
  },
  {
    srNo: 26,
    name: 'Muskan Sethi',
    futureGoal: 'Financial Advisor',
    skillsNeeded: ['Investment Planning', 'Financial Analysis', 'Risk Management', 'Communication'],
    category: 'Business & Management',
  },
  {
    srNo: 27,
    name: 'Abhishek Verma',
    futureGoal: 'Game Developer',
    skillsNeeded: ['Unity', 'C#', 'Game Physics', '3D Modeling', 'Game Design'],
    category: 'Engineering',
  },
  {
    srNo: 28,
    name: 'Nandini Kulkarni',
    futureGoal: 'Project Manager',
    skillsNeeded: ['Project Planning', 'Agile', 'Risk Management', 'Budgeting', 'Leadership'],
    category: 'Business & Management',
  },
  {
    srNo: 29,
    name: 'Raj Malhotra',
    futureGoal: 'Mechanical Engineer',
    skillsNeeded: ['CAD', 'Thermodynamics', 'Manufacturing', 'Materials Science', 'Problem Solving'],
    category: 'Engineering',
  },
  {
    srNo: 30,
    name: 'Shruti Menon',
    futureGoal: 'Journalist',
    skillsNeeded: ['Research', 'Writing', 'Interviewing', 'News Analysis', 'Communication'],
    category: 'Professional & Services',
  },
  {
    srNo: 31,
    name: 'Aman Saxena',
    futureGoal: 'Solutions Architect',
    skillsNeeded: ['System Design', 'Cloud', 'Networking', 'APIs', 'Security', 'Architecture Patterns'],
    category: 'Engineering',
  },
  {
    srNo: 32,
    name: 'Diya Chatterjee',
    futureGoal: 'Interior Designer',
    skillsNeeded: ['AutoCAD', '3D Modeling', 'Space Planning', 'Color Theory', 'Creativity'],
    category: 'Design & Creative',
  },
  {
    srNo: 33,
    name: 'Saurabh Yadav',
    futureGoal: 'Data Engineer',
    skillsNeeded: ['Python', 'SQL', 'ETL', 'Apache Spark', 'Data Warehousing', 'Cloud'],
    category: 'AI & Data',
  },
  {
    srNo: 34,
    name: 'Ritika Arora',
    futureGoal: 'Operations Manager',
    skillsNeeded: ['Operations Planning', 'Supply Chain', 'Process Optimization', 'Leadership', 'Analytics'],
    category: 'Business & Management',
  },
  {
    srNo: 35,
    name: 'Mohit Tiwari',
    futureGoal: 'Electrical Engineer',
    skillsNeeded: ['Circuit Design', 'MATLAB', 'Power Systems', 'Control Systems', 'Electronics'],
    category: 'Engineering',
  },
  {
    srNo: 36,
    name: 'Sakshi Kapoor',
    futureGoal: 'Social Media Manager',
    skillsNeeded: ['Social Media Strategy', 'Content Creation', 'Analytics', 'Branding', 'Copywriting'],
    category: 'Business & Management',
  },
  {
    srNo: 37,
    name: 'Varun Reddy',
    futureGoal: 'Game Designer',
    skillsNeeded: ['Game Mechanics', 'Level Design', 'Storytelling', 'UX', 'Game Testing'],
    category: 'Design & Creative',
  },
  {
    srNo: 38,
    name: 'Ishita Bose',
    futureGoal: 'Legal Consultant',
    skillsNeeded: ['Legal Research', 'Contract Analysis', 'Communication', 'Negotiation', 'Documentation'],
    category: 'Professional & Services',
  },
  {
    srNo: 39,
    name: 'Ankit Choudhary',
    futureGoal: 'Network Engineer',
    skillsNeeded: ['Networking', 'TCP/IP', 'Routing', 'Switching', 'Firewalls', 'Network Security'],
    category: 'Cloud & Security',
  },
  {
    srNo: 40,
    name: 'Shreya Pandey',
    futureGoal: 'Healthcare Administrator',
    skillsNeeded: ['Healthcare Operations', 'Administration', 'Communication', 'Budgeting', 'Data Management'],
    category: 'Professional & Services',
  },
  {
    srNo: 41,
    name: 'Tushar Singh',
    futureGoal: 'DevSecOps Engineer',
    skillsNeeded: ['DevOps', 'Cybersecurity', 'CI/CD', 'Cloud Security', 'Docker', 'Kubernetes'],
    category: 'Cloud & Security',
  },
  {
    srNo: 42,
    name: 'Radhika Jain',
    futureGoal: 'Architect',
    skillsNeeded: ['AutoCAD', 'Revit', '3D Modeling', 'Structural Concepts', 'Design', 'Project Planning'],
    category: 'Design & Creative',
  },
  {
    srNo: 43,
    name: 'Sameer Khan',
    futureGoal: 'Supply Chain Manager',
    skillsNeeded: ['Logistics', 'Inventory Management', 'Procurement', 'Excel', 'Data Analytics'],
    category: 'Business & Management',
  },
  {
    srNo: 44,
    name: 'Palak Agarwal',
    futureGoal: 'Professional Photographer',
    skillsNeeded: ['Photography', 'Lighting', 'Adobe Lightroom', 'Composition', 'Photo Editing'],
    category: 'Design & Creative',
  },
  {
    srNo: 45,
    name: 'Deepak Kumar',
    futureGoal: 'Automotive Engineer',
    skillsNeeded: ['Automotive Design', 'CAD', 'Vehicle Dynamics', 'Manufacturing', 'Electronics'],
    category: 'Engineering',
  },
  {
    srNo: 46,
    name: 'Ayesha Khan',
    futureGoal: 'Entrepreneur',
    skillsNeeded: ['Business Strategy', 'Finance', 'Marketing', 'Leadership', 'Negotiation', 'Networking'],
    category: 'Business & Management',
  },
  {
    srNo: 47,
    name: 'Rohit Sinha',
    futureGoal: 'Film Director',
    skillsNeeded: ['Storytelling', 'Cinematography', 'Scriptwriting', 'Team Management', 'Film Production'],
    category: 'Design & Creative',
  },
  {
    srNo: 48,
    name: 'Komal Joshi',
    futureGoal: 'Nutritionist',
    skillsNeeded: ['Nutrition Science', 'Diet Planning', 'Health Assessment', 'Communication', 'Research'],
    category: 'Professional & Services',
  },
  {
    srNo: 49,
    name: 'Abhinav Mishra',
    futureGoal: 'Technical Writer',
    skillsNeeded: ['Technical Writing', 'Documentation', 'Research', 'Communication', 'Markdown'],
    category: 'Professional & Services',
  },
  {
    srNo: 50,
    name: 'Mansi Desai',
    futureGoal: 'Environmental Consultant',
    skillsNeeded: ['Environmental Science', 'Sustainability', 'Data Analysis', 'GIS', 'Environmental Regulations'],
    category: 'Professional & Services',
  },
];

// Deduplicated list of all skills across the 50 dataset roles
const RAW_SKILLS_SET = new Set<string>();
CAREER_ROLES_DATASET.forEach((role) => {
  role.skillsNeeded.forEach((s) => RAW_SKILLS_SET.add(s.trim()));
});

// Complement with standard industry tech skills commonly encountered in CVs
const COMPLEMENTARY_TECH_SKILLS = [
  'TypeScript', 'Next.js', 'FastAPI', 'PyTorch', 'TensorFlow', 'PostgreSQL', 'MongoDB',
  'GraphQL', 'Tailwind CSS', 'Redux', 'LangChain', 'CrewAI', 'Agentic AI', 'Prompt Engineering',
  'Vector Databases', 'REST APIs', 'Microservices', 'Linux', 'Git', 'CI/CD'
];
COMPLEMENTARY_TECH_SKILLS.forEach((s) => RAW_SKILLS_SET.add(s));

export const ALL_DATASET_SKILLS: string[] = Array.from(RAW_SKILLS_SET).sort();

/**
 * Common skill aliases mapping for CV extraction (e.g. k8s -> Kubernetes, py -> Python)
 */
export const SKILL_ALIASES: Record<string, string> = {
  'py': 'Python',
  'python3': 'Python',
  'js': 'JavaScript',
  'ts': 'TypeScript',
  'reactjs': 'React',
  'react.js': 'React',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'k8s': 'Kubernetes',
  'postgres': 'Databases',
  'postgresql': 'Databases',
  'mongo': 'Databases',
  'mongodb': 'Databases',
  'sql server': 'SQL',
  'mysql': 'SQL',
  'tf': 'TensorFlow',
  'ai': 'Machine Learning',
  'ai/ml': 'Machine Learning',
  'ml': 'Machine Learning',
  'dl': 'Deep Learning',
  'cv/ml': 'Machine Learning',
  'nlp': 'Machine Learning',
  'llm': 'Machine Learning',
  'llms': 'Machine Learning',
  'prompt': 'Prompt Engineering',
  'langchain': 'LangChain',
  'crewai': 'CrewAI',
  'agentic': 'Agentic AI',
  'docker': 'Docker',
  'aws': 'AWS',
  'azure': 'Azure',
  'gcp': 'Cloud',
  'git': 'Git',
  'github': 'Git',
  'ui/ux': 'UI/UX Designer',
  'figma': 'Figma',
  'photoshop': 'Photoshop',
  'excel': 'Excel',
  'power bi': 'Power BI',
  'powerbi': 'Power BI',
  'rest': 'APIs',
  'restful': 'APIs',
  'rest apis': 'APIs',
  'api': 'APIs',
  'dsa': 'Problem Solving',
};

/**
 * Fast CV / Resume Skill Extractor
 * Matches words and keyphrases from user document against the dataset ontology
 */
export function extractSkillsFromCV(cvText: string): string[] {
  if (!cvText || typeof cvText !== 'string') return [];
  const textLower = ` ${cvText.toLowerCase().replace(/[^a-z0-9+#./\s-]/g, ' ')} `;
  const detected = new Set<string>();

  // 1. Direct match for each skill in ALL_DATASET_SKILLS
  for (const skill of ALL_DATASET_SKILLS) {
    const sLower = skill.toLowerCase();
    // Use word boundary check
    const regex = new RegExp(`(?:^|[\\s,;()/\\[\\]{}:.-])${escapeRegExp(sLower)}(?:$|[\\s,;()/\\[\\]{}:.-])`, 'i');
    if (regex.test(textLower)) {
      detected.add(skill);
    }
  }

  // 2. Check aliases
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    const regex = new RegExp(`(?:^|[\\s,;()/\\[\\]{}:.-])${escapeRegExp(alias)}(?:$|[\\s,;()/\\[\\]{}:.-])`, 'i');
    if (regex.test(textLower)) {
      detected.add(canonical);
    }
  }

  return Array.from(detected);
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Lookup required skills for any given target goal
 */
export function getRequiredSkillsForGoal(targetGoal: string): string[] {
  if (!targetGoal) return [];
  const cleanGoal = targetGoal.trim().toLowerCase();

  // 1. Exact match in dataset
  const exact = CAREER_ROLES_DATASET.find(
    (r) => r.futureGoal.toLowerCase() === cleanGoal
  );
  if (exact) return [...exact.skillsNeeded];

  // 2. Partial match
  const partial = CAREER_ROLES_DATASET.find(
    (r) => r.futureGoal.toLowerCase().includes(cleanGoal) || cleanGoal.includes(r.futureGoal.toLowerCase())
  );
  if (partial) return [...partial.skillsNeeded];

  // 3. Fallback for custom tech or general goals
  if (cleanGoal.includes('ai') || cleanGoal.includes('ml') || cleanGoal.includes('machine learning')) {
    return ['Python', 'Machine Learning', 'Deep Learning', 'Statistics', 'Model Evaluation'];
  }
  if (cleanGoal.includes('web') || cleanGoal.includes('frontend') || cleanGoal.includes('full stack')) {
    return ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Databases'];
  }
  if (cleanGoal.includes('cloud') || cleanGoal.includes('devops')) {
    return ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'];
  }
  if (cleanGoal.includes('data') || cleanGoal.includes('analyst')) {
    return ['SQL', 'Python', 'Excel', 'Data Analysis', 'Data Visualization'];
  }
  if (cleanGoal.includes('design') || cleanGoal.includes('ui') || cleanGoal.includes('ux')) {
    return ['Figma', 'Wireframing', 'Prototyping', 'User Research', 'Design Thinking'];
  }

  return ['Problem Solving', 'Communication', 'Technical Strategy', 'Project Planning', 'Domain Knowledge'];
}

/**
 * Predicts skill gaps: requiredSkills - possessedSkills
 */
export function calculateSkillGap(
  possessedSkills: string[],
  targetGoal: string
): {
  requiredSkills: string[];
  possessedMatches: string[];
  missingSkills: string[];
  matchPercentage: number;
} {
  const required = getRequiredSkillsForGoal(targetGoal);
  const possessedLower = new Set((possessedSkills || []).map((s) => s.trim().toLowerCase()));

  const possessedMatches: string[] = [];
  const missingSkills: string[] = [];

  required.forEach((skill) => {
    if (possessedLower.has(skill.toLowerCase())) {
      possessedMatches.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const total = required.length;
  const matchPercentage = total > 0 ? Math.round((possessedMatches.length / total) * 100) : 100;

  return {
    requiredSkills: required,
    possessedMatches,
    missingSkills,
    matchPercentage,
  };
}
