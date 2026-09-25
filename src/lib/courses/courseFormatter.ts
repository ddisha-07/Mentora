import { calculateCourseDuration } from './progressEngine';

export interface PredefinedCourse {
  id: string;
  title: string;
  level: string;
  duration: string;
  rating: number;
  students: string;
  color: string;
  tag: string;
  tagBg: string;
  author: string;
  category: string;
  techLogo: string;
  bannerBg: string;
  bannerText: string;
  illustrationType: 'typescript' | 'docker' | 'graphql' | 'redis' | 'microservices' | 'general';
  thumbnail?: string;
  hasCustomThumbnail?: boolean;
  description: string;
  reason?: string;
  keyTopics: string[];
  modulesCount: number;
  modules: any[];
  status: string;
  updatedAt?: string;
  rawCourse: any;
}

const GRADIENTS = [
  'linear-gradient(135deg, #c2410c 0%, #ea580c 45%, #fb923c 100%)',
  'linear-gradient(135deg, #0f766e 0%, #14b8a6 45%, #2dd4bf 100%)',
  'linear-gradient(135deg, #312e81 0%, #4338ca 45%, #6366f1 100%)',
  'linear-gradient(135deg, #a16207 0%, #ca8a04 45%, #fde047 100%)',
  'linear-gradient(135deg, #581c87 0%, #7e22ce 45%, #a855f7 100%)',
  'linear-gradient(135deg, #991b1b 0%, #dc2626 45%, #f87171 100%)',
];

export function getIllustrationInfo(title = '', category = ''): {
  illustrationType: 'typescript' | 'docker' | 'graphql' | 'redis' | 'microservices' | 'general';
  techLogo: string;
} {
  const text = `${title} ${category}`.toLowerCase();

  if (text.includes('type') || text.includes('script') || text.includes('frontend') || text.includes('react') || text.includes('next')) {
    return { illustrationType: 'typescript', techLogo: 'TS' };
  }
  if (text.includes('docker') || text.includes('kubernetes') || text.includes('k8s') || text.includes('container') || text.includes('cloud')) {
    return { illustrationType: 'docker', techLogo: '🐳' };
  }
  if (text.includes('graph') || text.includes('rest') || text.includes('api')) {
    return { illustrationType: 'graphql', techLogo: 'API' };
  }
  if (text.includes('redis') || text.includes('sql') || text.includes('postgres') || text.includes('database') || text.includes('data structure')) {
    return { illustrationType: 'redis', techLogo: '💾' };
  }
  if (text.includes('microservice') || text.includes('distributed') || text.includes('system') || text.includes('devops')) {
    return { illustrationType: 'microservices', techLogo: '⚙️' };
  }
  if (text.includes('ai') || text.includes('machine learning') || text.includes('neural') || text.includes('deep learning') || text.includes('gpt')) {
    return { illustrationType: 'general', techLogo: '🧠' };
  }

  return { illustrationType: 'general', techLogo: '⚡' };
}

export function getTechDetails(title = '', category = ''): {
  techLogo: string;
  techIcon: string;
  techGradient: string;
  techTextColor: string;
} {
  const text = `${title} ${category}`.toLowerCase();
  if (text.includes('node') || text.includes('express') || text.includes('rest api') || text.includes('backend api') || text.includes('rest')) {
    return {
      techLogo: 'NODE.JS',
      techIcon: '⚙️',
      techGradient: 'linear-gradient(135deg, #1a2a3a, #0f1c2a)',
      techTextColor: '#93c5fd',
    };
  }
  if (text.includes('type') || text.includes('script') || text.includes('react') || text.includes('frontend') || text.includes('next')) {
    return {
      techLogo: 'TYPESCRIPT',
      techIcon: '👾',
      techGradient: 'linear-gradient(135deg, #172554, #0f172a)',
      techTextColor: '#38bdf8',
    };
  }
  if (text.includes('python')) {
    return {
      techLogo: 'PYTHON',
      techIcon: '🐍',
      techGradient: 'linear-gradient(135deg, #2e2608, #181404)',
      techTextColor: '#facc15',
    };
  }
  if (text.includes('ai') || text.includes('machine learning') || text.includes('llm') || text.includes('neural') || text.includes('deep learning')) {
    return {
      techLogo: 'AI / ML',
      techIcon: '🧠',
      techGradient: 'linear-gradient(135deg, #3b0764, #1e0338)',
      techTextColor: '#c084fc',
    };
  }
  if (text.includes('postgres') || text.includes('sql') || text.includes('database') || text.includes('redis')) {
    return {
      techLogo: 'POSTGRES',
      techIcon: '💾',
      techGradient: 'linear-gradient(135deg, #064e3b, #022c22)',
      techTextColor: '#34d399',
    };
  }
  if (text.includes('docker') || text.includes('k8s') || text.includes('kubernetes') || text.includes('cloud') || text.includes('aws')) {
    return {
      techLogo: 'CLOUD / K8S',
      techIcon: '☸️',
      techGradient: 'linear-gradient(135deg, #0c4a6e, #082f49)',
      techTextColor: '#38bdf8',
    };
  }
  return {
    techLogo: 'MENTORA',
    techIcon: '⚡',
    techGradient: 'linear-gradient(135deg, #431407, #1c0702)',
    techTextColor: '#fb923c',
  };
}

export function formatAdminCourseForDisplay(raw: any, index: number = 0): PredefinedCourse {
  const title = (raw?.title || 'Untitled Track').trim();
  const category = (raw?.category || 'General').trim();
  const description = (raw?.description || 'Master real-world skills, architecture patterns, and verified milestone gates with Mentora.').trim();

  const { illustrationType, techLogo } = getIllustrationInfo(title, category);

  // Parse enrolled count
  let studentsFormatted = '1.2k';
  if (typeof raw?.enrolled === 'number') {
    if (raw.enrolled >= 1000) {
      studentsFormatted = `${(raw.enrolled / 1000).toFixed(1)}k`;
    } else {
      studentsFormatted = `${raw.enrolled}`;
    }
  } else if (typeof raw?.students === 'string') {
    studentsFormatted = raw.students;
  }

  // Modules count and extract key topics
  const modules = Array.isArray(raw?.modules) ? raw.modules : [];
  const modulesCount = modules.length;

  let keyTopics: string[] = [];
  if (modules.length > 0) {
    keyTopics = modules
      .map((m: any) => m?.title || '')
      .filter((t: string) => Boolean(t.trim()))
      .slice(0, 3);
  }

  if (keyTopics.length === 0) {
    if (category.toLowerCase().includes('ai')) {
      keyTopics = ['Core Foundations', 'Neural Models', 'Production Tuning'];
    } else if (category.toLowerCase().includes('web') || category.toLowerCase().includes('react')) {
      keyTopics = ['Component State', 'API Integration', 'Performance Audit'];
    } else {
      keyTopics = ['Foundations', 'Implementation', 'Pass Gate Quiz'];
    }
  }

  // Duration formatting with literal calculation
  const duration = calculateCourseDuration({ modules, duration: raw?.duration }).formatted;

  // Banner background
  const bannerBg = raw?.bannerBg || (
    raw?.coverColor
      ? `linear-gradient(135deg, ${raw.coverColor} 0%, #1c1917 100%)`
      : GRADIENTS[index % GRADIENTS.length]
  );

  const bannerText = (title || 'MENTORA COURSE').toUpperCase();

  const author = typeof raw?.instructor === 'object' && raw?.instructor?.name
    ? raw.instructor.name
    : typeof raw?.instructor === 'string' && raw.instructor.trim()
    ? raw.instructor
    : raw?.author || 'Mentora Faculty';

  return {
    id: String(raw?.id || `crs_${index + 1}`),
    title,
    level: raw?.level || 'Beginner',
    duration,
    rating: typeof raw?.rating === 'number' ? raw.rating : 4.9,
    students: studentsFormatted,
    color: raw?.coverColor || '#FF6B35',
    tag: raw?.level || category || 'Curated',
    tagBg: raw?.coverColor || '#0084FF',
    author,
    category,
    techLogo,
    bannerBg,
    bannerText,
    illustrationType,
    thumbnail: raw?.thumbnail?.trim() || undefined,
    hasCustomThumbnail: Boolean(raw?.thumbnail && typeof raw.thumbnail === 'string' && raw.thumbnail.startsWith('http')),
    description,
    reason: raw?.reason || (description.length > 90 ? `${description.slice(0, 88)}...` : description),
    keyTopics,
    modulesCount,
    modules,
    status: raw?.status || 'Published',
    updatedAt: raw?.updatedAt,
    rawCourse: raw,
  };
}
