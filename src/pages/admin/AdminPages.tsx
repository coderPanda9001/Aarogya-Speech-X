import { useState } from "react";
import { BookOpen, Bot, ClipboardCheck, ShieldCheck, Stethoscope, TrendingUp, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Button, Card, DemoBadge, Disclaimer, PageHeader, StatCard, Table } from "../../components/ui";
import {
  ADMIN_ACTIVITY,
  ADMIN_STATS,
  ADMIN_USERS,
  AI_MODELS,
  ASSESSMENTS,
  AUDIT_LOGS,
  CHILDREN,
  CONTENT_USAGE,
  MATERIALS,
  MOST_PRACTICED_SOUNDS,
  THERAPISTS,
} from "../../data/demoData";
import { useApp } from "../../store/AppContext";

export function AdminDashboard() {
  const { attempts } = useApp();
  return (
    <div>
      <PageHeader
        title="Platform Overview"
        subtitle="Aggregated product analytics for the AarogyaSpeech X pilot (all figures are demo values)."
        right={<DemoBadge label="Demo analytics" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Children" value={ADMIN_STATS.children.toLocaleString()} hint="+64 this week" tone="brand" icon={<Users size={16} />} />
        <StatCard label="Total Parents" value={ADMIN_STATS.parents.toLocaleString()} hint="86% activated" tone="sky" icon={<Users size={16} />} />
        <StatCard label="Therapists" value={THERAPISTS.length + 44} hint="12 pending KYC" tone="violet" icon={<Stethoscope size={16} />} />
        <StatCard label="Therapy Sessions" value={ADMIN_STATS.sessions.toLocaleString()} hint="+312 today" tone="green" icon={<TrendingUp size={16} />} />
        <StatCard label="Content Items" value={ADMIN_STATS.contentItems} hint="320 published" tone="amber" icon={<BookOpen size={16} />} />
        <StatCard label="Assessments" value={ADMIN_STATS.assessments.toLocaleString()} hint="88% completed" tone="brand" icon={<ClipboardCheck size={16} />} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Therapy Activity</p>
          <p className="text-xs text-slate-500">Sessions and assessments per day (demo)</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_ACTIVITY} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="sessions" name="Sessions" fill="#0d8d8a" radius={[6, 6, 0, 0]} />
                <Bar dataKey="assessments" name="Assessments" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Content Usage</p>
          <p className="text-xs text-slate-500">Share of practice opens by category</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CONTENT_USAGE} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={3}>
                  {CONTENT_USAGE.map((c) => (
                    <Cell key={c.name} fill={c.color} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Most Practiced Sounds</p>
          <ul className="mt-3 space-y-3">
            {MOST_PRACTICED_SOUNDS.map((s) => (
              <li key={s.sound}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-hi text-lg font-bold text-slate-800">{s.sound}</span>
                  <span className="text-xs text-slate-500">{s.count.toLocaleString()} attempts</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="animate-bar h-full rounded-full bg-brand-500" style={{ width: `${s.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] text-slate-400">
            Retroflextion (र / ड़ / ढ़) remains the most-practised sound family in the pilot.
          </p>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Consistency (Streak Leaders)</p>
          <div className="mt-3 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHILDREN.map((c) => ({ name: c.name, streak: c.streakDays, progress: c.progress }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="streak" name="Streak (days)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="progress" name="Progress %" stroke="#0d8d8a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Recent Audit Trail</p>
          <ul className="mt-3 space-y-2">
            {AUDIT_LOGS.slice(0, 4).map((l) => (
              <li key={l.id} className="rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
                <p className="text-sm font-semibold text-slate-800">{l.action}</p>
                <p className="text-xs text-slate-500">
                  {l.actor} · {l.target} · {l.at}
                </p>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="bg-gradient-to-br from-slate-900 to-slate-700 text-white">
          <p className="font-display text-lg font-bold">Demo session activity</p>
          <p className="mt-1 text-sm text-slate-200">
            {attempts.length} practice attempt(s) recorded in this browser session, generating {attempts.length} phoneme
            observation(s) for therapist review.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {attempts.slice(-2).map((a) => (
              <div key={a.id} className="rounded-xl bg-white/10 px-3 py-2.5">
                <p className="font-hi text-lg font-bold">{a.word}</p>
                <p className="text-xs text-slate-200">
                  {a.targetSound} → {a.observedSound} · {(a.confidence * 100).toFixed(0)}%
                </p>
              </div>
            ))}
            {attempts.length === 0 && (
              <div className="col-span-2 rounded-xl bg-white/10 px-3 py-3 text-xs text-slate-200">
                No practice attempts yet — run the child practice flow to see live data appear here.
              </div>
            )}
          </div>
        </Card>
      </div>

      <Disclaimer className="mt-6">
        Admin figures are synthetic demo values. AarogyaSpeech X does not provide medical diagnosis or replace a qualified
        therapist.
      </Disclaimer>
    </div>
  );
}

export function AdminUsers() {
  const [filter, setFilter] = useState<"all" | "child" | "parent" | "therapist">("all");
  const rows = ADMIN_USERS.filter((u) => filter === "all" || u.role === filter);
  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Children, parents and therapists on the platform (demo records)."
        right={
          <div className="flex gap-1.5">
            {(["all", "child", "parent", "therapist"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-bold capitalize ${
                  filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        }
      />
      <Card>
        <Table head={["Name", "Role", "Email", "Joined", "Status", "Action"]}>
          {rows.map((u) => (
            <tr key={u.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2.5 font-semibold text-slate-800">{u.name}</td>
              <td className="px-3 py-2.5">
                <Badge tone={u.role === "therapist" ? "violet" : u.role === "child" ? "brand" : "sky"}>{u.role}</Badge>
              </td>
              <td className="px-3 py-2.5 text-slate-500">{u.email}</td>
              <td className="px-3 py-2.5 text-slate-500">{u.joined}</td>
              <td className="px-3 py-2.5">
                <Badge tone={u.status === "Active" ? "green" : u.status === "Invited" ? "amber" : "red"}>{u.status}</Badge>
              </td>
              <td className="px-3 py-2.5">
                <Button size="sm" variant="secondary">
                  Manage
                </Button>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function AdminTherapists() {
  return (
    <div>
      <PageHeader title="Therapists" subtitle="Verified clinician network (demo)." right={<Badge tone="violet">46 registered</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THERAPISTS.map((t) => (
          <Card key={t.id}>
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-violet-50 text-xl ring-1 ring-violet-200 ring-inset">🩺</span>
              <div>
                <p className="font-display font-bold text-slate-900">{t.name}</p>
                <p className="text-[11px] text-slate-500">{t.qualification}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="brand">{t.city}</Badge>
              <Badge tone="sky">{t.activeChildren} active children</Badge>
              <Badge tone="green">KYC verified</Badge>
            </div>
            <Button size="sm" variant="secondary" className="mt-4 w-full">
              View profile
            </Button>
          </Card>
        ))}
        <Card className="flex flex-col items-center justify-center border-dashed text-center">
          <p className="text-3xl">➕</p>
          <p className="font-display mt-2 font-bold text-slate-900">Invite therapist</p>
          <p className="mt-1 text-xs text-slate-500">Onboarding is manual during the pilot.</p>
          <Button size="sm" className="mt-3">
            Send invite
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function AdminContent() {
  return (
    <div>
      <PageHeader
        title="Hindi Content Library"
        subtitle="Therapy materials by category, target sound and difficulty. Curated demo content."
        right={<Badge tone="brand">{MATERIALS.length} items in this dataset</Badge>}
      />
      <Card className="mb-5">
        <p className="font-display text-lg font-bold text-slate-900">Publishing pipeline</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          {[
            { k: "Published", v: 320, tone: "green" as const },
            { k: "In review", v: 14, tone: "amber" as const },
            { k: "Draft", v: 26, tone: "slate" as const },
            { k: "Retired", v: 8, tone: "red" as const },
          ].map((s) => (
            <div key={s.k} className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200 ring-inset">
              <p className="text-[10px] font-bold text-slate-500 uppercase">{s.k}</p>
              <p className="font-display text-2xl font-extrabold text-slate-900">{s.v}</p>
              <Badge tone={s.tone}>Hindi</Badge>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <Table head={["Word", "Meaning", "Category", "Target", "Position", "Difficulty"]}>
          {MATERIALS.map((m) => (
            <tr key={m.id} className="border-b border-slate-100 last:border-0">
              <td className="font-hi px-3 py-2.5 text-lg font-bold text-slate-900">{m.word}</td>
              <td className="px-3 py-2.5 text-slate-500">{m.meaning}</td>
              <td className="font-hi px-3 py-2.5 text-slate-600">{m.category}</td>
              <td className="font-hi px-3 py-2.5 text-lg font-bold text-brand-700">{m.targetSound}</td>
              <td className="px-3 py-2.5 text-slate-600">{m.position}</td>
              <td className="px-3 py-2.5">
                <Badge tone={m.difficulty === "Easy" ? "green" : m.difficulty === "Medium" ? "amber" : "red"}>{m.difficulty}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function AdminAnalytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Engagement, retention and outcome analytics (demo values)." right={<DemoBadge label="Demo analytics" />} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Weekly Sessions</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="sessions" fill="#0d8d8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Assessment Completion</p>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ADMIN_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="assessments" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card className="mt-5">
        <p className="font-display text-lg font-bold text-slate-900">Assessment Records</p>
        <div className="mt-3">
          <Table head={["Assessment", "Child", "Date", "Score", "Status"]}>
            {ASSESSMENTS.map((a) => (
              <tr key={a.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2.5 font-semibold text-slate-700">{a.name}</td>
                <td className="px-3 py-2.5 text-slate-500">{CHILDREN.find((c) => c.id === a.childId)?.name}</td>
                <td className="px-3 py-2.5 text-slate-500">{a.date}</td>
                <td className="px-3 py-2.5 text-slate-700">
                  {a.score}/{a.maxScore}
                </td>
                <td className="px-3 py-2.5">
                  <Badge tone={a.status === "Completed" ? "green" : "amber"}>{a.status}</Badge>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>
    </div>
  );
}

export function AdminAiModels() {
  return (
    <div>
      <PageHeader
        title="AI Models"
        subtitle="Model registry. In this MVP all speech inference is simulated in the browser — nothing is a medical device."
        right={<DemoBadge label="No real model connected" />}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AI_MODELS.map((m) => (
          <Card key={m.id}>
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200 ring-inset">
                <Bot size={18} />
              </span>
              <div>
                <p className="font-display font-bold text-slate-900">{m.name}</p>
                <p className="text-[11px] text-slate-500">v{m.version}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">{m.purpose}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone={m.status === "Demo / simulated" ? "violet" : m.status === "Planned" ? "slate" : "amber"}>{m.status}</Badge>
              <Badge tone="slate">Accuracy: {m.accuracy}</Badge>
            </div>
          </Card>
        ))}
        <Card className="border-dashed">
          <p className="font-display font-bold text-slate-900">Future architecture</p>
          <p className="mt-2 text-sm text-slate-600">
            Audio → feature extraction → phoneme recognizer (Hindi) → misarticulation classifier → therapist review queue.
            Planned as a FastAPI service; the frontend already calls it through <code className="rounded bg-slate-100 px-1">speechAnalysisService.analyzeSpeech()</code>.
          </p>
        </Card>
      </div>
    </div>
  );
}

export function AdminAuditLogs() {
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Who did what, when — required for clinical governance." right={<Badge tone="green"><ShieldCheck size={12} /> Immutable trail (demo)</Badge>} />
      <Card>
        <Table head={["Actor", "Action", "Target", "When"]}>
          {AUDIT_LOGS.map((l) => (
            <tr key={l.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2.5 font-semibold text-slate-800">{l.actor}</td>
              <td className="px-3 py-2.5 text-slate-600">{l.action}</td>
              <td className="px-3 py-2.5 font-hi text-slate-600">{l.target}</td>
              <td className="px-3 py-2.5 text-slate-500">{l.at}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
