import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Mic, Target, TrendingUp, Trophy } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Button, Card, DemoBadge, PageHeader, ProgressRing, StatCard } from "../../components/ui";
import { useApp } from "../../store/AppContext";
import { MATERIALS, PROGRESS_HISTORY, RECOMMENDED_ACTIVITIES, WEEKLY_PRACTICE } from "../../data/demoData";

export default function ChildDashboard() {
  const { activeChild, childProgress, streakDays, level, attempts, observations, isFreshAccount, weeklyPractice, updateTargetSound } = useApp();
  const navigate = useNavigate();
  const todayWord = MATERIALS[0];

  const chartData = attempts.length === 0
    ? [
        { label: "W1 Baseline", accuracy: 0 },
        { label: "W2 Baseline", accuracy: 0 },
        { label: "W3 Baseline", accuracy: 0 },
        { label: "Current Session", accuracy: 0 },
      ]
    : [
        { label: "W1 Baseline", accuracy: 0 },
        { label: "W2 Baseline", accuracy: Math.round(childProgress * 0.3) },
        { label: "W3 Baseline", accuracy: Math.round(childProgress * 0.6) },
        { label: "Current Session", accuracy: childProgress },
      ];

  return (
    <div>
      <PageHeader
        hindi
        title={`नमस्ते ${activeChild.hindiName}! 👋`}
        subtitle={`${activeChild.name} • Age ${activeChild.age} • Today's mission: make the "${activeChild.targetSound}" sound super strong!`}
        right={
          <>
            {isFreshAccount ? (
              <Badge tone="emerald">🌱 Fresh User Account ({childProgress}% Progress)</Badge>
            ) : (
              <DemoBadge label="Curated Therapy Content" />
            )}
            <Button onClick={() => navigate("/child/therapy")}>
              <Mic size={16} /> Start Practice
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Target Sound</p>
            <select
              value={activeChild.targetSound}
              onChange={(e) => updateTargetSound(e.target.value)}
              className="font-hi font-display text-2xl font-extrabold text-brand-600 bg-brand-50 border border-brand-200 rounded-xl px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="र">र</option>
              <option value="स">स</option>
              <option value="श">श</option>
              <option value="क">क</option>
              <option value="ल">ल</option>
              <option value="त">त</option>
              <option value="फ">फ</option>
            </select>
          </div>
          <div className="min-w-0 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Sound focus</p>
            <p>Initial position · {level} level</p>
            <Badge tone="brand" className="mt-1">
              Level: {level}
            </Badge>
          </div>
        </Card>
        <StatCard label="Practice Streak" value={`${streakDays} Days`} hint="🔥 Keep practicing!" icon={<Flame size={18} />} tone="amber" />
        <StatCard
          label="Overall Progress"
          value={`${childProgress}%`}
          hint={attempts.length > 0 ? `${attempts.length} practice attempt(s) logged` : "Fresh start baseline: 0%"}
          icon={<TrendingUp size={18} />}
          tone="green"
        />
        <StatCard
          label="Stars Earned"
          value={`${attempts.length * 2} ⭐`}
          hint={level === "Words" ? "3 matches to reach Sentences" : "Sentence master!"}
          icon={<Trophy size={18} />}
          tone="violet"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-slate-900">Speech Practice Progress</p>
              <p className="text-xs text-slate-500">Accuracy % of the target sound across recent weeks</p>
            </div>
            <Badge tone={childProgress > 0 ? "green" : "slate"}>
              {attempts.length > 0 ? `+${childProgress}% since start` : "0% Baseline"}
            </Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="acc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16afa9" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#16afa9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                  formatter={(value: unknown, name: unknown) =>
                    [`${value}${name === "accuracy" ? "%" : ""}`, name === "accuracy" ? "Accuracy" : "Attempts"] as [
                      string,
                      string,
                    ]}
                />
                <Area type="monotone" dataKey="accuracy" stroke="#0d8d8a" strokeWidth={3} fill="url(#acc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-4 text-center">
          <p className="font-display text-lg font-bold text-slate-900">Sound Mastery</p>
          <ProgressRing value={childProgress} sublabel={`${activeChild.targetSound} mastery`} size={132} />
          <div className="w-full rounded-xl bg-brand-50 p-3 text-left ring-1 ring-brand-100 ring-inset">
            <p className="text-[10px] font-bold text-brand-700 uppercase">Next level</p>
            <p className="text-sm font-semibold text-slate-800">Sentence level with {activeChild.targetSound} words</p>
          </div>
          <Button variant="secondary" className="w-full" onClick={() => navigate("/child/digital-twin")}>
            View Speech Profile <ArrowRight size={16} />
          </Button>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">This Week's Practice</p>
            <Badge tone="sky">Minutes per day</Badge>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPractice} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="minutes" fill="#38cbc4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Recommended Practice</p>
            <Badge tone="brand">
              <Target size={12} /> Rule-based
            </Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {RECOMMENDED_ACTIVITIES.map((a) => (
              <Link key={a.title} to={a.route}>
                <Card className="h-full transition-transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-slate-50 text-xl ring-1 ring-slate-200 ring-inset">
                      {a.emoji}
                    </span>
                    <ArrowRight className="text-slate-300" size={18} />
                  </div>
                  <p className="font-hi mt-3 font-display text-base font-bold text-slate-900">{a.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{a.detail}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="bg-gradient-to-br from-brand-50 to-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="animate-floaty grid size-16 place-items-center rounded-2xl bg-white text-4xl ring-1 ring-brand-100 ring-inset">
                {todayWord.emoji}
              </span>
              <div>
                <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">आज का शब्द</p>
                <p className="font-hi font-display text-3xl font-extrabold text-slate-900">{todayWord.word}</p>
                <div className="mt-1 flex gap-2">
                  <Badge tone="brand">Target: {todayWord.targetSound}</Badge>
                  <Badge tone="sky">{todayWord.position}</Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate("/child/therapy")}>
              <Mic size={16} /> Practice रथ
            </Button>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Recent Practice Attempts</p>
            <Link to="/child/progress" className="text-xs font-semibold text-brand-700 hover:underline">
              See all
            </Link>
          </div>
          {attempts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center">
              <p className="text-3xl">🎤</p>
              <p className="font-display mt-2 font-bold text-slate-900">No practice today yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Record a word for the first time — your speech analysis will appear here.
              </p>
              <Button size="sm" className="mt-3" onClick={() => navigate("/child/therapy")}>
                Start now
              </Button>
            </div>
          ) : (
            <ul className="space-y-2">
              {attempts.slice(-4).reverse().map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-slate-200 ring-inset">
                  <div className="flex items-center gap-3">
                    <span className="font-hi font-display text-xl font-bold text-slate-900">{a.word}</span>
                    <span className="text-xs text-slate-500">
                      {a.targetSound} → {a.observedSound}
                    </span>
                  </div>
                  <Badge tone={a.errorType === "match" ? "green" : "amber"}>
                    {(a.confidence * 100).toFixed(0)}% · {a.errorType}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-[11px] text-slate-400">
            {observations.length} phoneme observations available for therapist review.
          </p>
        </Card>
      </div>
    </div>
  );
}
