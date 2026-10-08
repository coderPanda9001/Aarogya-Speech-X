import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MessageSquare,
  Mic,
  PencilLine,
  Target,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge, Button, Card, DemoBadge, Disclaimer, EmptyState, PageHeader, ProgressRing, StatCard, Table } from "../../components/ui";
import {
  APPOINTMENTS,
  ASSESSMENTS,
  CHILDREN,
  CONFUSION_LABELS,
  CONFUSION_MATRIX,
  CURRENT_THERAPIST_ID,
  MOST_PRACTICED_SOUNDS,
  PHONEME_OBSERVATIONS,
  PROGRESS_HISTORY,
  THERAPISTS,
} from "../../data/demoData";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";
import type { PhonemeErrorType } from "../../types";

const therapist = THERAPISTS.find((t) => t.id === CURRENT_THERAPIST_ID)!;

function ConfusionMatrix() {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-[320px]">
        <div className="mb-1 grid grid-cols-4 gap-1 text-center text-xs font-bold text-slate-500">
          <span />
          <span className="col-span-3 tracking-wide uppercase">Observed</span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <span className="grid place-items-center text-xs font-bold text-slate-500">
            <span className="rotate-180 [writing-mode:vertical-rl]">Expected</span>
          </span>
          {CONFUSION_LABELS.map((l) => (
            <span key={l} className="font-hi grid place-items-center rounded-lg bg-slate-100 py-1.5 text-lg font-bold text-slate-700">
              {l}
            </span>
          ))}
          {CONFUSION_MATRIX.map((row, ri) => [
            <span key={`h${ri}`} className="font-hi grid place-items-center rounded-lg bg-slate-100 py-2 text-lg font-bold text-slate-700">
              {CONFUSION_LABELS[ri]}
            </span>,
            ...row.map((v, ci) => (
              <span
                key={`${ri}-${ci}`}
                className={cn(
                  "grid place-items-center rounded-lg py-2 text-lg font-bold ring-1 ring-inset",
                  ri === ci
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : v >= 3
                      ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-slate-50 text-slate-500 ring-slate-200",
                )}
              >
                {v}
              </span>
            )),
          ])}
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Phoneme confusion matrix — counts of expected vs observed phoneme labels from AI analysis.
        </p>
      </div>
    </div>
  );
}

function ErrorTable({ rows }: { rows: { expected: string; observed: string; type: PhonemeErrorType; confidence: number; word: string }[] }) {
  return (
    <Table head={["Expected", "Observed", "Word", "Type", "Confidence"]}>
      {rows.map((r, i) => (
        <tr key={`${r.word}-${i}`} className="border-b border-slate-100 last:border-0">
          <td className="font-hi px-3 py-2.5 text-lg font-bold text-slate-900">{r.expected}</td>
          <td className="font-hi px-3 py-2.5 text-lg font-bold text-slate-900">{r.observed}</td>
          <td className="font-hi px-3 py-2.5 text-slate-600">{r.word}</td>
          <td className="px-3 py-2.5">
            <Badge tone={r.type === "match" ? "green" : "amber"}>{r.type === "match" ? "Match" : `Possible ${r.type}`}</Badge>
          </td>
          <td className="px-3 py-2.5 font-semibold text-slate-700">{(r.confidence * 100).toFixed(0)}%</td>
        </tr>
      ))}
    </Table>
  );
}

export function TherapistDashboard() {
  const { observations, reviews } = useApp();
  const navigate = useNavigate();
  const myChildren = CHILDREN.filter((c) => c.therapistId === therapist.id);
  const todays = APPOINTMENTS.filter((a) => a.therapistId === therapist.id);
  const needsReview = observations.filter((o) => o.needsTherapistReview && !reviews[o.id]?.action);

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${therapist.name}`}
        subtitle={`${therapist.qualification} · ${therapist.city}`}
        right={
          <>
            <DemoBadge label="Clinical Phoneme Analysis" />
            <Button onClick={() => navigate("/therapist/phonemes")}>
              <Activity size={16} /> Phoneme Analysis
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Connected Children" value={myChildren.length} hint="Active therapy plans" tone="brand" icon={<UserRound size={16} />} />
        <StatCard label="Today's Sessions" value={todays.length} hint="Video + in-clinic" tone="sky" icon={<CalendarClock size={16} />} />
        <StatCard label="Needs Review" value={needsReview.length} hint="AI outputs awaiting sign-off" tone="amber" icon={<Target size={16} />} />
        <StatCard label="Pending Requests" value={todays.filter((a) => a.status === "Pending").length} hint="Parent-initiated" tone="violet" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-slate-900">My Caseload</p>
              <p className="text-xs text-slate-500">Click a child to open the clinical detail view</p>
            </div>
            <Link to="/therapist/children" className="text-xs font-semibold text-brand-700 hover:underline">
              Open case list
            </Link>
          </div>
          <Table head={["Child", "Target", "Level", "Progress", "Review"]}>
            {CHILDREN.map((c) => (
              <tr
                key={c.id}
                className="cursor-pointer border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                onClick={() => navigate(`/therapist/children/${c.id}`)}
              >
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.avatar}</span>
                    <div>
                      <p className="font-hi font-bold text-slate-900">{c.hindiName}</p>
                      <p className="text-[11px] text-slate-500">{c.name} · age {c.age}</p>
                    </div>
                  </div>
                </td>
                <td className="font-hi px-3 py-3 text-lg font-bold text-slate-800">{c.targetSound}</td>
                <td className="px-3 py-3 text-slate-600">{c.level}</td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div className="animate-bar h-full rounded-full bg-brand-500" style={{ width: `${c.progress}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{c.progress}%</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {c.needsReview ? (
                    <Badge tone="amber">Review</Badge>
                  ) : (
                    <Badge tone="slate">—</Badge>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <div className="space-y-5">
          <Card>
            <p className="font-display text-lg font-bold text-slate-900">Today's Schedule</p>
            <ul className="mt-3 space-y-2">
              {todays.map((a) => (
                <li key={a.id} className="rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">{a.time}</p>
                    <Badge tone={a.status === "Confirmed" ? "green" : "amber"}>{a.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    {CHILDREN.find((c) => c.id === a.childId)?.hindiName} · {a.mode} · {a.date}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="bg-gradient-to-br from-violet-50 to-white">
            <p className="font-display font-bold text-slate-900">Review queue</p>
            <p className="mt-1 text-xs text-slate-500">
              {needsReview.length} simulated analysis result(s) awaiting your clinical judgement.
            </p>
            <ul className="mt-3 space-y-2">
              {needsReview.slice(0, 3).map((o) => (
                <li key={o.id} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200 ring-inset">
                  <span className="font-hi text-sm font-bold text-slate-800">
                    {CHILDREN.find((c) => c.id === o.childId)?.hindiName} · {o.word}
                  </span>
                  <Badge tone="violet">
                    {o.expected} → {o.observed}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Cohort Accuracy Trend</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PROGRESS_HISTORY} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" stroke="#7c3aed" strokeWidth={3} fill="#ede9fe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Phoneme Error Mix</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOST_PRACTICED_SOUNDS.map((s) => ({ sound: s.sound, attempts: s.count / 20 }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="sound" tick={{ fontSize: 14, fill: "#334155" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="attempts" stroke="#0d8d8a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Disclaimer className="mt-6">
        AI-assisted analysis only. Results shown are simulated for this MVP and must be interpreted with clinical judgement.
      </Disclaimer>
    </div>
  );
}

export function TherapistChildren() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Children" subtitle="Caseload overview with target sound, level and review status." right={<Badge tone="brand">{CHILDREN.length} children</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHILDREN.map((c) => (
          <Card key={c.id} className="flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-slate-50 text-2xl ring-1 ring-slate-200 ring-inset">{c.avatar}</span>
                <div>
                  <p className="font-hi font-display font-bold text-slate-900">{c.hindiName}</p>
                  <p className="text-[11px] text-slate-500">
                    {c.name} · age {c.age} · {c.level}
                  </p>
                </div>
              </div>
              <ProgressRing value={c.progress} size={62} stroke={7} />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Badge tone="brand">Target {c.targetSound}</Badge>
              <Badge tone="amber">{c.streakDays}d streak</Badge>
              {c.needsReview && <Badge tone="red">Needs review</Badge>}
            </div>
            <Button className="mt-4" variant="secondary" onClick={() => navigate(`/therapist/children/${c.id}`)}>
              Open case
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function ChildDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { observations, reviews, setReview, activeChildId, selectChild, attempts } = useApp();
  const [note, setNote] = useState("");
  const child = CHILDREN.find((c) => c.id === id) ?? CHILDREN[0];

  const childObs = observations.filter((o) => o.childId === child.id);
  const primary = childObs[0];
  const review = primary ? reviews[primary.id] : undefined;

  const chartData = PROGRESS_HISTORY.map((p, i) => ({ ...p, accuracy: i === PROGRESS_HISTORY.length - 1 ? child.progress : p.accuracy }));

  return (
    <div>
      <button onClick={() => navigate("/therapist/dashboard")} className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-700">
        <ArrowLeft size={14} /> Back to dashboard
      </button>

      <PageHeader
        title={`${child.hindiName} (${child.name})`}
        subtitle={`Age ${child.age} · Target sound ${child.targetSound} · Level ${child.level} · ${childObs.length} observations`}
        right={
          <>
            <Badge tone="violet">⚡ AI results saved</Badge>
            <Button
              variant="secondary"
              onClick={() => {
                selectChild(child.id);
                navigate("/therapist/plans");
              }}
            >
              <PencilLine size={16} /> Edit therapy plan
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Progress" value={`${child.progress}%`} hint="Target sound accuracy" tone="brand" />
        <StatCard label="Practice Streak" value={`${child.streakDays} days`} hint={`${child.sessionsThisWeek}/${child.weeklyGoal} sessions/week`} tone="amber" />
        <StatCard label="Needs Review" value={childObs.filter((o) => o.needsTherapistReview && !reviews[o.id]?.action).length} hint="Unreviewed AI outputs" tone="violet" />
        <StatCard label="Session Attempts" value={attempts.filter((a) => a.childId === child.id).length} hint="Logged in this active session" tone="sky" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Overview</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 ring-inset">
              <span>Primary concern</span>
              <span className="font-semibold text-slate-800">Misarticulation of {child.targetSound} (initial position)</span>
            </li>
            <li className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 ring-inset">
              <span>Language</span>
              <span className="font-semibold text-slate-800">Hindi (home) · English (school)</span>
            </li>
            <li className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 ring-inset">
              <span>Caregiver</span>
              <span className="font-semibold text-slate-800">Sunita Sharma</span>
            </li>
            <li className="flex justify-between rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 ring-inset">
              <span>Home practice</span>
              <span className="font-semibold text-slate-800">16 min/day average</span>
            </li>
          </ul>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Progress</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Area type="monotone" dataKey="accuracy" stroke="#0d8d8a" strokeWidth={3} fill="#d3f8f3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-violet-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-display text-lg font-bold text-slate-900">Speech Analysis — Latest sample</p>
              <p className="text-xs text-slate-500">Recorded in practice session · simulated output</p>
            </div>
            <DemoBadge />
          </div>

          {primary ? (
            <>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-brand-50 px-3 py-3 ring-1 ring-brand-100 ring-inset">
                  <p className="text-[10px] font-bold text-brand-700 uppercase">Target</p>
                  <p className="font-hi font-display text-2xl font-extrabold text-slate-900">{primary.expected}</p>
                </div>
                <div className="rounded-xl bg-rose-50 px-3 py-3 ring-1 ring-rose-100 ring-inset">
                  <p className="text-[10px] font-bold text-rose-700 uppercase">Observed</p>
                  <p className="font-hi font-display text-2xl font-extrabold text-slate-900">{primary.observed}</p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200 ring-inset">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Error type</p>
                  <p className="text-sm font-semibold text-slate-900 capitalize">
                    {primary.errorType === "match" ? "Match" : `Possible ${primary.errorType}`}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 px-3 py-3 ring-1 ring-slate-200 ring-inset">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Confidence</p>
                  <p className="font-display text-2xl font-extrabold text-slate-900">{(primary.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-[11px] font-bold text-violet-700 uppercase">AI Result (original, preserved)</p>
                  <p className="font-hi mt-2 text-sm text-slate-700">
                    {primary.expected} → {primary.observed} · {primary.errorType} · {(primary.confidence * 100).toFixed(0)}% ·
                    {" "}word {primary.word}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{primary.date} · Wav2Vec2 AI Speech Model</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-emerald-50/50 p-4">
                  <p className="text-[11px] font-bold text-emerald-700 uppercase">Therapist Review</p>
                  {review?.action ? (
                    <>
                      <p className="mt-2 text-sm font-semibold text-slate-800 capitalize">{review.action}</p>
                      {review.note && <p className="text-xs text-slate-600">“{review.note}”</p>}
                      <p className="mt-1 text-[11px] text-slate-400">
                        Reviewed {review.reviewedAt ? new Date(review.reviewedAt).toLocaleTimeString() : ""}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">Not reviewed yet.</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold text-slate-500 uppercase">Clinical note (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. consistent across 3 tokens; use tactile cue for retroflex र"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="success" onClick={() => setReview(primary.id, "accept", note)}>
                  <CheckCircle2 size={16} /> Accept
                </Button>
                <Button variant="secondary" onClick={() => setReview(primary.id, "modify", note)}>
                  <PencilLine size={16} /> Modify
                </Button>
                <Button variant="danger" onClick={() => setReview(primary.id, "reject", note)}>
                  <XCircle size={16} /> Reject
                </Button>
                {review?.action && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setReview(primary.id, "reject", "");
                      setNote("");
                    }}
                  >
                    Clear review
                  </Button>
                )}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">
                Review actions are stored for this session. The original AI result is never modified or deleted.
              </p>
              <Disclaimer className="mt-3">
                This AI speech analysis is provided for clinical decision support.
              </Disclaimer>
            </>
          ) : (
            <EmptyState
              icon="🎙️"
              title="No analysis sample yet"
              description={`No recorded sample has been submitted for ${child.name}. Ask the child or parent to record a ${child.targetSound} word.`}
            />
          )}
        </Card>

        <div className="space-y-5">
          <Card>
            <p className="font-display text-lg font-bold text-slate-900">Phoneme Errors</p>
            <div className="mt-3">
              <ErrorTable
                rows={childObs.map((o) => ({ expected: o.expected, observed: o.observed, type: o.errorType, confidence: o.confidence, word: o.word }))}
              />
            </div>
          </Card>

          <Card>
            <p className="font-display text-lg font-bold text-slate-900">Confusion Matrix</p>
            <p className="mb-3 text-xs text-slate-500">Expected (rows) vs observed (columns) phoneme labels</p>
            <ConfusionMatrix />
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-bold text-slate-900">Therapy Plan</p>
            <Badge tone="brand">{activeChildId === child.id ? "Active case" : "Tap Open case to activate"}</Badge>
          </div>
          <ol className="mt-3 space-y-2">
            {[
              { lvl: "Sound", detail: "Isolation + tactile cue for र", state: "Mastered" },
              { lvl: "Syllables", detail: "रा, री, रू in carrier phrases", state: "Mastered" },
              { lvl: "Words", detail: "Initial र words (रथ, राजा, रोटी)", state: "Current" },
              { lvl: "Sentences", detail: "3–5 word sentences with र", state: "Next" },
              { lvl: "Story", detail: "रिया और लाल रथ carry-over", state: "Later" },
            ].map((s) => (
              <li key={s.lvl} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
                <div>
                  <p className="font-semibold text-slate-800">{s.lvl}</p>
                  <p className="font-hi text-xs text-slate-500">{s.detail}</p>
                </div>
                <Badge tone={s.state === "Current" ? "brand" : s.state === "Mastered" ? "green" : "slate"}>{s.state}</Badge>
              </li>
            ))}
          </ol>
        </Card>

        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Recommendations</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li className="rounded-xl bg-brand-50 px-3.5 py-2.5 ring-1 ring-brand-100 ring-inset">
              1. Continue initial-position {child.targetSound} word drills — 3 tokens × 10 trials, 3 days/week.
            </li>
            <li className="rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
              2. Add minimal-pair discrimination (र / ल) for 5 minutes before production trials.
            </li>
            <li className="rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
              3. Increase carry-over: one story recording per week, reviewed by therapist.
            </li>
            <li className="rounded-xl bg-slate-50 px-3.5 py-2.5 ring-1 ring-slate-200 ring-inset">
              4. Parent coaching: avoid over-correcting; use modelling + pause.
            </li>
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            Rule-based suggestions — not clinical advice. Confirm with the treating professional.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => navigate("/therapist/messages")}>
              <MessageSquare size={16} /> Message parent
            </Button>
            <Button
              onClick={() => {
                selectChild(child.id);
                navigate("/child/therapy");
              }}
            >
              <Mic size={16} /> Record sample
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">All Phoneme Observations</p>
          <p className="mb-3 text-xs text-slate-500">Includes baseline samples plus this session's recorded attempts.</p>
          <ErrorTable
            rows={PHONEME_OBSERVATIONS.map((o) => ({ expected: o.expected, observed: o.observed, type: o.errorType, confidence: o.confidence, word: o.word }))}
          />
        </Card>
      </div>
    </div>
  );
}

export function PhonemeAnalysis() {
  const { observations } = useApp();
  return (
    <div>
      <PageHeader
        title="Phoneme Analysis"
        subtitle="Aggregate view of expected vs observed phonemes across the caseload."
        right={<DemoBadge />}
      />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Observation Table</p>
          <div className="mt-3">
            <ErrorTable
              rows={observations.map((o) => ({ expected: o.expected, observed: o.observed, type: o.errorType, confidence: o.confidence, word: o.word }))}
            />
          </div>
        </Card>
        <Card>
          <p className="font-display text-lg font-bold text-slate-900">Confusion Matrix</p>
          <p className="mb-3 text-xs text-slate-500">Words where र and ल are confused dominate the pattern.</p>
          <ConfusionMatrix />
        </Card>
      </div>
    </div>
  );
}

export function TherapistAssessments() {
  return (
    <div>
      <PageHeader title="Assessments" subtitle="Standardised and custom Hindi speech assessments." />
      <Card>
        <Table head={["Assessment", "Child", "Date", "Score", "Status"]}>
          {ASSESSMENTS.map((a) => (
            <tr key={a.id} className="border-b border-slate-100 last:border-0">
              <td className="px-3 py-2.5 font-semibold text-slate-700">{a.name}</td>
              <td className="px-3 py-2.5 text-slate-500">{CHILDREN.find((c) => c.id === a.childId)?.hindiName}</td>
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
  );
}

export function TherapyPlans() {
  const { activeChild } = useApp();
  return (
    <div>
      <PageHeader title="Therapy Plans" subtitle="Level-wise plan templates applied to each child." right={<Badge tone="brand">{activeChild.name} active</Badge>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHILDREN.map((c) => (
          <Card key={c.id}>
            <div className="flex items-center justify-between">
              <p className="font-hi font-display font-bold text-slate-900">
                {c.avatar} {c.hindiName}
              </p>
              <Badge tone="sky">{c.level}</Badge>
            </div>
            <div className="mt-3 space-y-1.5">
              {["Sound", "Syllables", "Words", "Sentences", "Story"].map((l, i) => (
                <div key={l} className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2.5 rounded-full",
                      i <= ["Sound", "Syllables", "Words", "Sentences", "Story"].indexOf(c.level) ? "bg-brand-500" : "bg-slate-200",
                    )}
                  />
                  <span className="text-xs font-semibold text-slate-600">{l}</span>
                </div>
              ))}
            </div>
            <Link to={`/therapist/children/${c.id}`} className="mt-4 inline-block text-xs font-bold text-brand-700 hover:underline">
              Open plan →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function TherapistAppointments() {
  return (
    <div>
      <PageHeader title="Appointments" subtitle="Scheduled therapy and review sessions." right={<Badge tone="green">3 today</Badge>} />
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

export function TherapistMessages() {
  const [messages, setMessages] = useState([
    { id: 1, from: "Sunita Sharma (Aarav's mother)", text: "आरव ने आज रोटी शब्द 10 बार बोला 😊" },
    { id: 2, from: "You", text: "Great! Please upload one recording so I can review the initial र." },
  ]);
  const [draft, setDraft] = useState("");

  return (
    <div>
      <PageHeader title="Messages" subtitle="Secure messaging with parents." />
      <Card className="mx-auto max-w-2xl">
        <ul className="max-h-80 space-y-2 overflow-y-auto">
          {messages.map((m) => (
            <li
              key={m.id}
              className={cn(
                "font-hi max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                m.from === "You" ? "ml-auto bg-brand-600 text-white" : "bg-slate-100 text-slate-700",
              )}
            >
              <p className="text-[10px] font-bold uppercase opacity-70">{m.from}</p>
              {m.text}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type a message…"
            className="font-hi flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400"
          />
          <Button
            onClick={() => {
              if (!draft.trim()) return;
              setMessages((p) => [...p, { id: Date.now(), from: "You", text: draft.trim() }]);
              setDraft("");
            }}
          >
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
