import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  HeartPulse,
  LineChart,
  Mic,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
} from "lucide-react";
import { Badge, Button, Card, Disclaimer } from "../components/ui";
import { useApp } from "../store/AppContext";

const STEPS = ["Practice", "Record", "Analyze", "Personalize", "Track Progress"];

const FEATURES = [
  { icon: <BookOpen size={20} />, title: "Hindi Therapy Materials", body: "Curated स्वर, व्यंजन, चित्र and कहानी sets — 60+ items tagged by target sound and position." },
  { icon: <Mic size={20} />, title: "Speech Analysis", body: "Real microphone recording with an AI layer that maps expected vs observed phonemes." },
  { icon: <Sparkles size={20} />, title: "Personalized Practice", body: "Rule-based therapy ladder from Sound → Syllable → Word → Sentence → Story." },
  { icon: <LineChart size={20} />, title: "Progress Tracking", body: "Accuracy trends, streaks, practice minutes and per-sound mastery for every child." },
  { icon: <Stethoscope size={20} />, title: "Therapist Support", body: "Phoneme error tables, confusion matrix and accept / modify / reject review on AI output." },
  { icon: <Users size={20} />, title: "Parent Monitoring", body: "Simple weekly summary, home activities and upcoming session reminders." },
];

export default function Landing() {
  const navigate = useNavigate();
  const { setRole, currentUser } = useApp();

  const go = (role: "child" | "parent" | "therapist", to: string) => {
    if (currentUser) {
      setRole(role);
      navigate(to);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-brand-50/40 to-[#f6f9fc]">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg text-white">
              ✚
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg font-extrabold text-slate-900">AarogyaSpeech X</p>
              <p className="text-[11px] font-semibold text-brand-600">हिंदी वाक् अभ्यास • Speech Therapy Support</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a href="#problem" className="hover:text-brand-700">Problem</a>
            <a href="#how" className="hover:text-brand-700">How it works</a>
            <a href="#features" className="hover:text-brand-700">Features</a>
            <Link to="/login" className="hover:text-brand-700">Sign In</Link>
          </nav>
          <Button size="sm" variant="secondary" onClick={() => navigate("/login")}>
            Sign In / Register
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-24 size-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="animate-rise">
            <Badge tone="brand">Problem Statement · Develop therapy materials in Hindi for misarticulation</Badge>
            <h1 className="font-display mt-4 text-4xl leading-tight font-extrabold text-slate-900 sm:text-5xl lg:text-6xl">
              AarogyaSpeech <span className="text-brand-600">X</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              AI-assisted Hindi speech practice and personalized therapy support for children.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate("/login")}>
                🎤 Start Therapy <ArrowRight size={18} />
              </Button>
              <Button size="lg" variant="secondary" onClick={() => go("parent", "/parent/dashboard")}>
                👩‍👦 Parent Dashboard
              </Button>
              <Button size="lg" variant="dark" onClick={() => go("therapist", "/therapist/dashboard")}>
                🩺 Therapist Dashboard
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Mic size={14} /> Real MediaRecorder capture</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> No diagnosis claims</span>
              <span className="inline-flex items-center gap-1.5"><HeartPulse size={14} /> Child-safe UI</span>
            </div>
          </div>

          <Card className="animate-rise relative overflow-hidden lg:p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Live Practice Flow</p>
              <Badge tone="violet">⚡ AI Speech Analysis</Badge>
            </div>
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-brand-50 to-white p-5 ring-1 ring-brand-100 ring-inset">
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">आज का शब्द</p>
              <p className="font-hi font-display text-5xl font-extrabold text-slate-900">रथ</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="brand">Target: र</Badge>
                <Badge tone="sky">Position: Initial</Badge>
                <Badge tone="amber">Level: Words</Badge>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {[
                { k: "Expected", v: "र", tone: "text-slate-900" },
                { k: "Observed", v: "ल", tone: "text-rose-600" },
                { k: "Type", v: "Substitution", tone: "text-slate-900 text-sm" },
              ].map((x) => (
                <div key={x.k} className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200 ring-inset">
                  <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">{x.k}</p>
                  <p className={`font-hi font-display text-2xl font-bold ${x.tone}`}>{x.v}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200 ring-inset">
              <p className="text-xs font-bold text-amber-800">Possible pronunciation pattern detected</p>
              <Badge tone="amber">Needs therapist review</Badge>
            </div>
            <Button className="mt-4 w-full" onClick={() => navigate("/login")}>
              Try the practice flow <ArrowRight size={16} />
            </Button>
          </Card>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Badge tone="red">The problem</Badge>
            <h2 className="font-display mt-3 text-3xl font-extrabold text-slate-900">
              Structured Hindi speech-therapy materials are hard to find
            </h2>
            <p className="mt-3 text-slate-600">
              Most misarticulation practice material available to Indian families is in English, print-only, or
              scattered across WhatsApp groups. Parents get words without target-sound tags, therapists get
              no carry-over data, and children lose motivation after a few days.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: "🗂️", t: "Scattered content", d: "No tagging by sound, position or difficulty level." },
              { emoji: "🔁", t: "No home carry-over", d: "Session gains do not convert into daily practice." },
              { emoji: "📉", t: "Invisible progress", d: "Parents cannot see what improved this week." },
            ].map((c) => (
              <Card key={c.t}>
                <p className="text-2xl">{c.emoji}</p>
                <p className="font-display mt-2 font-bold text-slate-900">{c.t}</p>
                <p className="mt-1 text-sm text-slate-500">{c.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4">
          <Badge tone="brand">How it works</Badge>
          <h2 className="font-display mt-3 text-3xl font-extrabold text-slate-900">One loop, five reliable steps</h2>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="animate-rise rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 px-4 py-3 ring-1 ring-brand-100 ring-inset">
                  <p className="text-[10px] font-bold text-brand-600">STEP {i + 1}</p>
                  <p className="font-display font-bold text-slate-900">{s}</p>
                </div>
                {i < STEPS.length - 1 && <ArrowRight className="text-slate-300" size={18} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-12">
        <Badge tone="violet">Features</Badge>
        <h2 className="font-display mt-3 text-3xl font-extrabold text-slate-900">Built for child, parent and therapist</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.title} className="transition-transform hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset">
                {f.icon}
              </span>
              <p className="font-display mt-3 text-lg font-bold text-slate-900">{f.title}</p>
              <p className="mt-1 text-sm text-slate-500">{f.body}</p>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            { n: "104+", l: "Hindi therapy materials" },
            { n: "5", l: "Therapy ladder levels" },
            { n: "4", l: "Role-based dashboards" },
            { n: "<1 min", l: "To practice end-to-end" },
          ].map((s) => (
            <Card key={s.l} className="text-center">
              <p className="font-display text-3xl font-extrabold text-brand-600">{s.n}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">{s.l}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Card className="bg-slate-900 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-bold">Ready to practice now?</p>
              <p className="mt-1 text-sm text-slate-300">
                Continue as Child → practice रथ → record → analyze → therapist review → parent sees updated progress.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={() => navigate("/login")}>
                Get Started / Sign In
              </Button>
              <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate("/child/digital-twin")}>
                <BarChart3 size={16} /> Speech Profile
              </Button>
            </div>
          </div>
        </Card>

        <Disclaimer className="mt-6">
          AarogyaSpeech X is an AI-assisted speech-practice and therapy-support platform. It does not provide medical
          diagnosis or replace a qualified therapist. All speech analysis provides AI decision support.
        </Disclaimer>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 AarogyaSpeech X · Speech AI Platform · Curated therapy content.</p>
          <p>React · TypeScript · Vite · Tailwind · Recharts · MediaRecorder</p>
        </div>
      </footer>
    </div>
  );
}
