import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 md:p-16">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-indigo-400 hover:text-indigo-300">← Back to Home</Link>
        <h1 className="text-4xl font-bold">Contact Mentora</h1>
        <p className="text-slate-400">
          Have questions or want to partner with us for your organization? Reach out below.
        </p>
        <form className="space-y-4 pt-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
            <textarea
              rows={4}
              placeholder="How can we help?"
              className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>
          <button
            type="button"
            className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
