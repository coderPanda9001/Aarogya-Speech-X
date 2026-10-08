import { Link } from "react-router-dom";
import { CalendarClock, CheckCircle2, HeartHandshake, Mic, TrendingUp, Users } from "lucide-react";
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
import { Badge, Button, Card, Disclaimer, EmptyState, PageHeader, ProgressRing, StatCard, Table } from "../../components/ui";
import { APPOINTMENTS, ASSESSMENTS, CHILDREN, PARENTS, PROGRESS_HISTORY, WEEKLY_PRACTICE } from "../../data/demoData";
import { useApp } from "../../store/AppContext";

const p1 = PARENTS[0];

export function ParentDashboard() {
  const { currentUser, linkedChildren, childProgress, streakDays, activeChild, attempts, selectChild, weeklyPractice, isFreshAccount } = useApp();
  const sessions = APPOINTMENTS.filter((a) => a.childId === activeChild.id);
  const next = sessions[0];

  const weekly = weeklyPractice;
  const trend = isFreshAccount
    ? [
        { label: "W1 Baseline", accuracy: 0 },
        { label: "W2 Baseline", accuracy: 0 },
        { label: "W3 Baseline", accuracy: 0 },
        { label: "Current Session", accuracy: childProgress },
      ]
    : PROGRESS_HISTORY.map((p, i) => ({ ...p, accuracy: i === PROGRESS_HISTORY.length - 1 ? childProgress : p.accuracy }));

  const parentName = currentUser?.name ? currentUser.name.split(" ")[0] : "Parent";
  const contactNo = currentUser?.phone || currentUser?.parentPhone || "9876543210";

  const totalMin = weeklyPractice.reduce((sum, w) => sum + w.minutes, 0);
  const avgMin = (totalMin / 7).toFixed(0);

  const activitiesList = [
    { t: `Picture practice — ${activeChild.targetSound} words`, done: attempts.length >= 1 },
    { t: "Listen & repeat (10 words)", done: attempts.length >= 2 },
    { t: "Target sound challenge game", done: attempts.length >= 3 },
    { t: `Story practice (${activeChild.targetSound} sound)`, done: attempts.length >= 4 },
    { t: "Sentence builder", done: attempts.length >= 5 },
  ];
  const doneCount = activitiesList.filter((a) => a.done).length;

  return (
    <div>
      <PageHeader
        title={`नमस्ते ${parentName}! 👋`}
        subtitle="Weekly overview of your child's Hindi speech practice — linked automatically via contact number."
        right={
          <>
            <Badge tone="emerald">📱 Phone: {contactNo}</Badge>
            <Badge tone="brand">{linkedChildren.length} Linked Child{linkedChildren.length === 1 ? "" : "ren"}</Badge>
            <Button variant="secondary" onClick={() => window.print()}>
              Download summary
            </Button>
          </>
        }
      />

      {/* Empty State when no child has registered with this parent's phone number */}
      {linkedChildren.length === 0 ? (
        <Card className="my-6 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-brand-50/50 via-white to-slate-50 border-dashed border-2 border-brand-200">
          <span className="text-5xl mb-3">👶</span>
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            No Child Profile Linked Yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md">
            To view practice reports, ask your child to select <strong>"Child"</strong> role when creating an account and enter your contact number as the <strong>Parent Contact Number</strong>.
          </p>
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 ring-inset">
            📱 Your Parent Contact Number: <span className="font-extrabold">{contactNo}</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Once registered with your phone number, the child profile will automatically show up here instantly!
          </p>
        </Card>
      ) : (
        <>
          {/* Linked Children Quick Selector */}
          <div className="mb-5 rounded-2xl bg-gradient-to-r from-brand-50 via-white to-slate-50 p-4 ring-1 ring-brand-200">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Auto-Connected Children (Linked by Contact #{contactNo})
            </p>
            <div className="mt-2.5 flex flex-wrap gap-3">
              {linkedChildren.map((child) => (
                <button
                  key={child.id}
                  onClick={() => selectChild(child.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    activeChild.id === child.id
                      ? "bg-brand-600 text-white shadow-md ring-2 ring-brand-400"
                      : "bg-white text-slate-700 hover:bg-slate-100 ring-1 ring-slate-200"
                  }`}
                >
                  <span className="text-base">{child.avatar}</span>
                  <span>{child.name}</span>
                  <span className="opacity-75">({child.targetSound} sound)</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Child" value={`${activeChild.avatar} ${activeChild.name}`} hint={`Age ${activeChild.age} • Target ${activeChild.targetSound}`} tone="brand" />
            <StatCard label="Current Focus" value={activeChild.targetSound} hint={`Level: ${activeChild.level}`} tone="violet" />
            <StatCard label="Practice Streak" value={`${streakDays} days`} hint="Consistency drives progress" tone="amber" icon={<TrendingUp size={16} />} />
            <StatCard label="Sessions This Week" value={`${attempts.length}/6`} hint="Goal set with therapist" tone="sky" icon={<CalendarClock size={16} />} />
          </div>
        </>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-slate-900">Progress Trend</p>
              <p className="text-xs text-slate-500">Target sound accuracy over time</p>
            </div>
            <Badge tone={childProgress > 0 ? "green" : "slate"}>
              {attempts.length > 0 ? `+${childProgress}% since start` : "0% Baseline"}
            </Badge>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="par" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c9cf5" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#7c9cf5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" stroke="#7c9cf5" strokeWidth={3} fill="url(#par)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-3 text-center">
          <p className="font-display text-lg font-bold text-slate-900">Overall Progress</p>
          <ProgressRing value={childProgress} size={128} sublabel={`${activeChild.targetSound} sound`} />
          <p className="text-xs text-slate-500">
            {attempts.length > 0
              ? `${attempts.length} new practice sample(s) analysed in this active session.`
              : "Ask your child to practice today to add new samples."}
          </p>
          <Badge tone={attempts.length > 0 ? "green" : "amber"}>
            {attempts.length > 0 ? "Active practice session" : "Awaiting first practice"}
          </Badge>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="mb-3 font-display text-lg font-bold text-slate-900">Weekly Practice</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 5, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="minutes" fill="#7c9cf5" radius={[8, 8, 0, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-slate-400">Average {avgMin} min/day · goal 15 min/day</p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Activity Completion</p>
            <Badge tone={doneCount > 0 ? "green" : "amber"}>{doneCount} of 5 done</Badge>
          </div>
          <ul className="space-y-2.5">
            {activitiesList.map((a) => (
              <li key={a.t} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
                <span className="font-hi text-sm font-semibold text-slate-700">{a.t}</span>
                {a.done ? (
                  <Badge tone="green">
                    <CheckCircle2 size={12} /> Done
                  </Badge>
                ) : (
                  <Badge tone="amber">Pending</Badge>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Recent Practice</p>
          {attempts.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
              🎤 No practice attempts logged yet. As your child records practice words, their recordings will appear here automatically!
            </div>
          ) : (
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {attempts.slice(-3).reverse().map((a) => (
                <li key={a.id} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 ring-inset">
                  <p className="font-hi font-semibold text-slate-800">
                    {a.word} · {a.targetSound} → {a.observedSound} ({(a.confidence * 100).toFixed(0)}%)
                  </p>
                  <p className="text-[11px] text-slate-400">{new Date(a.createdAt).toLocaleTimeString()}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="bg-gradient-to-br from-brand-50 to-white">
          <p className="font-display text-lg font-bold text-slate-900">Recommended Home Activity</p>
          <p className="font-hi mt-2 text-xl font-extrabold text-slate-900">चित्र अभ्यास — 10 मिनट</p>
          <p className="mt-1 text-sm text-slate-600">
            Show 10 pictures starting with “{activeChild.targetSound}”. Ask the child to name each picture slowly. Then repeat any
            word twice that feels unclear.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200 ring-inset">
            <HeartHandshake size={16} className="text-brand-600" />
            <p className="text-xs font-semibold text-slate-600">Tip: never correct more than 2 times per word — keep it playful.</p>
          </div>
          <Button className="mt-3 w-full" variant="secondary" onClick={() => (window.location.hash = "/child/materials")}>
            Open material library
          </Button>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Upcoming Therapist Session</p>
          {next ? (
            <>
              <p className="mt-2 font-display text-xl font-extrabold text-slate-900">{next.date}</p>
              <p className="text-sm text-slate-600">
                {next.time} · {next.mode}
              </p>
              <div className="mt-2 flex gap-2">
                <Badge tone="green">{next.status}</Badge>
                <Badge tone="brand">Dr. Neha Kulkarni</Badge>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 ring-1 ring-slate-200 ring-inset">
                Bring: practice notebook, water, and 2 favourite र-word toys.
              </div>
            </>
          ) : (
            <EmptyState icon="🗓️" title="No session scheduled" description="Your therapist will confirm the next appointment shortly." />
          )}
        </Card>
      </div>

      <Disclaimer className="mt-6">
        AarogyaSpeech X supports home practice. It does not diagnose or treat any speech condition and never replaces your
        speech-language pathologist.
      </Disclaimer>
    </div>
  );
}

export function ParentChildren() {
  const { linkedChildren, selectChild, currentUser } = useApp();
  const contactNo = currentUser?.phone || currentUser?.parentPhone || "9876543210";

  return (
    <div>
      <PageHeader
        title="Connected Children"
        subtitle={`Child profiles automatically linked to contact number #${contactNo}`}
        right={<Badge tone="brand">{linkedChildren.length} Linked Child{linkedChildren.length === 1 ? "" : "ren"}</Badge>}
      />

      {linkedChildren.length === 0 ? (
        <Card className="my-6 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-brand-50/50 via-white to-slate-50 border-dashed border-2 border-brand-200">
          <span className="text-5xl mb-3">👶</span>
          <h2 className="font-display text-xl font-extrabold text-slate-900">
            No Child Account Linked Yet
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md">
            Ask your child to choose <strong>"Child"</strong> role when creating an account and enter your contact number as the Parent Contact Number.
          </p>
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-800 ring-1 ring-emerald-200 ring-inset">
            📱 Your Contact Number: <span className="font-extrabold">{contactNo}</span>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {linkedChildren.map((c) => (
            <Card key={c.id} className="flex flex-col justify-between p-4 border-brand-100 hover:border-brand-300 transition-colors">
              <div className="flex items-start gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-3xl ring-1 ring-brand-200 ring-inset">{c.avatar}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-bold text-slate-900">
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Age {c.age} · Target sound: <span className="font-bold text-brand-700">{c.targetSound}</span> · {c.level}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge tone="brand">{c.progress}% progress</Badge>
                    <Badge tone="amber">{c.streakDays} day streak</Badge>
                    <Badge tone="emerald">📱 Linked</Badge>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Contact: {c.parentPhone || contactNo}</span>
                <Link
                  to="/parent/dashboard"
                  onClick={() => selectChild(c.id)}
                  className="text-xs font-bold text-brand-700 hover:underline"
                >
                  View Dashboard →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function ParentProgress() {
  const { activeChild, childProgress, isFreshAccount, attempts } = useApp();

  const trendData = isFreshAccount && attempts.length === 0
    ? [
        { label: "W1 Baseline", accuracy: 0 },
        { label: "W2 Baseline", accuracy: 0 },
        { label: "W3 Baseline", accuracy: 0 },
        { label: "Current Session", accuracy: 0 },
      ]
    : PROGRESS_HISTORY.map((p, i) => ({ ...p, accuracy: i === PROGRESS_HISTORY.length - 1 ? childProgress : p.accuracy }));

  return (
    <div>
      <PageHeader title="Progress Report" subtitle={`${activeChild.name} · target sound ${activeChild.targetSound}`} right={<Badge tone="violet">⚡ Progress Analytics</Badge>} />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Progress Trend</p>
            <Badge tone={childProgress > 0 ? "green" : "slate"}>
              {attempts.length > 0 ? `+${childProgress}% since start` : "0% Baseline"}
            </Badge>
          </div>
          <div className="mt-3 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" stroke="#0d8d8a" strokeWidth={3} fill="#d3f8f3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="mb-3 font-display text-lg font-bold text-slate-900">Assessment History</p>
          <Table head={["Assessment", "Date", "Score", "Status"]}>
            {ASSESSMENTS.filter((a) => a.childId === activeChild.id).map((a) => (
              <tr key={a.id} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2.5 font-semibold text-slate-700">{a.name}</td>
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
        </Card>
      </div>
    </div>
  );
}

export function ParentAppointments() {
  return (
    <div>
      <PageHeader title="Appointments" subtitle="Therapy sessions and review calls." />
      <Card>
        <Table head={["Date", "Time", "Child", "Mode", "Status"]}>
          {APPOINTMENTS.map((a) => (
            <tr key={a.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2.5 font-semibold text-slate-700">{a.date}</td>
              <td className="px-3 py-2.5 text-slate-500">{a.time}</td>
              <td className="px-3 py-2.5 text-slate-500">{CHILDREN.find((c) => c.id === a.childId)?.name}</td>
              <td className="px-3 py-2.5 text-slate-500">{a.mode}</td>
              <td className="px-3 py-2.5">
                <Badge tone={a.status === "Confirmed" ? "green" : "amber"}>{a.status}</Badge>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function ParentActivities() {
  const items = [
    { emoji: "🖼️", title: "चित्र अभ्यास", detail: "10 picture naming cards for र words", done: true },
    { emoji: "👂", title: "सुनो और बोलो", detail: "Model voice + child repeat, 5 rounds", done: true },
    { emoji: "🎲", title: "सही चित्र चुनो", detail: "Game: match target words to pictures", done: false },
    { emoji: "📖", title: "कहानी: रिया और लाल रथ", detail: "Read together and record 2 sentences", done: false },
  ];
  return (
    <div>
      <PageHeader
        title="Home Activities"
        subtitle="Short, play-based tasks designed to be done in 10 minutes."
        right={<Badge tone="brand"><Users size={12} /> 2 of 4 completed</Badge>}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((i) => (
          <Card key={i.title} className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-slate-50 text-2xl ring-1 ring-slate-200 ring-inset">{i.emoji}</span>
              <div>
                <p className="font-hi font-display font-bold text-slate-900">{i.title}</p>
                <p className="text-xs text-slate-500">{i.detail}</p>
              </div>
            </div>
            <Badge tone={i.done ? "green" : "amber"}>{i.done ? "Done" : "To do"}</Badge>
          </Card>
        ))}
      </div>
      <Card className="mt-5 bg-gradient-to-br from-brand-50 to-white">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Mic className="text-brand-700" size={20} />
            <p className="text-sm text-slate-700">
              Tip: record 3 attempts per word and let your child listen back — self-monitoring boosts carry-over.
            </p>
          </div>
          <Button onClick={() => (window.location.hash = "/child/therapy")}>Open practice screen</Button>
        </div>
      </Card>
    </div>
  );
}
