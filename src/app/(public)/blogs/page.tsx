'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  X,
  ArrowUpRight,
  BookOpen,
  Clock,
  Calendar,
  Sparkles,
  Share2,
  CheckCircle2,
  Filter,
  Layers,
  Terminal,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface Article {
  id: number;
  num: string;
  category: 'Pedagogy' | 'Algorithms' | 'Credentials' | 'AI Systems';
  tabLabel: string;
  subTabLabel: string;
  tabPosition: 'left' | 'right';
  theme: 'dark-charcoal' | 'warm-amber' | 'deep-espresso' | 'warm-parchment';
  primaryTabColor: string;
  date: string;
  readTime: string;
  title: string;
  kicker: string;
  synopsis: string;
  tags: string[];
  takeaways: string[];
  fullBody: string[];
}

export default function BlogsPage() {
  const { isBright } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const articles: Article[] = [
    {
      id: 1,
      num: '01',
      category: 'Pedagogy',
      tabLabel: 'ARTICLE 01',
      subTabLabel: 'PEDAGOGY & SYSTEMS',
      tabPosition: 'left',
      theme: 'dark-charcoal',
      primaryTabColor: '#2563EB', // Cobalt Blue like in reference Card 1
      date: 'SEP 14, 2026',
      readTime: '6 MIN READ',
      title: 'Level-Gated Progression',
      kicker: 'COGNITIVE SCAFFOLDING & PEDAGOGY',
      synopsis:
        'Why structured prerequisite gates beat infinite, unguided video libraries every single time. Scaffolding knowledge eliminates cognitive fatigue and accelerates retention.',
      tags: ['#Pedagogy', '#CognitiveLoad', '#ActiveRecall', '#Gamification'],
      takeaways: [
        'Unguided libraries lead to passive bingeing without durable memory formation.',
        'Prerequisite gating forces mastery of fundamental mental models before unlocking abstractions.',
        'Immediate diagnostic feedback creates rapid dopamine loops that build consistency.'
      ],
      fullBody: [
        'Modern professionals are drowning in course catalogs. When given a library with 8,000 video lectures, the paradox of choice creates immediate cognitive friction. Learners skip fundamentals to watch trendy topics, accumulate fragmented understanding, and abandon the roadmap after two weeks.',
        'At Mentora, we adopted a level-gated progression architecture inspired by game loop design and Vygotsky’s Zone of Proximal Development. You cannot unlock distributed consensus until you have proven active recall mastery of local concurrency primitives.',
        'By enforcing strict prerequisite gates, we reduce cognitive overwhelm to zero. Every session has exactly one next step, calibrated to your current edge of competence.'
      ]
    },
    {
      id: 2,
      num: '02',
      category: 'Algorithms',
      tabLabel: 'ARTICLE 02',
      subTabLabel: 'ALGORITHMIC ENGINE',
      tabPosition: 'right',
      theme: 'warm-amber',
      primaryTabColor: '#F59E0B', // Warm Golden Amber like in reference Card 2
      date: 'AUG 28, 2026',
      readTime: '8 MIN READ',
      title: 'Skill-Gap Diagnostics',
      kicker: 'VECTOR EMBEDDINGS & MARKET DIFFING',
      synopsis:
        'Getting a new engineer from day one to shipping without the panic. Computing real-time weighted set differences between your current competency matrix and production standards.',
      tags: ['#VectorEmbeddings', '#SkillMatrix', '#CareerMapping', '#Algorithms'],
      takeaways: [
        'Skills are not binary keywords; they are high-dimensional competency vectors.',
        'Weighted set differences reveal the high-leverage 20% of skills that unlock 80% of job requirements.',
        'Continuous calibration prevents engineers from wasting time over-learning commoditized skills.'
      ],
      fullBody: [
        'Traditional job descriptions list 30 disconnected bullet points. An engineer sees "Kubernetes, Go, Kafka, React" and assumes they must master everything simultaneously.',
        'Our diagnostic engine parses live engineering hiring bars, production incident post-mortems, and codebase archetypes into a multi-dimensional graph. When you complete a diagnostic drill, Mentora plots your vectors against target role archetypes.',
        'The output is a surgical delta: instead of telling you to "learn backend", it prescribes three 6-minute drills on idempotency keys and retry storms.'
      ]
    },
    {
      id: 3,
      num: '03',
      category: 'Credentials',
      tabLabel: 'ARTICLE 03',
      subTabLabel: 'PROOF-OF-WORK',
      tabPosition: 'left',
      theme: 'deep-espresso',
      primaryTabColor: '#EA580C', // Mentora Signature Flame Orange
      date: 'AUG 12, 2026',
      readTime: '5 MIN READ',
      title: 'The 70% Mastery Standard',
      kicker: 'VERIFIABLE SKILL CREDENTIALING',
      synopsis:
        'Eliminating participation trophies in favor of verifiable skill passports. Why genuine professional advancement requires non-trivial scenario assessments and peer-audited proof.',
      tags: ['#ProofOfWork', '#SkillPassport', '#Assessments', '#Mastery'],
      takeaways: [
        'Video completion certificates have zero hiring credibility in technical markets.',
        'A 70% evaluation threshold on randomized failure scenarios validates actual problem-solving intuition.',
        'Skill Passports are cryptographically signed, verifiable by hiring leads with one click.'
      ],
      fullBody: [
        'If everyone gets a certificate simply by playing a video at 2x speed in a background tab, the certificate becomes worthless. Engineering teams know this, which is why resumes covered in course badges are routinely ignored.',
        'Mentora credentials operate on a strict proof-of-work principle. To earn a verified passport stamp in Kafka Architecture, you must troubleshoot a simulated broker partition under memory pressure.',
        'Only when you score above 70% in execution correctness is the cryptographic credential issued to your public portfolio.'
      ]
    },
    {
      id: 4,
      num: '04',
      category: 'AI Systems',
      tabLabel: 'ARTICLE 04',
      subTabLabel: 'AI ARCHITECTURE',
      tabPosition: 'right',
      theme: 'warm-parchment',
      primaryTabColor: '#D97706', // Ochre / Deep Amber
      date: 'JUL 30, 2026',
      readTime: '7 MIN READ',
      title: 'Contextual AI Companion',
      kicker: 'SOCRATIC PROMPTING & DEEP RECALL',
      synopsis:
        'How fine-tuned LLMs analyze code bottlenecks in real-time without giving away the answer. Teaching engineers how to think, unblock themselves, and build lasting intuition.',
      tags: ['#ArtificialIntelligence', '#LLMs', '#SocraticTutoring', '#CodeReview'],
      takeaways: [
        'Copilots that give away answers cripple long-term problem-solving ability.',
        'Socratic prompting guides the learner to discover the root cause themselves.',
        'Inline contextual diffs train the brain to spot architectural smells before running code.'
      ],
      fullBody: [
        'AI coding assistants that automatically paste the solution have created an illusion of competence. When the model goes away or an unprecedented production bug appears, engineers find themselves helpless.',
        'Mentora’s AI companion is deliberately constrained by Socratic heuristics. If your database query causes an N+1 cascade, it doesn’t rewrite your query. It highlights the execution plan and asks: "Notice the query count in the inner loop. How could a single batch join change the latency curve?"',
        'This shifts the mental model from mindless copy-pasting to deep, intuitive understanding.'
      ]
    }
  ];

  const categories = ['All', 'Pedagogy', 'Algorithms', 'Credentials', 'AI Systems'];

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleShare = (article: Article) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/blogs#article-${article.id}`
      );
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-4.5rem)] transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid'
      }`}
    >
      {/* Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-[110px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[110px] pointer-events-none -z-10" />

      <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 sm:space-y-14">
        
        {/* Header Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Mentora{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              Insights
            </span>
          </h1>

          <p
            className={`text-sm sm:text-base max-w-2xl mx-auto leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Tactical playbooks, algorithmic curriculum teardowns, and cognitive architectures for engineers engineering their own career trajectory.
          </p>

          {/* Search & Category Filter Navigation */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl border backdrop-blur-md transition-colors w-full sm:w-auto bg-black/10 border-orange-950/20">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20 scale-102'
                      : isBright
                      ? 'text-[#57534E] hover:text-[#EA580C] hover:bg-white/60'
                      : 'text-zinc-400 hover:text-orange-300 hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                  isBright ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              />
              <input
                type="text"
                placeholder="Search dossier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9.5 pr-8 py-2 rounded-xl text-xs font-mono border focus:outline-none transition-all ${
                  isBright
                    ? 'bg-white border-[#E5D7CB] text-[#1C1917] placeholder-zinc-400 focus:border-orange-500'
                    : 'bg-[#120c08] border-orange-950/70 text-white placeholder-zinc-500 focus:border-orange-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Industrial Chamfered Folder Dossier Cards */}
        <div className="space-y-10 sm:space-y-12">
          {filteredArticles.map((article) => {
            const isLeftTab = article.tabPosition === 'left';
            const isWarmAmber = article.theme === 'warm-amber';
            const isDarkCharcoal = article.theme === 'dark-charcoal';
            const isDeepEspresso = article.theme === 'deep-espresso';
            const isWarmParchment = article.theme === 'warm-parchment';

            // Background & typography styling matching reference image
            let cardBg = '#0e0a07';
            let cardBorder = 'rgba(234, 88, 12, 0.25)';
            let titleColor = '#FFFFFF';
            let kickerColor = '#F97316';
            let descColor = '#D4D4D8';
            let actionTextColor = '#FB923C';
            let actionBorderColor = '#FB923C';
            let secondaryTabBg = '#0e0a07';
            let secondaryTabTextColor = '#A1A1AA';

            if (isWarmAmber) {
              // Vibrant amber folder card exactly matching reference Card 2
              cardBg = '#F59E0B';
              cardBorder = '#D97706';
              titleColor = '#180E07';
              kickerColor = '#78350F';
              descColor = '#29180D';
              actionTextColor = '#180E07';
              actionBorderColor = '#180E07';
              secondaryTabBg = '#F59E0B';
              secondaryTabTextColor = '#180E07';
            } else if (isWarmParchment) {
              cardBg = isBright ? '#FFF7ED' : '#1a110a';
              cardBorder = isBright ? '#FED7AA' : 'rgba(245, 158, 11, 0.3)';
              titleColor = isBright ? '#1C1917' : '#FFFFFF';
              kickerColor = '#EA580C';
              descColor = isBright ? '#57534E' : '#D4D4D8';
              actionTextColor = '#EA580C';
              actionBorderColor = '#EA580C';
              secondaryTabBg = cardBg;
              secondaryTabTextColor = isBright ? '#78716C' : '#A1A1AA';
            } else if (isDeepEspresso) {
              cardBg = '#140c07';
              cardBorder = 'rgba(234, 88, 12, 0.35)';
              secondaryTabBg = '#140c07';
            }

            return (
              <div key={article.id} className="relative group">
                
                {/* Chamfered Top Tab Notch */}
                {isLeftTab ? (
                  <div className="flex items-end -mb-[1px] relative z-10 pl-3 sm:pl-8 select-none">
                    {/* Primary Tab (e.g. Cobalt Blue or Flame Orange) */}
                    <div
                      className="px-5 sm:px-7 py-2 text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-sm"
                      style={{
                        backgroundColor: article.primaryTabColor,
                        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <span className="text-[10px]">✦</span>
                      <span>{article.tabLabel}</span>
                    </div>

                    {/* Secondary Chamfered Tab */}
                    <div
                      className="px-5 sm:px-7 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border-t border-l"
                      style={{
                        backgroundColor: secondaryTabBg,
                        color: secondaryTabTextColor,
                        borderColor: cardBorder,
                        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <span className="text-[10px]">✦</span>
                      <span>{article.subTabLabel}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end justify-end -mb-[1px] relative z-10 pr-6 sm:pr-16 select-none">
                    {/* Offset Chamfered Tab on Right (e.g. Card 2 in reference image) */}
                    <div
                      className="px-6 sm:px-8 py-2 text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 border-t border-l border-r shadow-xs"
                      style={{
                        backgroundColor: cardBg,
                        color: titleColor,
                        borderColor: cardBorder,
                        clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <span className="text-[10px]">✦</span>
                      <span>{article.tabLabel}</span>
                    </div>
                  </div>
                )}

                {/* Main Industrial Dossier Card Body */}
                <div
                  className={`relative rounded-2xl sm:rounded-3xl border p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-2xl overflow-hidden ${
                    isLeftTab ? 'rounded-tl-none' : ''
                  }`}
                  style={{
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                    
                    {/* Left Column: Metadata, Headline, Description, and CTA */}
                    <div className="md:col-span-6 lg:col-span-5 space-y-4 sm:space-y-5">
                      
                      {/* Date & Sub-Category Marker */}
                      <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase">
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-[2px]"
                          style={{ backgroundColor: kickerColor }}
                        />
                        <span style={{ color: kickerColor }}>
                          {article.date} • {article.readTime}
                        </span>
                      </div>

                      {/* Main Article Title */}
                      <h2
                        onClick={() => setActiveArticle(article)}
                        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ color: titleColor }}
                      >
                        {article.title}
                      </h2>

                      {/* Synopsis */}
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: descColor }}
                      >
                        {article.synopsis}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                            style={{
                              backgroundColor: isWarmAmber ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)',
                              color: isWarmAmber ? '#180E07' : '#CBD5E1',
                              borderColor: isWarmAmber ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read Article CTA Link (Exactly styled like VIEW PROJECT ↗) */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveArticle(article)}
                          className="group/btn inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-black uppercase tracking-wider pb-0.5 border-b-2 transition-all cursor-pointer hover:gap-3"
                          style={{
                            color: actionTextColor,
                            borderColor: actionBorderColor,
                          }}
                        >
                          <span>READ ARTICLE</span>
                          <span className="transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5">
                            ↗
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Right Column: Taped Photo / UI Mockup Frame */}
                    <div className="md:col-span-6 lg:col-span-7">
                      <div className="relative group/mockup">
                        
                        {/* Frosted Washi / Scotch Tape on Top-Left Corner */}
                        <div
                          className="absolute -top-3 sm:-top-3.5 -left-3 sm:-left-3.5 w-14 sm:w-16 h-5 sm:h-6 pointer-events-none z-20 select-none"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
                            backdropFilter: 'blur(3px)',
                            WebkitBackdropFilter: 'blur(3px)',
                            border: '1px solid rgba(255,255,255,0.65)',
                            transform: 'rotate(-32deg)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                          }}
                        />

                        {/* Frosted Washi / Scotch Tape on Top-Right Corner */}
                        <div
                          className="absolute -top-3 sm:-top-3.5 -right-3 sm:-right-3.5 w-14 sm:w-16 h-5 sm:h-6 pointer-events-none z-20 select-none"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.35) 100%)',
                            backdropFilter: 'blur(3px)',
                            WebkitBackdropFilter: 'blur(3px)',
                            border: '1px solid rgba(255,255,255,0.65)',
                            transform: 'rotate(32deg)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
                          }}
                        />

                        {/* The Framed Photo / Card */}
                        <div
                          onClick={() => setActiveArticle(article)}
                          className="relative overflow-hidden rounded-xl border shadow-2xl transition-transform duration-300 group-hover/mockup:scale-[1.01] cursor-pointer"
                          style={{
                            backgroundColor: '#0a0705',
                            borderColor: isWarmAmber ? '#D97706' : 'rgba(255,255,255,0.12)',
                          }}
                        >
                          {/* Rich Visual Content Based on Article Theme */}
                          {article.id === 1 && (
                            /* Mobile App UI Screen with Skill Progression (Matching Card 1 Phone in reference!) */
                            <div className="p-4 sm:p-6 bg-gradient-to-br from-[#120d09] via-[#090604] to-[#150e08] text-white">
                              {/* Device Header */}
                              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[10px] font-mono text-zinc-400">
                                <span>MENTORA // LVL 03</span>
                                <span className="flex items-center gap-1.5 text-orange-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                                  LIVE TRACK
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-3 sm:gap-4 items-center">
                                {/* Left Phone View */}
                                <div className="p-3.5 rounded-xl border border-orange-500/30 bg-[#070503] space-y-2.5 shadow-lg">
                                  <div className="flex items-center justify-between text-[11px] font-bold">
                                    <span className="text-orange-400">Current Node</span>
                                    <span className="text-emerald-400 text-[10px]">85% XP</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 w-[85%]" />
                                  </div>
                                  <div className="p-2 rounded-lg bg-white/5 border border-white/10 space-y-1">
                                    <div className="text-[10px] font-mono text-zinc-300 font-bold">
                                      Concurrency Primitives
                                    </div>
                                    <div className="text-[9px] text-zinc-400">
                                      3 drills remaining before Level 4 unlock
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 pt-1 text-[9px] font-mono text-orange-300">
                                    <span>🔒 Level 04: Raft Consensus</span>
                                  </div>
                                </div>

                                {/* Right Phone View */}
                                <div className="p-3.5 rounded-xl border border-white/10 bg-[#070503] space-y-2.5 shadow-lg">
                                  <div className="text-[11px] font-bold text-zinc-200">
                                    Mastery Matrix
                                  </div>
                                  <div className="space-y-1.5 text-[9px] font-mono">
                                    <div className="flex justify-between text-zinc-400">
                                      <span>Memory Models</span>
                                      <span className="text-emerald-400 font-bold">PASSED (92%)</span>
                                    </div>
                                    <div className="flex justify-between text-zinc-400">
                                      <span>Mutex Safety</span>
                                      <span className="text-emerald-400 font-bold">PASSED (88%)</span>
                                    </div>
                                    <div className="flex justify-between text-orange-300">
                                      <span>Deadlock Isolation</span>
                                      <span className="text-amber-400 font-bold">ACTIVE DRILL</span>
                                    </div>
                                  </div>
                                  <div className="p-1.5 text-center rounded bg-orange-600 text-white font-mono text-[10px] font-bold tracking-wider">
                                    CONTINUE DRILL →
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {article.id === 2 && (
                            /* Engineering Team Workspace Mockup (Matching Card 2 Photo in reference!) */
                            <div className="relative p-5 sm:p-7 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
                                <span>VECTOR DIFFERENTIAL DIAGNOSTICS</span>
                                <span className="text-amber-400 font-bold">TARGET: STAFF PLATFORM</span>
                              </div>

                              {/* Workspace Terminal / Multi-monitor Simulation */}
                              <div className="space-y-3 font-mono text-[10px]">
                                <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 space-y-1.5">
                                  <div className="flex items-center gap-2 text-zinc-400">
                                    <span className="text-amber-400">λ</span>
                                    <span>mentora eval --diff --user=you --role=staff</span>
                                  </div>
                                  <div className="text-zinc-300 text-[9px] leading-relaxed">
                                    [OK] Core Distributed Patterns: 94.2% match<br />
                                    [DELTA] High-Throughput Partitioning: -28.4% gap<br />
                                    [REMEDY] Prescribing 3-Tier Drill Sequence: Idempotency Keys
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                                  <div className="p-2 rounded bg-zinc-800/80 border border-zinc-700">
                                    <div className="text-zinc-400">Current Vector</div>
                                    <div className="text-amber-400 font-bold text-xs">0.824</div>
                                  </div>
                                  <div className="p-2 rounded bg-zinc-800/80 border border-zinc-700">
                                    <div className="text-zinc-400">Market Baseline</div>
                                    <div className="text-emerald-400 font-bold text-xs">0.910</div>
                                  </div>
                                  <div className="p-2 rounded bg-zinc-800/80 border border-zinc-700">
                                    <div className="text-zinc-400">Est. Time to Close</div>
                                    <div className="text-white font-bold text-xs">12 Days</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {article.id === 3 && (
                            /* Cryptographic Skill Passport Badge */
                            <div className="p-5 sm:p-7 bg-gradient-to-br from-[#1c0f07] via-[#0f0905] to-[#1a0e08] text-white">
                              <div className="flex items-center justify-between pb-3 mb-4 border-b border-orange-500/20 text-[10px] font-mono text-orange-400">
                                <span>VERIFIED PROOF-OF-WORK // PASSPORT</span>
                                <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-bold">
                                  BENCHMARK: 70%+
                                </span>
                              </div>

                              <div className="p-3.5 rounded-xl border border-orange-500/40 bg-black/60 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <div className="text-xs font-bold text-white">
                                      Distributed Systems Mastery
                                    </div>
                                    <div className="text-[9px] font-mono text-zinc-400">
                                      ID: MTR-9042-PROVABLE
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-emerald-400 font-mono font-bold text-sm">
                                      86.4%
                                    </span>
                                    <div className="text-[8px] font-mono text-zinc-500">
                                      HARD SCENARIOS
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-zinc-300 pt-1 border-t border-white/10">
                                  <div>• Split-Brain Resolution: ✓</div>
                                  <div>• Multi-Raft Replication: ✓</div>
                                  <div>• Jitter Backoff Drift: ✓</div>
                                  <div>• Write-Ahead WAL Tuning: ✓</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {article.id === 4 && (
                            /* Interactive Code Terminal with Socratic AI Hints */
                            <div className="p-5 sm:p-7 bg-gradient-to-br from-[#0c0906] via-[#140e0a] to-[#080604] text-white font-mono">
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/20 text-[10px] text-zinc-400">
                                <span>AI COMPANION // SOCRATIC CODE REVIEW</span>
                                <span className="text-amber-400">LATENCY BOTTLENECK</span>
                              </div>

                              <div className="p-3 rounded-lg bg-black border border-white/10 text-[9px] space-y-2">
                                <div className="text-zinc-500">// Line 42: execution plan analysis</div>
                                <div className="text-rose-400 line-through">
                                  users.map(async u =&gt; await db.fetchProfile(u.id))
                                </div>
                                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200">
                                  <span className="font-bold text-amber-400">💡 Socratic Prompt:</span>{' '}
                                  "Notice the N+1 database roundtrips. How would a single batch vector query change the latency curve?"
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Hover Overlay Hint */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/mockup:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="px-4 py-1.5 rounded-full bg-orange-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg">
                              CLICK TO READ FULL DOSSIER ↗
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State when no articles match filter */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16 space-y-4 rounded-3xl border border-dashed border-orange-950/40 p-8">
            <BookOpen className="w-10 h-10 text-orange-400 mx-auto opacity-60" />
            <h3 className="text-lg font-bold font-mono">No matching field reports found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your category filter or clearing your search term to see all archived articles.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-mono text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Newsletter Dossier Card */}
        <div
          className={`relative rounded-3xl border p-8 sm:p-12 shadow-2xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-white via-[#FFF7ED] to-white border-orange-200'
              : 'bg-gradient-to-r from-[#120a06] via-[#180e08] to-[#120a06] border-orange-900/50'
          }`}
        >
          {/* Top Chamfered Folder Accent */}
          <div className="absolute -top-3.5 left-8 px-4 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-600 text-white rounded-t-md">
            ✦ DISPATCHES ARCHIVE // SUBSCRIBE
          </div>

          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h3
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Receive Engineering Dispatches
            </h3>
            <p
              className={`text-xs sm:text-sm leading-relaxed ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Bi-weekly deep dives into cognitive scaffolding, verifiable skill credentialing, and developer velocity. Zero spam, strictly technical.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing to Mentora Dispatches!');
              }}
              className="flex flex-col sm:flex-row items-center gap-3 pt-2 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="engineer@company.com"
                className={`w-full px-4 py-3 rounded-xl border text-xs font-mono focus:outline-none transition-colors ${
                  isBright
                    ? 'bg-white border-[#E3D4C5] text-[#1C1917] placeholder-zinc-400 focus:border-orange-500'
                    : 'bg-black/60 border-orange-950/80 text-white placeholder-zinc-500 focus:border-orange-500'
                }`}
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg whitespace-nowrap transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* Interactive Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div
            className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl transition-all ${
              isBright
                ? 'bg-white border-[#EAE0D5] text-[#1C1917]'
                : 'bg-[#0f0a06] border-orange-900/60 text-white'
            }`}
          >
            {/* Modal Header Bar */}
            <div
              className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md ${
                isBright ? 'bg-white/95 border-[#EAE0D5]' : 'bg-[#0f0a06]/95 border-orange-950/80'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-orange-500">
                <span>✦</span>
                <span>{activeArticle.tabLabel} // {activeArticle.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isBright
                      ? 'border-[#EAE0D5] hover:bg-orange-50 text-[#57534E]'
                      : 'border-orange-950 hover:bg-white/5 text-zinc-300'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedId === activeArticle.id ? 'Copied!' : 'Share'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isBright
                      ? 'border-[#EAE0D5] hover:bg-zinc-100 text-zinc-600'
                      : 'border-orange-950 hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-10 space-y-6 sm:space-y-8">
              
              <div className="space-y-3">
                <div className="text-xs font-mono font-bold text-orange-500 uppercase">
                  {activeArticle.kicker} • {activeArticle.date} • {activeArticle.readTime}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                  {activeArticle.title}
                </h2>
                <p
                  className={`text-sm sm:text-base leading-relaxed ${
                    isBright ? 'text-[#57534E]' : 'text-zinc-300'
                  }`}
                >
                  {activeArticle.synopsis}
                </p>
              </div>

              {/* Key Takeaways Box */}
              <div
                className={`p-5 rounded-2xl border space-y-2.5 ${
                  isBright
                    ? 'bg-[#FFF7ED] border-[#FED7AA]'
                    : 'bg-orange-950/40 border-orange-800/40'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-500 uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>Key Architectural Insights</span>
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
                  {activeArticle.takeaways.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Article Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                {activeArticle.fullBody.map((paragraph, idx) => (
                  <p key={idx} className={isBright ? 'text-[#44403C]' : 'text-zinc-300'}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags & Author Stamp */}
              <div
                className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${
                  isBright ? 'border-[#EAE0D5] text-zinc-500' : 'border-orange-950/80 text-zinc-500'
                }`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span>PUBLISHED BY MENTORA RESEARCH LABS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
