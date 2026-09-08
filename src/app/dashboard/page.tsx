import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold">Learner Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Track your active journeys, skill acquisition, and next milestones.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="px-4 py-2 text-sm text-orange-400 hover:text-orange-300 border border-orange-500/30 bg-orange-500/10 rounded-lg transition-colors font-medium"
            >
              Admin Panel
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-800 rounded-lg"
            >
              Exit to Home
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Journey</span>
            <div className="text-xl font-bold mt-1 text-white">Full-Stack Architect</div>
            <div className="text-xs text-indigo-400 mt-2">Level 2 of 5 Unlocked</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Skills Mastered</span>
            <div className="text-2xl font-bold mt-1 text-emerald-400">8 / 24</div>
            <div className="text-xs text-slate-400 mt-2">3 pending verification</div>
          </div>
          <Link
            href="/leaderboard"
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-colors group block"
          >
            <span className="text-xs text-slate-400 uppercase font-semibold group-hover:text-amber-400 transition-colors">
              Leaderboard Rank →
            </span>
            <div className="text-2xl font-bold mt-1 text-amber-400">#5 Active</div>
            <div className="text-xs text-slate-400 mt-2">View Global Standings</div>
          </Link>
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase font-semibold">Skill Passport</span>
            <div className="text-xl font-bold mt-1 text-purple-400">Verified</div>
            <div className="text-xs text-slate-400 mt-2">Public credential active</div>
          </div>
        </div>

        {/* Dashboard Sub-sections Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/journeys/demo"
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-colors block space-y-3"
          >
            <h3 className="text-lg font-semibold text-white">My Journeys</h3>
            <p className="text-sm text-slate-400">View your active roadmap, unlock next levels, and access module lessons.</p>
            <div className="text-xs text-indigo-400 font-medium">Open Roadmap →</div>
          </Link>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-lg font-semibold text-white">Community & Mentorship</h3>
            <p className="text-sm text-slate-400">Engage in technical discussions and book 1:1 sessions with industry mentors.</p>
            <div className="text-xs text-slate-500 font-medium">Coming Soon</div>
          </div>
          <Link
            href="/leaderboard"
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-colors block space-y-3"
          >
            <h3 className="text-lg font-semibold text-white">Leaderboard & Skill Quizzes</h3>
            <p className="text-sm text-slate-400">Take assessments (≥70% pass), earn leaderboard points, and compete with peers.</p>
            <div className="text-xs text-amber-400 font-medium">View Standings & Take Quiz →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
