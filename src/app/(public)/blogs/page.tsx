import React from 'react';
import Link from 'next/link';

export default function BlogsPage() {
  const articles = [
    {
      id: 1,
      category: 'Engineering & Cognitive Science',
      title: 'Why Level-Gated Progression Beats Infinite Video Libraries',
      description:
        'Prerequisite enforcement prevents cognitive overload and activates dopamine feedback loops when unlocking advanced specializations.',
      readTime: '5 min read',
      date: 'Sept 2026',
    },
    {
      id: 2,
      category: 'Curriculum Design',
      title: 'The Math Behind Algorithmic Skill-Gap Prediction',
      description:
        'How we compute set differences between developer competency profiles and job market demand to generate 3-level personalized roadmaps.',
      readTime: '8 min read',
      date: 'Aug 2026',
    },
    {
      id: 3,
      category: 'Credentialing',
      title: 'Why Multiple-Choice Quizzes Need a 70% Mastery Standard',
      description:
        'Eliminating superficial completion badges in favor of verified competence and competitive leaderboard standing.',
      readTime: '4 min read',
      date: 'July 2026',
    },
  ];

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-800/60">
          Articles & Research
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Mentora Insights
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
          Deep dives into adaptive learning architectures, cognitive retention, and verifiable professional credentialing.
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-indigo-400 uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-slate-500">{article.readTime} • {article.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
              {article.title}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {article.description}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read Full Article →
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
