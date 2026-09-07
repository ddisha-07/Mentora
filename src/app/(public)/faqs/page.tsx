import Link from 'next/link';

export default function FAQsPage() {
  const faqs = [
    {
      q: 'How does Mentora determine my personalized roadmap?',
      a: 'During onboarding, Mentora assesses your current role, experience, existing skills, and target career aspirations. Our personalization engine computes the skill gap and generates a level-gated journey.',
    },
    {
      q: 'What is the Skill Passport?',
      a: 'The Skill Passport is a shareable, verifiable digital record of your mastered competencies, backed by quiz completions and module assessments.',
    },
    {
      q: 'Can organizations integrate Mentora with their internal L&D?',
      a: 'Yes, Mentora supports organizational accounts with custom skill requirements, team analytics, and cohort tracking.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">← Back to Home</Link>
        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <div className="space-y-4 pt-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-6 rounded-xl bg-slate-900 border border-slate-800">
              <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
