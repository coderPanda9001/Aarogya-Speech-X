import { useNavigate } from "react-router-dom";
import { ArrowRight, Mic } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Button, Card, EmptyState, PageHeader, ProgressRing, StatCard } from "../../components/ui";
import { useApp } from "../../store/AppContext";
import { MOST_PRACTICED_SOUNDS, PROGRESS_HISTORY, SPEECH_PROFILE_RADAR, WEEKLY_PRACTICE } from "../../data/demoData";

export default function ProgressPage() {
  const { attempts, childProgress, streakDays, activeChild, observations } = useApp();
  const navigate = useNavigate();

  const chartData = PROGRESS_HISTORY.map((p, i) => ({
    ...p,
    accuracy: i === PROGRESS_HISTORY.length - 1 ? childProgress : p.accuracy,
  }));

  const soundMastery = [
    { sound: "र", value: childProgress },
    { sound: "स", value: 64 },
    { sound: "क", value: 81 },
    { sound: "श", value: 45 },
    { sound: "ल", value: 58 },
  ];

  return (
    <div>
      <PageHeader
        hindi
        title="मेरी प्रगति"
        subtitle="Accuracy trend, practice consistency and which Hindi sounds are becoming stable."
        right={<Badge tone="violet">⚡ Progress Analytics</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall Progress" value={`${childProgress}%`} hint="Weighted target-sound accuracy" tone="brand" icon={<ArrowRight size={16} />} />
        <StatCard label="Practice Streak" value={`${streakDays} days`} hint="Consecutive practice days" tone="amber" />
        <StatCard label="Attempts Logged" value={attempts.length} hint="This active session" tone="violet" />
        <StatCard label="Observations" value={observations.length} hint="Phoneme samples in profile" tone="sky" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Speech Practice Progress</p>
          <p className="text-xs text-slate-500">Target sound accuracy (%) over recent weeks</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0d8d8a" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0d8d8a" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" stroke="#0d8d8a" strokeWidth={3} fill="url(#pg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Weekly Practice Minutes &amp; Score</p>
          <p className="text-xs text-slate-500">Consistency matters more than long sessions</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={WEEKLY_PRACTICE} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="minutes" stroke="#38cbc4" strokeWidth={3} dot={{ r: 3 }} name="Minutes" />
                <Line type="monotone" dataKey="score" stroke="#a78bfa" strokeWidth={3} dot={{ r: 3 }} name="Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Sound Mastery</p>
          <p className="text-xs text-slate-500">Mastery per Hindi sound</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={soundMastery} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="sound" tick={{ fontSize: 14, fill: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#0d8d8a" name="Mastery %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Speech Skills Radar</p>
          <p className="text-xs text-slate-500">Self-progress profile (not a clinical score)</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={SPEECH_PROFILE_RADAR} outerRadius="72%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: "#475569" }} />
                <Radar dataKey="score" stroke="#7c9cf5" fill="#7c9cf5" fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.24fr_0.76fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Practice History</p>
            <Badge tone="slate">{attempts.length} attempts</Badge>
          </div>
          {attempts.length === 0 ? (
            <EmptyState
              icon="📈"
              title="No practice recorded in this session yet"
              description="Progress graphs show historical trends. Record a word to append real attempts into your progress history."
              action={
                <Button onClick={() => navigate("/child/therapy")}>
                  <Mic size={16} /> Go to practice
                </Button>
              }
            />
          ) : (
            <ul className="space-y-2">
              {attempts
                .slice()
                .reverse()
                .map((a) => (
                  <li key={a.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 ring-inset">
                    <div className="flex items-center gap-3">
                      <span className="font-hi font-display text-xl font-bold text-slate-900">{a.word}</span>
                      <span className="text-xs text-slate-500">
                        {a.targetSound} → {a.observedSound} · {a.errorType}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={a.errorType === "match" ? "green" : "amber"}>{(a.confidence * 100).toFixed(0)}%</Badge>
                      <span className="hidden text-[11px] text-slate-400 sm:inline">
                        {new Date(a.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </Card>

        <div className="space-y-5">
          <Card className="text-center">
            <p className="font-display font-bold text-slate-900">Target Sound Mastery</p>
            <div className="mt-3 flex justify-center">
              <ProgressRing value={childProgress} sublabel={`${activeChild.targetSound} sound`} />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Mastery score for {activeChild.hindiName} — review with therapist before changing therapy plan.
            </p>
          </Card>
          <Card>
            <p className="font-display font-bold text-slate-900">Most Practiced Sounds</p>
            <ul className="mt-3 space-y-2.5">
              {MOST_PRACTICED_SOUNDS.map((s) => (
                <li key={s.sound}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-hi font-bold text-slate-800">{s.sound}</span>
                    <span className="text-xs text-slate-500">{s.count} attempts</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="animate-bar h-full rounded-full bg-brand-500" style={{ width: `${s.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
