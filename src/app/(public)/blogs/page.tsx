'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { getBlogs, sortBlogsNumerically } from '@/lib/admin/services/blogService';
import { mockBlogs, BlogArticle } from '@/lib/admin/data/mockBlogs';
import {
  Search,
  X,
  BookOpen,
  Sparkles,
  Share2,
  CheckCircle2,
  Lock,
  Flame,
  ArrowUpRight,
  Check,
  Lightbulb,
} from 'lucide-react';

export default function BlogsPage() {
  const { isBright } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [articles, setArticles] = useState<BlogArticle[]>(sortBlogsNumerically(mockBlogs));

  // Dynamically load from database / service
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await getBlogs();
        if (isMounted && stored && stored.length > 0) {
          const published = stored.filter((b) => b.status !== 'Draft');
          setArticles(sortBlogsNumerically(published));
        }
      } catch (err) {
        console.error('Error loading blogs:', err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [articles]);

  // Filter and enforce strict numerical ordering (#01, #02, #03, #04, #05, ...)
  const filteredArticles = useMemo(() => {
    const list = articles.filter((article) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        article.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.tags && article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });

    return sortBlogsNumerically(list);
  }, [articles, selectedCategory, searchQuery]);

  const handleShare = (article: BlogArticle) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/blogs#article-${article.id}`);
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

      <div className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 sm:space-y-12">
        
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
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
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
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Industrial Chamfered Folder Dossier Cards strictly numerical */}
        <div className="space-y-10 sm:space-y-12">
          {filteredArticles.map((article, index) => {
            const numInt =
              parseInt(String(article.num || index + 1).replace(/\D/g, ''), 10) ||
              index + 1;
            const isLeftTab =
              article.tabPosition !== undefined
                ? article.tabPosition === 'left'
                : numInt % 2 === 1;

            // Resolve theme
            const theme =
              article.theme ||
              (numInt === 1
                ? 'dark-charcoal'
                : numInt === 2
                ? 'warm-amber'
                : numInt === 3
                ? 'deep-espresso'
                : numInt === 4
                ? 'warm-parchment'
                : numInt === 5
                ? 'dark-charcoal'
                : numInt % 2 === 0
                ? 'warm-amber'
                : 'dark-charcoal');

            const isWarmAmber = theme === 'warm-amber';
            const isDeepEspresso = theme === 'deep-espresso';
            const isWarmParchment = theme === 'warm-parchment';

            // Tab colors
            const primaryTabColor =
              article.primaryTabColor ||
              (numInt === 1
                ? '#2563EB' // Cobalt Blue like reference
                : numInt === 2
                ? '#F59E0B' // Warm Golden Amber like reference
                : numInt === 3
                ? '#EA580C' // Flame Orange
                : numInt === 4
                ? '#10B981' // Emerald
                : numInt === 5
                ? '#3B82F6' // Electric Blue
                : '#EA580C');

            // Format tab labels cleanly (+ ARTICLE 01, + PEDAGOGY & SYSTEMS)
            const formatTabLabel = (raw?: string, fallback = `ARTICLE ${String(numInt).padStart(2, '0')}`) => {
              const text = (raw && raw.trim()) || fallback;
              return text.startsWith('+') ? text : `+ ${text}`;
            };
            const primaryTabLabel = formatTabLabel(article.tabLabel, `ARTICLE ${String(numInt).padStart(2, '0')}`);
            const subTabLabel = formatTabLabel(
              article.subTabLabel,
              (article.category || 'SYSTEMS').toUpperCase()
            );

            // Dossier folder styling
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
                    {/* Primary Tab (e.g. Cobalt Blue + ARTICLE 01) */}
                    <div
                      className="px-5 sm:px-7 py-2 text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider text-white flex items-center gap-1.5 shadow-sm"
                      style={{
                        backgroundColor: primaryTabColor,
                        clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <span>{primaryTabLabel}</span>
                    </div>

                    {/* Secondary Chamfered Tab (+ PEDAGOGY & SYSTEMS) */}
                    <div
                      className="px-5 sm:px-7 py-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border-t border-l"
                      style={{
                        backgroundColor: secondaryTabBg,
                        color: secondaryTabTextColor,
                        borderColor: cardBorder,
                        clipPath: 'polygon(0 0, calc(100% - 18px) 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <span>{subTabLabel}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end justify-end -mb-[1px] relative z-10 pr-6 sm:pr-16 select-none">
                    {/* Offset Chamfered Tab on Right (e.g. Card 2 + ARTICLE 02 in reference) */}
                    <div
                      className="px-6 sm:px-8 py-2 text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 border-t border-l border-r shadow-xs"
                      style={{
                        backgroundColor: cardBg,
                        color: titleColor,
                        borderColor: cardBorder,
                        clipPath: 'polygon(16px 0, calc(100% - 16px) 0, 100% 100%, 0 100%)',
                      }}
                    >
                      <span>{primaryTabLabel}</span>
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
                    
                    {/* Left Column: Metadata, Headline, Description, Tags, and CTA */}
                    <div className="md:col-span-6 lg:col-span-5 space-y-4 sm:space-y-5">
                      
                      {/* Date & Read Time */}
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
                        {article.tags &&
                          article.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                              style={{
                                backgroundColor: isWarmAmber
                                  ? 'rgba(0,0,0,0.08)'
                                  : 'rgba(255,255,255,0.08)',
                                color: isWarmAmber ? '#180E07' : '#CBD5E1',
                                borderColor: isWarmAmber
                                  ? 'rgba(0,0,0,0.15)'
                                  : 'rgba(255,255,255,0.15)',
                              }}
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                      </div>

                      {/* Read Article CTA Link */}
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
                              'linear-gradient(135deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.38) 100%)',
                            backdropFilter: 'blur(3px)',
                            WebkitBackdropFilter: 'blur(3px)',
                            border: '1px solid rgba(255,255,255,0.70)',
                            transform: 'rotate(-32deg)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.20)',
                          }}
                        />

                        {/* Frosted Washi / Scotch Tape on Top-Right Corner */}
                        <div
                          className="absolute -top-3 sm:-top-3.5 -right-3 sm:-right-3.5 w-14 sm:w-16 h-5 sm:h-6 pointer-events-none z-20 select-none"
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.38) 100%)',
                            backdropFilter: 'blur(3px)',
                            WebkitBackdropFilter: 'blur(3px)',
                            border: '1px solid rgba(255,255,255,0.70)',
                            transform: 'rotate(32deg)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.20)',
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
                          {/* Rich Visual Mockups Based on Article Number */}
                          {numInt === 1 && (
                            /* Mobile App UI Screen with Skill Progression (Matching Card 1 in reference!) */
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
                                   <div className="flex items-center gap-1.5 pt-1 text-[9px] font-mono text-orange-300">
                                     <Lock className="w-3 h-3" />
                                     <span>Level 04: Raft Consensus</span>
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

                          {numInt === 2 && (
                            /* Engineering Team Workspace Mockup (Matching Card 2 in reference!) */
                            <div className="relative p-5 sm:p-7 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white">
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800 text-[10px] font-mono text-zinc-400">
                                <span>VECTOR DIFFERENTIAL DIAGNOSTICS</span>
                                <span className="text-amber-400 font-bold">TARGET: STAFF PLATFORM</span>
                              </div>

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

                          {numInt === 3 && (
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
                                   <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Split-Brain Resolution</div>
                                   <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Multi-Raft Replication</div>
                                   <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Jitter Backoff Drift</div>
                                   <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-emerald-400" /> Write-Ahead WAL Tuning</div>
                                 </div>
                               </div>
                             </div>
                          )}

                          {numInt === 4 && (
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
                                   <span className="font-bold text-amber-400 inline-flex items-center gap-1"><Lightbulb className="w-3.5 h-3.5" /> Socratic Prompt:</span>{' '}
                                   "Notice the N+1 database roundtrips. How would a single batch vector query change the latency curve?"
                                 </div>
                              </div>
                            </div>
                          )}

                          {numInt === 5 && (
                            /* Agentic AI Autonomous Reasoning Loop */
                            <div className="p-5 sm:p-7 bg-gradient-to-br from-[#0a0d14] via-[#06090e] to-[#0d121c] text-white font-mono">
                              <div className="flex items-center justify-between pb-3 mb-3 border-b border-blue-500/20 text-[10px] text-zinc-400">
                                <span className="text-blue-400 font-bold">
                                  AGENTIC REASONING // RECURSIVE REFLECTION
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                  ACTIVE LOOP
                                </span>
                              </div>

                              <div className="space-y-2.5 text-[9px]">
                                <div className="p-3 rounded-lg bg-black/80 border border-blue-500/30 space-y-1.5">
                                  <div className="flex items-center justify-between text-zinc-400">
                                    <span className="text-blue-400">
                                      λ agent.executeTask(goal: &quot;Fix distributed deadlock in Raft&quot;)
                                    </span>
                                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                      STEP 03/04
                                    </span>
                                  </div>
                                  <div className="text-zinc-300 text-[8.5px] leading-relaxed">
                                    <span className="text-zinc-500">[THOUGHT]</span> Inspecting mutex acquisition order across heartbeat goroutines.<br />
                                    <span className="text-amber-400">[TOOL_CALL]</span> <span className="text-zinc-200">run_profiler(&quot;--detect-deadlocks&quot;, timeout=&quot;500ms&quot;)</span><br />
                                    <span className="text-emerald-400">[VERIFY]</span> 0 circular locks detected. Invariant satisfied.
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                                  <div className="p-2 rounded bg-blue-950/40 border border-blue-900/40">
                                    <div className="text-zinc-400">Test-Time Compute</div>
                                    <div className="text-blue-400 font-bold text-xs">4.2 kFLOPs</div>
                                  </div>
                                  <div className="p-2 rounded bg-blue-950/40 border border-blue-900/40">
                                    <div className="text-zinc-400">Self-Correction</div>
                                    <div className="text-emerald-400 font-bold text-xs">2 Passes</div>
                                  </div>
                                  <div className="p-2 rounded bg-blue-950/40 border border-blue-900/40">
                                    <div className="text-zinc-400">Deterministic Score</div>
                                    <div className="text-white font-bold text-xs">98.5%</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {numInt > 5 && (
                            /* Fallback for dynamically created admin blogs */
                            article.imageUrl ? (
                              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                                <Image
                                  src={article.imageUrl}
                                  alt={article.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover/mockup:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                                  <span>{article.category}</span>
                                  <span>{article.readTime}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-5 sm:p-7 bg-gradient-to-br from-[#120d09] via-[#090604] to-[#150e08] text-white font-mono space-y-3">
                                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] text-orange-400">
                                  <span>MENTORA // RESEARCH DOSSIER</span>
                                  <span>{article.category}</span>
                                </div>
                                <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-[9px] text-zinc-300 space-y-1">
                                  <div className="text-orange-300 font-bold">{article.title}</div>
                                  <div className="text-zinc-400 line-clamp-2">{article.synopsis}</div>
                                </div>
                              </div>
                            )
                          )}

                          {/* Hover Overlay Hint (Matching screenshot with prominent full dossier badge) */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/mockup:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                            <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-xl border border-white/20">
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
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-mono text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}



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
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>
                  {activeArticle.tabLabel || `ARTICLE ${activeArticle.num}`} //{' '}
                  {activeArticle.category}
                </span>
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
                  {activeArticle.kicker || (activeArticle.category?.toUpperCase() || 'SYSTEMS')} • {activeArticle.date} • {activeArticle.readTime}
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
              {activeArticle.takeaways && activeArticle.takeaways.length > 0 && (
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
              )}

              {/* Full Article Paragraphs */}
              {activeArticle.fullBody && activeArticle.fullBody.length > 0 && (
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                  {activeArticle.fullBody.map((paragraph, idx) => (
                    <p key={idx} className={isBright ? 'text-[#44403C]' : 'text-zinc-300'}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}

              {/* Tags & Author Stamp */}
              <div
                className={`pt-6 border-t flex flex-wrap items-center justify-between gap-4 text-xs font-mono ${
                  isBright ? 'border-[#EAE0D5] text-zinc-500' : 'border-orange-950/80 text-zinc-500'
                }`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {activeArticle.tags &&
                    activeArticle.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                </div>

                <span>PUBLISHED BY {activeArticle.author?.toUpperCase() || 'MENTORA RESEARCH LABS'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
