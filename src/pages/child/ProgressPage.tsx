import { useMemo } from "react";
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

export default function ProgressPage() {
  const { attempts, childProgress, streakDays, activeChild, observations, weeklyPractice, level } = useApp();
  const navigate = useNavigate();

  // Dynamic Speech Practice Progress (Area Chart)
  const chartData = useMemo(() => {
    const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Current Session"];
    if (attempts.length === 0) {
      return labels.map((label) => ({ label, accuracy: 0 }));
    }
    const points: { label: string; accuracy: number }[] = [];
    const stepCount = labels.length;
    for (let i = 0; i < stepCount - 1; i++) {
      const sliceEnd = Math.max(1, Math.floor(((i + 1) / (stepCount - 1)) * attempts.length));
      const slice = attempts.slice(0, sliceEnd);
      const matches = slice.filter((a) => a.errorType === "match").length;
      const acc = Math.round((matches / slice.length) * 100);
      points.push({ label: labels[i], accuracy: acc });
    }
    points.push({ label: "Current Session", accuracy: childProgress });
    return points;
  }, [attempts, childProgress]);

  // Dynamic Sound Mastery (Bar Chart)
  const soundMastery = useMemo(() => {
    const sounds = ["र", "स", "क", "श", "ल", "त"];
    if (attempts.length === 0) {
      return sounds.map((sound) => ({ sound, value: 0 }));
    }
    return sounds.map((sound) => {
      const soundAtts = attempts.filter(
        (a) => a.targetSound === sound || a.word.includes(sound)
      );
      if (soundAtts.length === 0) {
        return { sound, value: 0 };
      }
      const matches = soundAtts.filter((a) => a.errorType === "match").length;
      const val = Math.round((matches / soundAtts.length) * 100);
      return { sound, value: val };
    });
  }, [attempts]);

  // Dynamic Speech Skills Radar
  const radarData = useMemo(() => {
    if (attempts.length === 0) {
      return [
        { skill: "Sound Production", score: 0 },
        { skill: "Word Practice", score: 0 },
        { skill: "Sentence Practice", score: 0 },
        { skill: "Story Practice", score: 0 },
        { skill: "Conversation", score: 0 },
        { skill: "Consistency", score: 0 },
      ];
    }
    const matches = attempts.filter((a) => a.errorType === "match").length;
    const accuracy = Math.round((matches / attempts.length) * 100);

    return [
      { skill: "Sound Production", score: accuracy },
      { skill: "Word Practice", score: Math.min(100, attempts.length * 15) },
      { skill: "Sentence Practice", score: level === "Sentences" ? Math.min(100, matches * 25) : Math.min(40, attempts.length * 5) },
      { skill: "Story Practice", score: Math.min(100, attempts.length * 4) },
      { skill: "Conversation", score: Math.min(100, attempts.length * 3) },
      { skill: "Consistency", score: Math.min(100, streakDays * 20) },
    ];
  }, [attempts, level, streakDays]);

  // Dynamic Most Practiced Sounds
  const mostPracticedSounds = useMemo(() => {
    const sounds = ["र", "स", "क", "श", "ल", "त"];
    const total = attempts.length;
    if (total === 0) {
      return sounds.map((sound) => ({ sound, count: 0, percent: 0 }));
    }

    const counts = sounds.map((sound) => {
      const count = attempts.filter((a) => a.targetSound === sound).length;
      return {
        sound,
        count,
        percent: Math.round((count / total) * 100),
      };
    });

    return counts.sort((a, b) => b.count - a.count);
  }, [attempts]);

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
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Speech Practice Progress</p>
            <Badge tone={childProgress > 0 ? "green" : "slate"}>
              {attempts.length > 0 ? `${childProgress}% Accuracy` : "0% Baseline"}
            </Badge>
          </div>
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
              <LineChart data={weeklyPractice} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
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
              <RadarChart data={radarData} outerRadius="72%">
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
              {mostPracticedSounds.map((s) => (
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
