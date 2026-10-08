import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Ear,
  Loader2,
  Mic,
  Play,
  RotateCcw,
  Send,
  Square,
  Star,
} from "lucide-react";
import { Badge, Button, Card, DemoBadge, PageHeader } from "../../components/ui";
import { useApp } from "../../store/AppContext";
import { MATERIALS } from "../../data/demoData";
import { analyzeSpeech } from "../../services/speechAnalysisService";
import { speakHindi, useRecorder } from "../../hooks/useRecorder";
import { cn } from "../../utils/cn";

type Phase = "idle" | "analyzing" | "result" | "error";

export default function TherapySession() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { activeChild, logAttempt, lastAnalysis, recommendation, childProgress, attempts } = useApp();

  const initialWordId = params.get("word") ?? MATERIALS[0].id;
  const [wordId, setWordId] = useState(initialWordId);
  const material = MATERIALS.find((m) => m.id === wordId) ?? MATERIALS[0];

  const recorder = useRecorder();
  const [phase, setPhase] = useState<Phase>("idle");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [listened, setListened] = useState(false);
  const [playedBack, setPlayedBack] = useState(false);
  const [spokenUnsupported, setSpokenUnsupported] = useState(false);
  const [customTranscript, setCustomTranscript] = useState<string>("");

  useEffect(() => {
    if (recorder.spokenTranscript) {
      setCustomTranscript(recorder.spokenTranscript);
    }
  }, [recorder.spokenTranscript]);

  useEffect(() => {
    setWordId(initialWordId);
  }, [initialWordId]);

  useEffect(() => {
    setListened(false);
    setPlayedBack(false);
    setPhase("idle");
    setAnalysisError(null);
    setCustomTranscript("");
    recorder.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordId]);

  const handleListen = () => {
    const ok = speakHindi(material.word);
    setSpokenUnsupported(!ok);
    setListened(true);
  };

  const handleAnalyze = async () => {
    setPhase("analyzing");
    setAnalysisError(null);
    try {
      const result = await analyzeSpeech({
        audioBlob: recorder.audioBlob,
        targetPhoneme: material.targetSound,
        word: material.word,
        position: material.position,
        clientTranscript: customTranscript.trim() || recorder.spokenTranscript,
      });
      logAttempt(result);
      setPhase("result");
    } catch (e) {
      setAnalysisError((e as Error).message ?? "Analysis failed. Please retry.");
      setPhase("error");
    }
  };

  return (
    <div>
      <PageHeader
        hindi
        title="आज का शब्द"
        subtitle={`Practice the target sound ${material.targetSound} in ${material.position.toLowerCase()} position. Speak slowly and clearly!`}
        right={
          <>
            <Badge tone="violet">⚡ AI Speech Analysis</Badge>
            <select
              value={wordId}
              onChange={(e) => setWordId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              {MATERIALS.slice(0, 12).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.word} · {m.targetSound} ({m.position})
                </option>
              ))}
            </select>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        {/* WORD CARD */}
        <Card className="bg-gradient-to-br from-brand-50 via-white to-sky-50">
          <div className="flex flex-col items-center py-4 text-center">
            <span className="animate-floaty grid size-24 place-items-center rounded-3xl bg-white text-6xl shadow-sm ring-1 ring-brand-100 ring-inset">
              {material.emoji}
            </span>
            <p className="font-hi font-display mt-4 text-6xl leading-none font-extrabold text-slate-900 sm:text-7xl">
              {material.word}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {material.meaning} · {material.category}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Badge tone="brand">Target sound: {material.targetSound}</Badge>
              <Badge tone="sky">Position: {material.position}</Badge>
              <Badge tone="amber">Difficulty: {material.difficulty}</Badge>
              <Badge tone="violet">Level: {material.level}</Badge>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button variant="secondary" onClick={handleListen}>
              <Ear size={16} /> Listen
              {listened && <span className="ml-1 text-[10px] text-emerald-600">✓</span>}
            </Button>
            {recorder.status !== "recording" ? (
              <Button
                onClick={recorder.start}
                disabled={!recorder.isSupported || phase === "analyzing"}
                title={!recorder.isSupported ? "Microphone recording unsupported in this browser" : "Start recording"}
              >
                <Mic size={16} /> {recorder.status === "recorded" ? "Re-record" : "Record"}
              </Button>
            ) : (
              <Button variant="danger" onClick={recorder.stop}>
                <Square size={16} /> Stop
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={() => {
                const audio = document.getElementById("playback") as HTMLAudioElement | null;
                audio?.play();
                setPlayedBack(true);
              }}
              disabled={!recorder.audioUrl}
            >
              <Play size={16} /> Play Recording
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                recorder.reset();
                setPhase("idle");
                setAnalysisError(null);
                setPlayedBack(false);
              }}
            >
              <RotateCcw size={16} /> Try Again
            </Button>
          </div>

          {recorder.status === "recording" && (
            <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl bg-rose-50/80 px-4 py-3 ring-1 ring-rose-200 ring-inset">
              <div className="flex items-center gap-1.5">
                <span className="animate-bounce size-1.5 rounded-full bg-rose-600" style={{ animationDelay: "0ms" }} />
                <span className="animate-bounce size-2.5 rounded-full bg-rose-600" style={{ animationDelay: "150ms" }} />
                <span className="animate-bounce size-3.5 rounded-full bg-rose-600" style={{ animationDelay: "300ms" }} />
                <span className="animate-bounce size-2.5 rounded-full bg-rose-600" style={{ animationDelay: "150ms" }} />
                <span className="animate-bounce size-1.5 rounded-full bg-rose-600" style={{ animationDelay: "0ms" }} />
              </div>
              <p className="text-sm font-bold text-rose-700">Listening to microphone… speak “{material.word}” now!</p>
            </div>
          )}

          {recorder.error && (
            <div className="mt-4 flex flex-col gap-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200 ring-inset sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-sm text-amber-800">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {recorder.error}
              </p>
              <Button size="sm" variant="secondary" onClick={recorder.start} disabled={!recorder.isSupported}>
                Retry mic
              </Button>
            </div>
          )}

          {recorder.audioUrl && (
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 ring-1 ring-slate-200 ring-inset space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-600 uppercase">
                  Your recording {(recorder.durationMs / 1000).toFixed(1)}s
                </p>
                {playedBack && <Badge tone="green">Played back — does it sound correct?</Badge>}
              </div>
              <audio id="playback" controls src={recorder.audioUrl} className="w-full" />

              <div className="rounded-xl bg-white p-3 ring-1 ring-purple-200 ring-inset">
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="transcript-input" className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                    <span>🎙️ Spoken Speech Detected:</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">Auto-captured from mic (editable)</span>
                </div>
                <input
                  id="transcript-input"
                  type="text"
                  value={customTranscript}
                  onChange={(e) => setCustomTranscript(e.target.value)}
                  placeholder={`Word spoken (e.g. "${material.word}" or mispronounced sound like "सजा")`}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm font-bold text-purple-900 placeholder-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none"
                />
                
                <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-purple-100 pt-2">
                  <span className="text-[11px] font-semibold text-slate-500">Quick Test Input:</span>
                  <button
                    type="button"
                    onClick={() => setCustomTranscript(material.word)}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors"
                  >
                    ✓ Correct ("{material.word}")
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const alt = material.targetSound === "र" ? "सजा" : (material.targetSound === "स" ? "शूराज" : "तमा");
                      setCustomTranscript(alt);
                    }}
                    className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 transition-colors"
                  >
                    ⚠️ Mispronounced Test
                  </button>
                </div>
              </div>
            </div>
          )}

          {spokenUnsupported && (
            <p className="mt-3 text-xs text-amber-700">
              Model voice not available in this browser (SpeechSynthesis हिन्दी voice missing) — read the word aloud to the child.
            </p>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              size="lg"
              className="flex-1"
              disabled={recorder.status !== "recorded" || phase === "analyzing"}
              onClick={handleAnalyze}
            >
              <Send size={18} /> Submit for Analysis
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate("/child/materials")}>
              More materials
            </Button>
          </div>
          {recorder.status !== "recorded" && (
            <p className="mt-2 text-xs text-slate-400">
              Record at least one sample first — the Submit button enables once audio is captured.
            </p>
          )}
        </Card>

        {/* ANALYSIS PANEL */}
        <div className="space-y-5">
          {phase === "idle" && (
            <Card className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <span className="animate-floaty grid size-16 place-items-center rounded-2xl bg-violet-50 text-3xl ring-1 ring-violet-200 ring-inset">
                🎧
              </span>
              <p className="font-display text-lg font-bold text-slate-900">Analysis panel is waiting</p>
              <p className="max-w-sm text-sm text-slate-500">
                Listen → Record → Play back → Submit. The analysis engine returns expected vs observed phoneme pairs.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {["र → ल", "स → श", "क → क"].map((p) => (
                  <Badge key={p} tone="slate">
                    {p}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {phase === "analyzing" && (
            <Card className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center">
              <Loader2 className="animate-spin text-brand-600" size={38} />
              <p className="font-display text-lg font-bold text-slate-900">Analyzing speech…</p>
              <p className="text-sm text-slate-500">Extracting phoneme sequence and comparing with the target sound.</p>
              <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-slate-200">
                <div className="animate-bar h-full w-3/4 rounded-full bg-brand-500" />
              </div>
              <DemoBadge label="Real-Time AI Inference" />
            </Card>
          )}

          {phase === "error" && (
            <Card className="border-rose-200">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-200 ring-inset">
                  <AlertTriangle size={18} />
                </span>
                <div>
                  <p className="font-display font-bold text-slate-900">Analysis failed</p>
                  <p className="text-sm text-slate-500">{analysisError}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={handleAnalyze}>
                      <RotateCcw size={14} /> Retry analysis
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setPhase("idle")}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {phase === "result" && lastAnalysis && (
            <>
              <Card className="animate-rise border-emerald-200 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-xl font-extrabold text-slate-900">
                      ⚡ Live AI Audio Analysis
                    </p>
                    <p className="text-xs text-slate-500">
                      Target Word: <strong>{lastAnalysis.word}</strong> · Analyzed at {new Date(lastAnalysis.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge tone="emerald">
                    ⚡ Real AI Engine
                  </Badge>
                </div>

                {/* SPOKEN & SOUND ANALYSIS BREAKDOWN */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
                  <div className="rounded-xl bg-purple-50 px-3 py-3 ring-1 ring-purple-100 ring-inset">
                    <p className="text-[10px] font-bold text-purple-700 uppercase">क्या बोला (Spoken)</p>
                    <p className="font-hi font-display text-2xl font-extrabold text-purple-900 truncate">
                      {lastAnalysis.spokenText ?? material.word}
                    </p>
                  </div>

                  <div className="rounded-xl bg-brand-50 px-3 py-3 ring-1 ring-brand-100 ring-inset">
                    <p className="text-[10px] font-bold text-brand-700 uppercase">Target Sound</p>
                    <p className="font-hi font-display text-3xl font-extrabold text-slate-900">
                      {lastAnalysis.targetPhoneme}
                    </p>
                  </div>

                  <div className={cn(
                    "rounded-xl px-3 py-3 ring-1 ring-inset",
                    lastAnalysis.errorType === "match" ? "bg-emerald-50 ring-emerald-100 text-emerald-900" : "bg-rose-50 ring-rose-100 text-rose-900"
                  )}>
                    <p className="text-[10px] font-bold uppercase opacity-80">Observed Sound</p>
                    <p className="font-hi font-display text-3xl font-extrabold">
                      {lastAnalysis.observedPhoneme}
                    </p>
                  </div>

                  <div className={cn(
                    "rounded-xl px-3 py-3 ring-1 ring-inset",
                    lastAnalysis.confidence >= 0.70
                      ? "bg-sky-50 ring-sky-100 text-sky-900"
                      : "bg-rose-50 ring-rose-100 text-rose-900"
                  )}>
                    <p className="text-[10px] font-bold uppercase opacity-80">Real Confidence</p>
                    <p className="font-display text-3xl font-extrabold">
                      {(lastAnalysis.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {/* PRONUNCIATION STATUS & MISSPELLED BANNER */}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className={cn(
                    "rounded-xl px-4 py-3 ring-1 ring-inset",
                    lastAnalysis.errorType === "match"
                      ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
                      : "bg-amber-50 text-amber-900 ring-amber-200"
                  )}>
                    <p className="text-[10px] font-bold uppercase opacity-75">Pronunciation Result</p>
                    <p className="font-semibold text-base">
                      {lastAnalysis.errorType === "match"
                        ? "Pronounced Correctly ✓"
                        : `Mispronounced (Articulated '${lastAnalysis.observedPhoneme}' instead of '${lastAnalysis.targetPhoneme}')`}
                    </p>
                  </div>

                  <div
                    className={cn(
                      "rounded-xl px-4 py-3 ring-1 ring-inset",
                      lastAnalysis.needsTherapistReview
                        ? "bg-amber-50 ring-amber-200"
                        : "bg-emerald-50 ring-emerald-200",
                    )}
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Therapist Review Status</p>
                    <p className="font-semibold text-slate-900">
                      {lastAnalysis.needsTherapistReview ? "Needs therapist review" : "Within expected range ✓"}
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-sm text-slate-700 font-medium bg-slate-50 p-3 rounded-xl ring-1 ring-slate-200 ring-inset">
                  💡 {lastAnalysis.notes}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      recorder.reset();
                      setPhase("idle");
                    }}
                  >
                    <RotateCcw size={16} /> Practice Again
                  </Button>
                  <Button onClick={() => navigate("/child/progress")}>
                    Continue <ArrowRight size={16} />
                  </Button>
                </div>
              </Card>

              {recommendation && (
                <Card className="animate-rise">
                  <div className="flex items-center justify-between">
                    <p className="font-display text-lg font-bold text-slate-900">Recommended Next Practice</p>
                    <Badge tone="brand">Rule-based engine</Badge>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">
                    Target sound: <strong className="font-hi">{recommendation.targetSound}</strong> · Position:{" "}
                    <strong>{recommendation.position}</strong>
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {recommendation.ladder.map((l, i) => (
                      <span key={l} className="flex items-center gap-1.5">
                        <Badge tone={l === recommendation.ladder[2] ? "brand" : "slate"}>{l}</Badge>
                        {i < recommendation.ladder.length - 1 && <span className="text-slate-300">↓</span>}
                      </span>
                    ))}
                  </div>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {recommendation.activities.map((a) => (
                      <li key={a.title} className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 ring-inset">
                        <p className="font-hi text-sm font-bold text-slate-900">
                          {a.emoji} {a.title}
                        </p>
                        <p className="text-xs text-slate-500">{a.detail}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 rounded-xl bg-brand-50 p-4 ring-1 ring-brand-100 ring-inset">
                    <p className="text-xs font-bold text-brand-700 uppercase">Why this is recommended</p>
                    <p className="mt-1 text-sm text-slate-700">{recommendation.rationale}</p>
                    <p className="mt-2 text-[11px] text-slate-500">
                      Simple rule-based recommendation — not generated by an LLM or a diagnostic model.
                    </p>
                  </div>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-emerald-50 to-white">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-white text-xl ring-1 ring-emerald-200 ring-inset">
                    <Star className="text-emerald-600" size={20} />
                  </span>
                  <div>
                    <p className="font-display font-bold text-slate-900">Progress Updated</p>
                    <p className="text-sm text-slate-600">
                      {activeChild.name}'s overall progress is now <strong>{childProgress}%</strong> · {attempts.length}{" "}
                      attempt(s) logged this session.
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-slate-500">
                  Progress delta is illustrative MVP scoring (base progress + 2% per logged attempt, capped at 98%).
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
