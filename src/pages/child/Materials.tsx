import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ear, Mic, Search } from "lucide-react";
import { Badge, Button, Card, DemoBadge, EmptyState, PageHeader } from "../../components/ui";
import { MATERIAL_CATEGORIES, MATERIALS } from "../../data/demoData";
import { speakHindi } from "../../hooks/useRecorder";
import { cn } from "../../utils/cn";
import type { Difficulty } from "../../types";

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];

export default function Materials() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>("सभी");
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<string>("All");

  const filtered = useMemo(
    () =>
      MATERIALS.filter((m) => {
        const byCat = category === "सभी" || m.category === category;
        const byDiff = difficulty === "All" || m.difficulty === difficulty;
        const q = query.trim().toLowerCase();
        const byQuery = !q || m.word.toLowerCase().includes(q) || m.meaning.toLowerCase().includes(q) || m.targetSound.includes(q);
        return byCat && byDiff && byQuery;
      }),
    [category, difficulty, query],
  );

  return (
    <div>
      <PageHeader
        hindi
        title="हिंदी थेरेपी सामग्री"
        subtitle="Curated Hindi therapy materials tagged by target sound, position and difficulty. Use these for daily home practice."
        right={<DemoBadge label="Curated Therapy Content" />}
      />

      <Card className="mb-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="शब्द खोजें (e.g. रथ, सूरज)"
              className="font-hi w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3 pl-9 text-sm text-slate-700 outline-none focus:border-brand-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase">Difficulty</span>
            <div className="flex gap-1.5">
              {["All", ...DIFFICULTIES].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors",
                    difficulty === d ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="mb-5 flex flex-wrap gap-2">
        {["सभी", ...MATERIAL_CATEGORIES.map((c) => c.name)].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "font-hi rounded-full px-3.5 py-2 text-sm font-semibold transition-colors",
              category === c
                ? "bg-brand-600 text-white shadow-sm shadow-brand-600/25"
                : "bg-white text-slate-600 ring-1 ring-slate-200 ring-inset hover:bg-slate-50",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MATERIAL_CATEGORIES.slice(0, 4).map((c) => (
          <Card key={c.name} className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-slate-50 text-lg ring-1 ring-slate-200 ring-inset">
              {c.emoji}
            </span>
            <div className="min-w-0">
              <p className="font-hi truncate font-bold text-slate-900">{c.name}</p>
              <p className="truncate text-[11px] text-slate-500">
                {c.count} items · {c.blurb}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="कोई सामग्री नहीं मिली"
          description="No therapy material matched your filters. Try clearing the search or switching difficulty."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setCategory("सभी");
                setDifficulty("All");
              }}
            >
              Reset filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((m) => (
            <Card key={m.id} className="flex flex-col justify-between transition-transform hover:-translate-y-1">
              <div>
                <div className="flex items-start justify-between">
                  <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-50 to-sky-50 text-3xl ring-1 ring-brand-100 ring-inset">
                    {m.emoji}
                  </span>
                  <Badge tone={m.difficulty === "Easy" ? "green" : m.difficulty === "Medium" ? "amber" : "red"}>
                    {m.difficulty}
                  </Badge>
                </div>
                <p className="font-hi font-display mt-3 text-2xl font-extrabold text-slate-900">{m.word}</p>
                <p className="text-xs text-slate-500">{m.meaning}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone="brand">Sound {m.targetSound}</Badge>
                  <Badge tone="sky">{m.position}</Badge>
                  <Badge tone="slate">{m.level}</Badge>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={() => navigate(`/child/therapy?word=${m.id}`)}>
                  <Mic size={14} /> Practice
                </Button>
                <Button size="sm" variant="secondary" onClick={() => speakHindi(m.word)}>
                  <Ear size={14} /> Listen
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        Curated Hindi speech therapy content. Please confirm material suitability with your treating therapist.
      </p>
    </div>
  );
}
