import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, BookOpen, Ear, Mic, Play, RotateCcw, Square } from "lucide-react";
import { Badge, Button, Card, Disclaimer, PageHeader } from "../../components/ui";
import { STORIES } from "../../data/demoData";
import { speakHindi, useRecorder } from "../../hooks/useRecorder";
import { cn } from "../../utils/cn";

function highlight(sentence: string, targets: string[]) {
  let parts: (string | { t: string })[] = [sentence];
  targets.forEach((t) => {
    parts = parts.flatMap((p) => {
      if (typeof p !== "string") return [p];
      return p.split(t).flatMap((seg, i, arr) => (i < arr.length - 1 ? [seg, { t }] : [seg]));
    });
  });
  return parts.map((p, i) =>
    typeof p === "string" ? (
      <span key={i}>{p}</span>
    ) : (
      <mark key={i} className="rounded-md bg-brand-100 px-1 font-bold text-brand-800">
        {p.t}
      </mark>
    ),
  );
}

export default function StoryPage() {
  const navigate = useNavigate();
  const [storyId, setStoryId] = useState(STORIES[0].id);
  const story = STORIES.find((s) => s.id === storyId) ?? STORIES[0];
  const [active, setActive] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  const [spotlight, setSpotlight] = useState(true);
  const recorder = useRecorder();

  const readAloud = () => {
    setReading(true);
    let delay = 0;
    story.sentences.forEach((s) => {
      window.setTimeout(() => speakHindi(s.hi), delay);
      delay += 2400;
    });
  };

  return (
    <div>
      <PageHeader
        hindi
        title="कहानी अभ्यास"
        subtitle="Story-based carryover practice. Read, listen, record — keep the target sound stable inside connected speech."
        right={
          <select
            value={storyId}
            onChange={(e) => setStoryId(e.target.value)}
            className="font-hi rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
          >
            {STORIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-50 to-brand-50 text-3xl ring-1 ring-amber-100 ring-inset">
                {story.emoji}
              </span>
              <div>
                <h2 className="font-hi font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">{story.title}</h2>
                <div className="mt-1 flex gap-1.5">
                  <Badge tone="brand">Target sound: {story.targetSound}</Badge>
                  <Badge tone="violet">{story.level}</Badge>
                </div>
              </div>
            </div>
            <Badge tone="violet">📖 Curated Hindi Story</Badge>
          </div>

          <div className="mt-5 space-y-2.5">
            {story.sentences.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setActive(i);
                  speakHindi(s.hi);
                }}
                className={cn(
                  "font-hi block w-full rounded-2xl px-4 py-3 text-left text-lg leading-relaxed transition-all",
                  active === i
                    ? "bg-brand-50 ring-2 ring-brand-300"
                    : "bg-slate-50 ring-1 ring-slate-200 ring-inset hover:bg-white hover:ring-brand-200",
                )}
              >
                <span className="mr-2 text-xs font-bold text-slate-400">{i + 1}.</span>
                {spotlight ? highlight(s.hi, s.targetWords) : s.hi}
                {reading && (
                  <span className="mt-1 block text-xs font-semibold text-slate-400 italic">{s.transliteration}</span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={readAloud}>
              <Ear size={16} /> Listen
            </Button>
            <Button variant="secondary" onClick={() => setReading((r) => !r)}>
              <BookOpen size={16} /> {reading ? "Hide" : "Read"} (transliteration)
            </Button>
            <Button variant="secondary" onClick={() => setSpotlight((s) => !s)}>
              <Play size={16} /> {spotlight ? "Hide" : "Show"} target words
            </Button>
          </div>

          <Disclaimer className="mt-4">
            Click any sentence to hear it. Target words containing “{story.targetSound}” are highlighted.
          </Disclaimer>
        </Card>

        <div className="space-y-5">
          <Card>
            <p className="font-display text-lg font-bold text-slate-900">Record the story</p>
            <p className="mt-1 text-sm text-slate-500">
              Read sentence by sentence. Recording a 20–30 second sample gives the therapist more to review.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {recorder.status !== "recording" ? (
                <Button onClick={recorder.start} disabled={recorder.status === "recorded" || !recorder.isSupported}>
                  <Mic size={16} /> Record
                </Button>
              ) : (
                <Button variant="danger" onClick={recorder.stop}>
                  <Square size={16} /> Stop
                </Button>
              )}
              <Button
                variant="secondary"
                disabled={!recorder.audioUrl}
                onClick={() => (document.getElementById("story-audio") as HTMLAudioElement | null)?.play()}
              >
                <Play size={16} /> Play
              </Button>
              <Button variant="ghost" onClick={recorder.reset}>
                <RotateCcw size={16} /> Try Again
              </Button>
              <Button variant="secondary" onClick={() => navigate(`/child/therapy?word=m1`)}>
                Practice {story.targetSound}
              </Button>
            </div>

            {recorder.status === "recording" && (
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 ring-1 ring-rose-200 ring-inset">
                <span className="size-2.5 animate-pulse rounded-full bg-rose-600" /> Recording… read slowly
              </p>
            )}

            {recorder.error && (
              <p className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200 ring-inset">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {recorder.error}
              </p>
            )}

            {recorder.audioUrl && (
              <div className="mt-3 rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200 ring-inset">
                <p className="mb-2 text-xs font-bold text-slate-600 uppercase">
                  Story recording · {(recorder.durationMs / 1000).toFixed(1)}s
                </p>
                <audio id="story-audio" controls src={recorder.audioUrl} className="w-full" />
                <Button size="sm" className="mt-3 w-full" onClick={() => navigate("/child/therapy")}>
                  Submit sentence sample for analysis
                </Button>
              </div>
            )}
          </Card>

          <Card className="bg-gradient-to-br from-brand-50 to-white">
            <p className="font-display font-bold text-slate-900">Story carry-over tips</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
              <li>• Slow down before the highlighted word.</li>
              <li>• Practice the target word alone, then inside the sentence.</li>
              <li>• Ask the child to retell the story in their own words.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}


