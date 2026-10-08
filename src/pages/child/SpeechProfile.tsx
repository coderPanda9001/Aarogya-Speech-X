import { useNavigate } from "react-router-dom";
import { ArrowRight, Target } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge, Button, Card, Disclaimer, PageHeader, ProgressRing } from "../../components/ui";
import { useApp } from "../../store/AppContext";
import { SPEECH_PROFILE_RADAR } from "../../data/demoData";

export default function SpeechProfile() {
  const { activeChild, childProgress, lastAnalysis, recommendation, attempts } = useApp();
  const navigate = useNavigate();

  const radar = SPEECH_PROFILE_RADAR.map((r) =>
    r.skill === "Sound Production" && attempts.length > 0 ? { ...r, score: childProgress } : r,
  );

  return (
    <div>
      <PageHeader
        hindi
        title="My Speech Progress Profile"
        subtitle="A plain-language snapshot of practice skills and the next step — this is a practice profile, not a medical record."
        right={<Badge tone="violet">⚡ Speech Progress Profile</Badge>}
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-lg font-bold text-slate-900">Practice Skill Radar</p>
              <p className="text-xs text-slate-500">Skill areas blend to show practice breadth, not diagnosis</p>
            </div>
            <Badge tone="brand">6 skill areas</Badge>
          </div>
          <div className="mt-3 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="72%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "#475569" }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <Radar dataKey="score" stroke="#0d8d8a" fill="#16afa9" fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {radar.map((r) => (
              <li key={r.skill} className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200 ring-inset">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{r.skill}</span>
                  <span>{r.score}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="animate-bar h-full rounded-full bg-brand-500" style={{ width: `${r.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="text-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Current Target</p>
              <p className="font-hi font-display text-4xl font-extrabold text-brand-600">{activeChild.targetSound}</p>
              <p className="mt-1 text-[11px] text-slate-500">{activeChild.level} level</p>
            </Card>
            <Card className="flex flex-col items-center">
              <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Mastery</p>
              <ProgressRing value={childProgress} size={92} stroke={9} sublabel="mastery" />
            </Card>
            <Card>
              <p className="text-[10px] font-bold tracking-wide text-slate-500 uppercase">Next Practice</p>
              <p className="font-hi mt-1 text-sm font-bold text-slate-900">
                Initial-position {activeChild.targetSound} words
              </p>
              <p className="mt-1 text-[11px] text-slate-500">Then short sentences with the same sound.</p>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-brand-50 to-white">
            <p className="font-display text-lg font-bold text-slate-900">Latest AI Speech Analysis</p>
            {lastAnalysis ? (
              <>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge tone="brand">
                    <Target size={12} /> Target {lastAnalysis.targetPhoneme}
                  </Badge>
                  <Badge tone="red">Observed {lastAnalysis.observedPhoneme}</Badge>
                  <Badge tone="amber">{lastAnalysis.errorType}</Badge>
                  <Badge tone="slate">{(lastAnalysis.confidence * 100).toFixed(0)}% confidence</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Word: <span className="font-hi font-bold">{lastAnalysis.word}</span> ·{" "}
                  {lastAnalysis.needsTherapistReview ? "Needs therapist review" : "Within expected range"}
                </p>
                {recommendation && (
                  <p className="mt-2 rounded-xl bg-white p-3 text-sm text-slate-600 ring-1 ring-slate-200 ring-inset">
                    {recommendation.headline}
                  </p>
                )}
              </>
            ) : (
              <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white/70 p-6 text-center">
                <p className="text-3xl">🎙️</p>
                <p className="font-display mt-2 font-bold text-slate-900">No sample analysed yet</p>
                <p className="mt-1 text-xs text-slate-500">
                  Record a Hindi word in Practice to generate AI speech analysis and refresh this profile.
                </p>
                <Button size="sm" className="mt-3" onClick={() => navigate("/child/therapy")}>
                  Record now <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </Card>

          <Card>
            <p className="font-display text-lg font-bold text-slate-900">What moves this profile up</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>• 10 minutes of daily practice (streak {activeChild.streakDays + (attempts.length ? 1 : 0)} days 🔥)</li>
              <li>• Record each target word 3 times, then play it back</li>
              <li>• Finish one story per week at the current level</li>
              <li>• Therapist confirms AI observations before level change</li>
            </ul>
            <Disclaimer className="mt-3">
              This Speech Progress Profile is generated from practice activity and simulated analysis. It is not a medical
              clone, diagnosis or clinical record, and it never replaces a qualified therapist's judgement.
            </Disclaimer>
          </Card>
        </div>
      </div>
    </div>
  );
}
