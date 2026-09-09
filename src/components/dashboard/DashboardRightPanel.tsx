'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

// ─── Real-Time Mini Calendar Widget ─────────────────────────────────────────
function MiniCalendar() {
  const { isBright } = useTheme();
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const today = new Date();
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const sessionDays = [4, 8, 12, 17, 22, 28];
  const stripedDays = [14, 17, 30, 31];

  interface CalendarCell {
    day: number;
    monthType: 'prev' | 'current' | 'next';
    date: Date;
  }

  const gridCells: CalendarCell[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    gridCells.push({
      day: daysInPrevMonth - i,
      monthType: 'prev',
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    gridCells.push({
      day: d,
      monthType: 'current',
      date: new Date(year, month, d),
    });
  }

  const remaining = (7 - (gridCells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    gridCells.push({
      day: d,
      monthType: 'next',
      date: new Date(year, month + 1, d),
    });
  }

  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.5)';
  const btnBg = isBright ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)';

  return (
    <div className="w-full pt-2 pb-1 px-1 select-none">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-base font-bold tracking-tight" style={{ color: textPrimary }}>
          {monthNames[month]} {year}
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all hover:bg-black/10 dark:hover:bg-white/15 active:scale-95"
            style={{ background: btnBg, color: textPrimary }}
            aria-label="Previous month"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all hover:bg-black/10 dark:hover:bg-white/15 active:scale-95"
            style={{ background: btnBg, color: textPrimary }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dw) => (
          <span key={dw} className="text-xs font-semibold" style={{ color: textMuted }}>
            {dw}
          </span>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1">
        {gridCells.map((cell, idx) => {
          const isToday =
            cell.monthType === 'current' &&
            cell.day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const isSelected =
            cell.monthType === 'current' &&
            selectedDate.getDate() === cell.day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;

          const isStriped = cell.monthType === 'prev' || cell.monthType === 'next' || stripedDays.includes(cell.day);
          const hasSession = cell.monthType === 'current' && sessionDays.includes(cell.day);

          return (
            <div key={idx} className="flex items-center justify-center p-0.5">
              <button
                onClick={() => cell.monthType === 'current' && setSelectedDate(cell.date)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all relative ${
                  cell.monthType !== 'current' ? 'opacity-30 cursor-default' : 'cursor-pointer hover:scale-105'
                }`}
                style={{
                  background: isToday
                    ? '#84CC16'
                    : isSelected
                    ? 'rgba(132, 204, 22, 0.22)'
                    : isStriped
                    ? isBright ? '#F5F5F4' : '#272421'
                    : 'transparent',
                  color: isToday
                    ? '#FFFFFF'
                    : isSelected
                    ? '#84CC16'
                    : textPrimary,
                  fontWeight: isToday || isSelected ? 700 : 500,
                  border: isSelected && !isToday ? '2px solid #84CC16' : '1px solid transparent',
                  backgroundImage: isStriped && !isToday
                    ? 'repeating-linear-gradient(45deg, rgba(120,113,108,0.12), rgba(120,113,108,0.12) 3px, transparent 3px, transparent 6px)'
                    : undefined,
                }}
              >
                {cell.day}
                {hasSession && !isToday && (
                  <span
                    className="absolute bottom-1 w-1 h-1 rounded-full"
                    style={{ background: '#FF6B35' }}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Session {
  id: string;
  mentor: string;
  topic: string;
  timeStart: string;
  timeEnd: string;
  lesson: string;
  isNow?: boolean;
  avatar: string;
}

interface ActivityItem {
  id: string;
  type: 'badge' | 'completion' | 'community' | 'quiz' | 'streak';
  text: string;
  sub: string;
  time: string;
  dateGroup: 'today' | 'yesterday' | 'past';
  xp?: string;
}

interface LeaderEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  isMe?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const calendarSlots = [
  { time: '10:00', sessionId: 's1' },
  { time: '10:30', sessionId: null },
  { time: '11:00', sessionId: 's2' },
  { time: '11:30', sessionId: null },
  { time: '12:00', sessionId: 's3' },
  { time: '12:30', sessionId: null },
  { time: '13:00', sessionId: 's4' },
  { time: '13:30', sessionId: null },
  { time: '14:00', sessionId: null },
];

const sessionMap: Record<string, Session> = {
  s1: {
    id: 's1',
    mentor: 'Priya Sharma',
    topic: 'System Design Review',
    timeStart: '10:00',
    timeEnd: '10:45',
    lesson: '12th lesson',
    isNow: true,
    avatar: 'PS',
  },
  s2: {
    id: 's2',
    mentor: 'Rahul Gupta',
    topic: 'React Patterns Deep Dive',
    timeStart: '11:00',
    timeEnd: '11:40',
    lesson: '23rd lesson',
    avatar: 'RG',
  },
  s3: {
    id: 's3',
    mentor: 'Ananya Verma',
    topic: 'AWS Architecture Q&A',
    timeStart: '12:00',
    timeEnd: '12:45',
    lesson: '23rd lesson',
    avatar: 'AV',
  },
  s4: {
    id: 's4',
    mentor: 'Dev Kapoor',
    topic: 'DSA & Problem Solving',
    timeStart: '13:00',
    timeEnd: '14:00',
    lesson: '21st lesson',
    avatar: 'DK',
  },
};

const leaderboard: LeaderEntry[] = [
  { rank: 1, name: 'Shreya Patel', points: 4820, avatar: 'SP' },
  { rank: 2, name: 'Marcus Chen', points: 4610, avatar: 'MC' },
  { rank: 3, name: 'Aditya Kumar', points: 4395, avatar: 'AK' },
  { rank: 4, name: 'Neha Singh', points: 4180, avatar: 'NS' },
  { rank: 5, name: 'Jordan Park', points: 3950, avatar: 'JP' },
  { rank: 12, name: 'Alex Johnson', points: 2840, avatar: 'AJ', isMe: true },
];

const activityColors: Record<ActivityItem['type'], string> = {
  badge: '#F59E0B',
  completion: '#10B981',
  community: '#8B5CF6',
  quiz: '#FF6B35',
  streak: '#EF4444',
};

const activityIcons: Record<ActivityItem['type'], React.ReactNode> = {
  badge: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 2l2.09 6.26L20 10l-5.91 4.74L16.18 22 12 18.77 7.82 22l2.09-7.26L4 10l5.91-1.74z" />
    </svg>
  ),
  completion: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  community: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" strokeWidth={2.5} />
    </svg>
  ),
  streak: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.08 1.94-6.52 4.41-8.74.52-.47 1.35-.12 1.38.58.07 1.54.72 2.94 1.76 3.96.22.22.58.05.57-.26-.06-.97.16-1.99.71-2.9 1.15-1.92 3.19-3.23 5.48-3.62.6-.1 1.05.47.81 1.02-.75 1.74-.53 3.73.49 5.25.13.2.42.21.56.03.88-1.12 1.34-2.52 1.4-3.95.02-.45.54-.68.86-.36C21.46 10.97 22 13.06 22 15c0 4.42-4.03 8-10 8z" />
    </svg>
  ),
};

// ─── 3D Stacked Activity Deck Carousel Widget ────────────────────────────────
interface DailyDeckCard {
  id: string;
  dayTitle: string;
  dateLabel: string;
  totalXP: number;
  completedCount: number;
  accentGradient: string;
  bgTheme: string;
  activities: ActivityItem[];
}

const dailyCardDeck: DailyDeckCard[] = [
  {
    id: 'card-today',
    dayTitle: "Today's Activity",
    dateLabel: 'Sept 9, 2026',
    totalXP: 445,
    completedCount: 3,
    accentGradient: 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 100%)',
    bgTheme: '#FF6B35',
    activities: [
      { id: 'a1', type: 'badge', text: 'Earned "React Master" badge', sub: 'Completed React Advanced track', time: '2:15 PM', dateGroup: 'today', xp: '+150 XP' },
      { id: 'a2', type: 'completion', text: 'Finished Module 4', sub: 'Node.js & REST APIs', time: '11:40 AM', dateGroup: 'today', xp: '+200 XP' },
      { id: 'a3', type: 'quiz', text: 'Quiz Score: 94%', sub: 'TypeScript Fundamentals', time: '9:15 AM', dateGroup: 'today', xp: '+95 XP' },
    ],
  },
  {
    id: 'card-yesterday',
    dayTitle: "Yesterday's Log",
    dateLabel: 'Sept 8, 2026',
    totalXP: 425,
    completedCount: 3,
    accentGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    bgTheme: '#8B5CF6',
    activities: [
      { id: 'a4', type: 'community', text: 'Posted in Community', sub: '"How to scale microservices?"', time: '4:30 PM', dateGroup: 'yesterday', xp: '+25 XP' },
      { id: 'a5', type: 'completion', text: 'Completed Skill Gap Assessment', sub: 'Cloud Architecture track', time: '1:10 PM', dateGroup: 'yesterday', xp: '+300 XP' },
      { id: 'a6', type: 'streak', text: '14-Day Learning Streak! 🔥', sub: 'Maintained daily practice momentum', time: '9:00 AM', dateGroup: 'yesterday', xp: '+100 XP' },
    ],
  },
  {
    id: 'card-sept7',
    dayTitle: 'Sept 7 Record',
    dateLabel: 'Sept 7, 2026',
    totalXP: 280,
    completedCount: 2,
    accentGradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    bgTheme: '#3B82F6',
    activities: [
      { id: 'a7', type: 'completion', text: 'Finished Module 3', sub: 'Express.js & Middleware Patterns', time: '3:00 PM', dateGroup: 'past', xp: '+180 XP' },
      { id: 'a8', type: 'quiz', text: 'Quiz Score: 100%', sub: 'Async JavaScript & Promises', time: '10:30 AM', dateGroup: 'past', xp: '+100 XP' },
    ],
  },
  {
    id: 'card-sept6',
    dayTitle: 'Sept 6 Record',
    dateLabel: 'Sept 6, 2026',
    totalXP: 250,
    completedCount: 1,
    accentGradient: 'linear-gradient(135deg, #10B981 0%, #047857 100%)',
    bgTheme: '#10B981',
    activities: [
      { id: 'a9', type: 'badge', text: 'Earned "Problem Solver" badge', sub: 'Solved 25 coding challenges', time: '5:00 PM', dateGroup: 'past', xp: '+250 XP' },
    ],
  },
];

function StackedActivityDeck() {
  const { isBright } = useTheme();
  const [deckIndex, setDeckIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDir, setSwipeDir] = useState<'next' | 'prev'>('next');

  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.5)';
  const btnBg = isBright ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)';

  const totalCards = dailyCardDeck.length;

  const handleNext = () => {
    if (isSwiping) return;
    setSwipeDir('next');
    setIsSwiping(true);
    setTimeout(() => {
      setDeckIndex((prev) => (prev + 1) % totalCards);
      setIsSwiping(false);
    }, 300);
  };

  const handlePrev = () => {
    if (isSwiping) return;
    setSwipeDir('prev');
    setIsSwiping(true);
    setTimeout(() => {
      setDeckIndex((prev) => (prev - 1 + totalCards) % totalCards);
      setIsSwiping(false);
    }, 300);
  };

  return (
    <div className="w-full">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF6B35]">
            Activity Feed Stack
          </span>
          <p className="text-xs font-semibold" style={{ color: textMuted }}>
            {dailyCardDeck[deckIndex].dayTitle} ({deckIndex + 1}/{totalCards})
          </p>
        </div>

        {/* Swipe Control Arrows */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            disabled={isSwiping}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{ background: btnBg, color: textPrimary, border: `1px solid ${cardBorder}` }}
            aria-label="Previous Day Activity Card"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            disabled={isSwiping}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
            style={{ background: '#FF6B35', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(255,107,53,0.35)' }}
            aria-label="Next Day Activity Card"
          >
            ›
          </button>
        </div>
      </div>

      {/* 3D Stack Container */}
      <div className="relative w-full h-[320px] select-none">
        {dailyCardDeck.map((card, i) => {
          const offset = (i - deckIndex + totalCards) % totalCards;
          const isTop = offset === 0;

          let transform = '';
          let opacity = 1;
          let zIndex = totalCards - offset;

          if (offset === 0) {
            transform = isSwiping
              ? swipeDir === 'next'
                ? 'translate3d(-110%, -15px, 0) rotate(-14deg)'
                : 'translate3d(110%, -15px, 0) rotate(14deg)'
              : 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
            opacity = isSwiping ? 0 : 1;
          } else if (offset === 1) {
            transform = 'translate3d(10px, 12px, 0) scale(0.95) rotate(3.5deg)';
            opacity = 0.92;
          } else if (offset === 2) {
            transform = 'translate3d(20px, 24px, 0) scale(0.90) rotate(7deg)';
            opacity = 0.75;
          } else {
            transform = 'translate3d(28px, 34px, 0) scale(0.85) rotate(10.5deg)';
            opacity = 0;
          }

          return (
            <div
              key={card.id}
              className="absolute inset-0 rounded-2xl p-4 transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden shadow-xl"
              style={{
                transform,
                opacity,
                zIndex,
                background: isTop ? cardBg : isBright ? '#FAFAFA' : '#231F1C',
                border: `1px solid ${isTop ? card.bgTheme : cardBorder}`,
                boxShadow: isTop
                  ? isBright
                    ? '0 12px 32px rgba(234,88,12,0.18), 0 2px 8px rgba(0,0,0,0.06)'
                    : '0 14px 36px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)'
                  : 'none',
                pointerEvents: isTop ? 'auto' : 'none',
              }}
            >
              {/* Card Header Strip */}
              <div>
                <div
                  className="rounded-xl p-3 mb-3 flex items-center justify-between text-white"
                  style={{ background: card.accentGradient, boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}
                >
                  <div>
                    <h4 className="text-sm font-extrabold leading-tight">{card.dayTitle}</h4>
                    <p className="text-xs opacity-85 font-medium">{card.dateLabel}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                      ⚡ +{card.totalXP} XP
                    </span>
                    <p className="text-[10px] mt-0.5 opacity-80">{card.completedCount} activities</p>
                  </div>
                </div>

                {/* Activities List on Card */}
                <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                  {card.activities.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2.5 p-2 rounded-xl transition-all"
                      style={{ background: isBright ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)' }}
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                        style={{ background: `${activityColors[item.type]}25`, color: activityColors[item.type] }}
                      >
                        {activityIcons[item.type]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold leading-tight truncate" style={{ color: textPrimary }}>
                          {item.text}
                        </p>
                        <p className="text-[11px] truncate" style={{ color: textMuted }}>
                          {item.sub}
                        </p>
                      </div>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                        {item.xp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Indicator */}
              <div className="pt-2 flex items-center justify-between border-t border-black/5 dark:border-white/10 text-[11px]">
                <span className="font-semibold" style={{ color: textMuted }}>
                  Click arrows to swipe cards →
                </span>
                <div className="flex items-center gap-1">
                  {dailyCardDeck.map((_, dotIdx) => (
                    <span
                      key={dotIdx}
                      className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: dotIdx === deckIndex ? '#FF6B35' : isBright ? '#D6D3D1' : '#44403C',
                        width: dotIdx === deckIndex ? '10px' : '6px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const rankMedals: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const ClockIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} className="w-3 h-3 flex-shrink-0">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ─── Main Right Panel Component ───────────────────────────────────────────────
export default function DashboardRightPanel() {
  const { isBright } = useTheme();

  const calendarBg = isBright ? '#FFFFFF' : '#1C1916';
  const calendarBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.5)';
  const futureCardBg = isBright ? '#FDFAF7' : '#221E1A';
  const futureCardBorder = isBright ? 'rgba(234,88,12,0.1)' : 'rgba(255,107,53,0.12)';
  const timelineColor = isBright ? 'rgba(255,107,53,0.2)' : 'rgba(255,107,53,0.18)';

  const sectionTitle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#FF6B35',
    marginBottom: '12px',
  };

  const sessionCount = Object.keys(sessionMap).length;

  return (
    <div
      id="dashboard-right-panel"
      className="fixed right-0 top-0 bottom-0 w-[340px] overflow-y-auto flex flex-col gap-4 p-4"
      style={{ background: isBright ? '#FFF8F0' : '#111010', scrollbarWidth: 'none' }}
    >
      {/* ── 1. Backgroundless Real-Time Mini Month Calendar ── */}
      <section id="mini-calendar-widget" className="pt-2">
        <MiniCalendar />
      </section>

      {/* ── 2. UPCOMING SESSIONS Agenda Calendar ── */}
      <section id="upcoming-sessions">
        <div
          className="rounded-2xl"
          style={{
            background: calendarBg,
            border: `1px solid ${calendarBorder}`,
            boxShadow: isBright
              ? '0 4px 24px rgba(234,88,12,0.08), 0 1px 4px rgba(0,0,0,0.04)'
              : '0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-4 pt-4 pb-3">
            <div>
              <h3 className="text-sm font-bold" style={{ color: textPrimary }}>Calendar</h3>
              <p className="text-xs mt-0.5" style={{ color: textMuted }}>{sessionCount} sessions today</p>
            </div>
            <button
              id="calendar-filter-today"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
              style={{
                background: isBright ? '#F5EDE6' : 'rgba(255,107,53,0.1)',
                border: '1px solid rgba(255,107,53,0.25)',
                color: '#FF6B35',
              }}
            >
              Today
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          <div style={{ height: '1px', background: calendarBorder, margin: '0 16px' }} />

          {/* Timeline body */}
          <div className="px-3 py-3 relative pr-4">
            <div
              className="absolute"
              style={{
                left: '51px',
                top: '16px',
                bottom: '16px',
                width: '2px',
                background: timelineColor,
                borderRadius: '999px',
              }}
            />

            {calendarSlots.map((slot) => {
              const session = slot.sessionId ? sessionMap[slot.sessionId] : null;
              const isNow = session?.isNow;

              if (!session && slot.time.endsWith(':30')) return null;

              return (
                <div key={slot.time} className="relative mb-2">
                  {isNow && (
                    <div
                      className="absolute flex items-center"
                      style={{ top: '-8px', left: '0', right: '0', zIndex: 2 }}
                    >
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#FF6B35',
                          marginLeft: '46px',
                          flexShrink: 0,
                          boxShadow: '0 0 8px rgba(255,107,53,0.6)',
                          border: `2px solid ${calendarBg}`,
                          zIndex: 3,
                        }}
                      />
                      <div
                        style={{
                          flex: 1,
                          marginLeft: '4px',
                          height: '1.5px',
                          backgroundImage:
                            'repeating-linear-gradient(90deg, rgba(255,107,53,0.65) 0px, rgba(255,107,53,0.65) 5px, transparent 5px, transparent 10px)',
                        }}
                      />
                    </div>
                  )}

                  <div
                    className="flex items-center gap-2"
                    style={{ paddingTop: isNow ? '10px' : '0' }}
                  >
                    <span
                      className="text-xs flex-shrink-0 font-medium tabular-nums"
                      style={{
                        width: '38px',
                        textAlign: 'right',
                        color: isNow ? '#FF6B35' : textMuted,
                        fontWeight: isNow ? 700 : 500,
                      }}
                    >
                      {slot.time}
                    </span>

                    <div
                      className="flex-shrink-0"
                      style={{
                        width: '8px',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {session && (
                        <div
                          style={{
                            width: isNow ? '10px' : '7px',
                            height: isNow ? '10px' : '7px',
                            borderRadius: '50%',
                            background: isNow ? '#FF6B35' : isBright ? '#D4BFB0' : '#3A2E26',
                            border: isNow ? `2px solid ${calendarBg}` : undefined,
                            boxShadow: isNow ? '0 0 6px rgba(255,107,53,0.5)' : undefined,
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </div>

                    {session ? (
                      <div
                        id={`session-${session.id}`}
                        className="flex-1 min-w-0 flex items-center gap-2.5 px-3 py-2.5 rounded-xl overflow-hidden transition-all duration-200 hover:scale-[1.015] cursor-pointer"
                        style={
                          isNow
                            ? {
                                background: 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 100%)',
                                boxShadow: '0 6px 20px rgba(255,107,53,0.35)',
                              }
                            : {
                                background: futureCardBg,
                                border: `1px solid ${futureCardBorder}`,
                                boxShadow: isBright
                                  ? '0 1px 6px rgba(0,0,0,0.04)'
                                  : '0 2px 8px rgba(0,0,0,0.2)',
                              }
                        }
                      >
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={
                            isNow
                              ? { background: 'rgba(255,255,255,0.22)', color: '#fff' }
                              : {
                                  background: isBright ? '#F0E6DF' : 'rgba(255,107,53,0.14)',
                                  color: '#FF6B35',
                                }
                          }
                        >
                          {session.avatar}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="text-xs font-bold leading-tight truncate"
                            style={{ color: isNow ? '#FFFFFF' : textPrimary }}
                          >
                            {session.topic}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <ClockIcon color={isNow ? 'rgba(255,255,255,0.7)' : (textMuted as string)} />
                            <p
                              className="text-xs truncate"
                              style={{ color: isNow ? 'rgba(255,255,255,0.78)' : textMuted }}
                            >
                              {session.timeStart}–{session.timeEnd}, {session.lesson}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ height: '4px', flex: 1 }} />
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-medium tabular-nums"
                style={{ width: '38px', textAlign: 'right', color: textMuted }}
              >
                14:30
              </span>
            </div>
          </div>

          <div style={{ padding: '0 12px 12px' }}>
            <button
              id="btn-book-session"
              className="w-full text-xs py-2 rounded-xl font-semibold transition-all hover:opacity-90 hover:scale-[1.01]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(232,93,44,0.07) 100%)',
                border: '1px solid rgba(255,107,53,0.22)',
                color: '#FF6B35',
              }}
            >
              + Book a New Session
            </button>
          </div>
        </div>
      </section>

      {/* ── 3. 3D Stacked Activity Deck Carousel ── */}
      <section id="activity-feed" className="py-1">
        <StackedActivityDeck />
      </section>

      {/* ── 4. Leaderboard ── */}
      <section id="right-leaderboard" className="pb-4">
        <p style={sectionTitle}>Top Learners</p>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: isBright ? '0 2px 12px rgba(234,88,12,0.06)' : '0 2px 12px rgba(0,0,0,0.25)' }}
        >
          {leaderboard.map((entry, i) => (
            <div key={entry.rank}>
              {entry.isMe && i > 0 && (
                <div className="flex items-center gap-2 px-3 py-1">
                  <div className="flex-1 h-px" style={{ background: cardBorder }} />
                  <span className="text-xs" style={{ color: textMuted }}>your rank</span>
                  <div className="flex-1 h-px" style={{ background: cardBorder }} />
                </div>
              )}
              <div
                className="flex items-center gap-3 px-3 py-2.5 transition-colors"
                style={{
                  background: entry.isMe
                    ? isBright ? 'rgba(255,107,53,0.08)' : 'rgba(255,107,53,0.1)'
                    : undefined,
                  borderBottom: i < leaderboard.length - 1 ? `1px solid ${cardBorder}` : undefined,
                }}
              >
                <span className="w-7 text-center text-xs font-bold flex-shrink-0" style={{ color: entry.rank <= 3 ? '#FF6B35' : textMuted }}>
                  {rankMedals[entry.rank] || `#${entry.rank}`}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: entry.isMe
                      ? 'linear-gradient(135deg, #FF6B35, #E85D2C)'
                      : isBright ? '#F3EDE8' : '#2A2420',
                    color: entry.isMe ? '#fff' : textPrimary,
                  }}
                >
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate" style={{ color: entry.isMe ? '#FF6B35' : textPrimary }}>
                    {entry.name}{entry.isMe ? ' (You)' : ''}
                  </p>
                </div>
                <span
                  className="text-xs font-bold flex-shrink-0"
                  style={{ color: entry.rank === 1 ? '#F59E0B' : entry.rank === 2 ? '#94A3B8' : entry.rank === 3 ? '#CD7F32' : textMuted }}
                >
                  {entry.points.toLocaleString()} pts
                </span>
              </div>
            </div>
          ))}
        </div>
        <a
          href="/dashboard/leaderboard"
          className="mt-2 block text-center text-xs py-2 rounded-xl font-medium transition-colors"
          style={{ color: '#FF6B35', background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.15)' }}
        >
          View Full Leaderboard →
        </a>
      </section>
    </div>
  );
}
