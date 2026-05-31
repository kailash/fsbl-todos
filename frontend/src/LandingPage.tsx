import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Zap,
  RotateCcw,
  Trophy,
  Target,
  Users,
  ChevronRight,
  Briefcase,
  GraduationCap,
} from 'lucide-react'

const FIB = [1, 2, 3, 5, 8, 13, 21, 34, 55]

const BAR_COLORS = [
  'bg-teal-400',
  'bg-teal-400',
  'bg-violet-400',
  'bg-violet-500',
  'bg-indigo-500',
  'bg-indigo-600',
  'bg-indigo-700',
  'bg-slate-400',
  'bg-slate-400',
]

export function LandingPage() {
  const nav = useNavigate()
  const goToApp = () => nav('/app/fsbl-todo')

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm shadow-violet-200">
              <Zap size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-slate-900 tracking-wide">FSBL</span>
              <span className="hidden sm:inline text-slate-400 text-sm font-medium">
                Fibonacci Spaced Learning
              </span>
            </div>
          </div>
          <button
            onClick={goToApp}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200"
          >
            Open App <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-white to-indigo-50 pt-16 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(167,139,250,0.18)_0%,_transparent_60%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Zap size={10} /> Spaced Repetition · Fibonacci Method
            </div>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight tracking-tight text-slate-900 mb-5">
              Master anything.
              <br />
              <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                Forget nothing.
              </span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              FSBL uses the Fibonacci sequence to schedule your reviews at exactly the right moment
              — just before you forget. Build deep, lasting knowledge without endless grinding.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
              <button
                onClick={goToApp}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-[15px] font-bold hover:opacity-90 transition-opacity shadow-lg shadow-violet-200 w-full sm:w-auto justify-center"
              >
                <Zap size={16} /> Try FSBL for Free
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 px-6 py-3.5 text-slate-600 border border-slate-200 rounded-xl text-[15px] font-semibold hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center"
              >
                How it works <ChevronRight size={14} />
              </a>
            </div>

            {/* Fibonacci intervals visualization */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/80 p-6 text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
                Review interval (days) — grows with each successful review
              </p>
              <div className="flex items-end gap-2">
                {FIB.map((d, i) => (
                  <div key={d} className="flex flex-col items-center gap-1.5 flex-1">
                    <div
                      className={`w-full rounded-t-md ${BAR_COLORS[i]}`}
                      style={{ height: Math.min(8 + d * 2.4, 80) }}
                    />
                    <span className="text-[10px] font-bold text-slate-500">{d}d</span>
                  </div>
                ))}
                <div className="flex items-end pb-5 pl-1 text-slate-400 text-xl font-light">
                  ···
                </div>
              </div>
              <p className="text-[11.5px] text-slate-400 mt-4 leading-relaxed">
                Each successful review pushes the next one further into the future. Your brain
                builds stronger pathways — you review <em>less</em> as retention deepens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">How FSBL works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Three simple steps. One powerful habit.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                icon: BookOpen,
                color: 'text-violet-600',
                bg: 'bg-violet-50',
                border: 'border-violet-100',
                title: 'Add what you want to learn',
                desc: 'Create a todo with a topic, skill, or concept. Tag it as Learning, Work, Personal, or Future to keep things organised.',
              },
              {
                step: '02',
                icon: RotateCcw,
                color: 'text-teal-600',
                bg: 'bg-teal-50',
                border: 'border-teal-100',
                title: 'Review when scheduled',
                desc: 'FSBL shows exactly which items are due today, overdue, or upcoming. Mark it reviewed and the system handles the rest.',
              },
              {
                step: '03',
                icon: Brain,
                color: 'text-indigo-600',
                bg: 'bg-indigo-50',
                border: 'border-indigo-100',
                title: 'Fibonacci reschedules automatically',
                desc: 'Intervals grow: 1 → 2 → 3 → 5 → 8 → 13 days… You review less over time as retention deepens into long-term memory.',
              },
            ].map(({ step, icon: Icon, color, bg, border, title, desc }) => (
              <div key={step} className={`rounded-2xl border ${border} ${bg} p-6`}>
                <div
                  className={`w-10 h-10 bg-white rounded-xl border ${border} flex items-center justify-center mb-4 shadow-sm`}
                >
                  <Icon size={18} className={color} />
                </div>
                <span className={`text-[10px] font-black ${color} uppercase tracking-widest`}>
                  {step}
                </span>
                <h3 className="text-[15px] font-bold text-slate-800 mt-1 mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Built for everyone who wants to grow
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Whether you're preparing for exams or mastering a new skill at work, FSBL adapts to
              your goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Students */}
            <div className="bg-white rounded-2xl border border-violet-100 p-8">
              <div className="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-5">
                <GraduationCap size={22} className="text-violet-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">For Students</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Stop cramming the night before. With FSBL, each study session builds on the last, so
                what you learn actually sticks — through exams and years beyond.
              </p>
              <ul className="space-y-3">
                {[
                  'Language vocabulary — review words at perfect spacing to build fluency',
                  "Exam prep — dates, formulas, and concepts that won't fade under pressure",
                  'Programming — reinforce syntax, patterns, and algorithms over weeks',
                  'History & science — build a connected web of durable knowledge',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-slate-600">
                    <CheckCircle2 size={15} className="text-violet-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Professionals */}
            <div className="bg-white rounded-2xl border border-teal-100 p-8">
              <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-5">
                <Briefcase size={22} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">For Professionals</h3>
              <p className="text-slate-500 mb-6 leading-relaxed">
                In a fast-moving industry, skills go stale fast. Use FSBL to reinforce what you
                learn from courses, books, and real on-the-job experience — and compound it over
                time.
              </p>
              <ul className="space-y-3">
                {[
                  'Tech skills — keep frameworks, APIs, and tools fresh in your mind',
                  'Certifications — retain knowledge long after the exam date',
                  'Meeting insights — turn action items and learnings into lasting habits',
                  'Leadership — systematically reinforce communication and strategy skills',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[13.5px] text-slate-600">
                    <CheckCircle2 size={15} className="text-teal-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-slate-900 mb-3">
              Everything you need to stay sharp
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              A focused set of tools — no bloat, no noise. Just learning.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Brain,
                bg: 'bg-violet-50',
                border: 'border-violet-100',
                color: 'text-violet-600',
                title: 'Smart Scheduling',
                desc: 'Fibonacci intervals (1 → 2 → 3 → 5 → 8 → 13 days) ensure you review exactly when your brain needs it most.',
              },
              {
                icon: Target,
                bg: 'bg-teal-50',
                border: 'border-teal-100',
                color: 'text-teal-600',
                title: 'Category Filtering',
                desc: 'Tag items as Learning, Work, Personal, or Future. Filter any panel instantly with one click.',
              },
              {
                icon: Trophy,
                bg: 'bg-amber-50',
                border: 'border-amber-100',
                color: 'text-amber-600',
                title: 'Progress Tracking',
                desc: 'Streak counter, weekly activity graph, and mastered-item count show your compounding progress.',
              },
              {
                icon: Users,
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
                color: 'text-emerald-600',
                title: 'Task Management',
                desc: 'Blend learning with day-to-day tasks and reminders — everything in one clean, distraction-free workspace.',
              },
            ].map(({ icon: Icon, bg, border, color, title, desc }) => (
              <div key={title} className={`rounded-xl border ${border} ${bg} p-5`}>
                <Icon size={22} className={`${color} mb-3`} />
                <h4 className="text-[14px] font-bold text-slate-800 mb-1.5">{title}</h4>
                <p className="text-[12.5px] text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to remember more?</h2>
          <p className="text-violet-200 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Start adding what you want to learn and FSBL will take care of the rest — reviewing at
            exactly the right time, every time.
          </p>
          <button
            onClick={goToApp}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-violet-700 rounded-xl text-base font-black hover:bg-violet-50 transition-colors shadow-xl shadow-violet-900/30"
          >
            <Zap size={18} /> Open FSBL App <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap size={12} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-black text-white tracking-wide text-sm">FSBL</span>
            <span className="text-slate-600 text-xs">Fibonacci Spaced Learning</span>
          </div>
          <p className="text-xs text-slate-600">
            Built to help you learn better, one review at a time.
          </p>
        </div>
      </footer>
    </div>
  )
}
