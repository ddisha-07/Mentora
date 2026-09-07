import Link from 'next/link';

export default function WhyMentoraPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">← Back to Home</Link>
        <h1 className="text-4xl font-bold">Why Mentora?</h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          Traditional learning management systems overwhelm learners with catalogues of hundreds of generic video courses. Mentora personalizes the experience from the inside out.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
            <h3 className="text-lg font-semibold text-rose-400 mb-2">Traditional Learning</h3>
            <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
              <li>One-size-fits-all curricula</li>
              <li>Hours wasted searching for content</li>
              <li>No link between courses and real career advancement</li>
              <li>Passive consumption with low retention</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-slate-900 border border-emerald-500/30">
            <h3 className="text-lg font-semibold text-emerald-400 mb-2">With Mentora</h3>
            <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
              <li>Role & level-tailored learning journeys</li>
              <li>Automatic skill-gap diagnostics</li>
              <li>Multi-modal learning (flashcards, videos, insights)</li>
              <li>Verified Skill Passport artifact</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
