import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, RefreshCw, Trophy } from "lucide-react";
import { Badge, Button, Card, PageHeader, ProgressRing } from "../../components/ui";
import { GAME_ROUNDS } from "../../data/demoData";
import { speakHindi } from "../../hooks/useRecorder";
import { useApp } from "../../store/AppContext";
import { cn } from "../../utils/cn";

export default function GamePage() {
  const navigate = useNavigate();
  const { gameScore, gameRoundIndex, bumpGameScore, nextRound, resetGame } = useApp();
  const [picked, setPicked] = useState<number | null>(null);

  const finished = gameRoundIndex >= GAME_ROUNDS.length;
  const round = GAME_ROUNDS[Math.min(gameRoundIndex, GAME_ROUNDS.length - 1)];
  const totalRounds = GAME_ROUNDS.length;
  const accuracy = gameScore === 0 && gameRoundIndex === 0 ? 0 : Math.round((gameScore / Math.max(1, gameRoundIndex + (picked !== null ? 1 : 0))) * 100);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (round.options[i].correct) bumpGameScore(1);
    speakHindi(round.options[i].label);
  };

  const proceed = () => {
    setPicked(null);
    nextRound();
  };

  return (
    <div>
      <PageHeader
        hindi
        title="सही चित्र चुनो"
        subtitle="Listen to the Hindi word (or read it) and pick the matching picture. Target-sound practice, hidden inside a game."
        right={
          <>
            <Badge tone="amber">🎯 Score: {gameScore}</Badge>
            <Badge tone="sky">
              Round {Math.min(gameRoundIndex + 1, totalRounds)} / {totalRounds}
            </Badge>
            <Button size="sm" variant="secondary" onClick={resetGame}>
              <RefreshCw size={14} /> Restart
            </Button>
          </>
        }
      />

      {finished ? (
        <Card className="mx-auto max-w-xl text-center">
          <p className="text-5xl">🏅</p>
          <h2 className="font-display mt-3 text-2xl font-extrabold text-slate-900">खेल पूरा हुआ!</h2>
          <p className="mt-1 text-sm text-slate-500">
            You matched {gameScore} of {totalRounds} pictures. Great listening!
          </p>
          <div className="mt-5 flex justify-center">
            <ProgressRing value={(gameScore / totalRounds) * 100} sublabel="score" size={130} />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Button onClick={resetGame}>
              <RefreshCw size={16} /> Play Again
            </Button>
            <Button variant="secondary" onClick={() => navigate("/child/therapy")}>
              <Mic size={16} /> Practice with mic
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_0.6fr]">
          <Card className="bg-gradient-to-br from-sky-50 via-white to-brand-50">
            <div className="text-center">
              <p className="text-xs font-bold tracking-wide text-slate-500 uppercase">शब्द सुनो और चुनो</p>
              <p className="font-hi font-display mt-1 text-5xl font-extrabold text-slate-900">{round.word}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Badge tone="brand">Target: {round.targetSound}</Badge>
                <Button size="sm" variant="secondary" onClick={() => speakHindi(round.word)}>
                  🔊 सुनो
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {round.options.map((o, i) => {
                const isPicked = picked === i;
                const reveal = picked !== null;
                return (
                  <button
                    key={`${o.label}-${i}`}
                    onClick={() => choose(i)}
                    disabled={reveal}
                    className={cn(
                      "group flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 transition-all",
                      reveal && o.correct
                        ? "ring-2 ring-emerald-400"
                        : isPicked && !o.correct
                          ? "ring-2 ring-rose-400"
                          : "ring-slate-200 hover:-translate-y-1 hover:ring-brand-300",
                    )}
                  >
                    <span className={cn("text-5xl transition-transform", !reveal && "group-hover:scale-110")}>{o.emoji}</span>
                    <span className="font-hi text-sm font-bold text-slate-700">{o.label}</span>
                    {reveal && o.correct && <Badge tone="green">सही ⭐</Badge>}
                    {reveal && isPicked && !o.correct && <Badge tone="red">फिर कोशिश करो</Badge>}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div
                className={cn(
                  "animate-rise mt-5 flex flex-col items-center gap-3 rounded-2xl px-4 py-4 text-center ring-1 ring-inset sm:flex-row sm:justify-between sm:text-left",
                  round.options[picked].correct
                    ? "bg-emerald-50 ring-emerald-200"
                    : "bg-amber-50 ring-amber-200",
                )}
              >
                <div>
                  <p className="font-hi font-display text-lg font-bold text-slate-900">
                    {round.options[picked].correct ? "बहुत बढ़िया! ⭐" : "अच्छी कोशिश! 💪"}
                  </p>
                  <p className="font-hi text-sm text-slate-600">
                    सही उत्तर: {round.options.find((o) => o.correct)?.emoji} {round.options.find((o) => o.correct)?.label}
                  </p>
                </div>
                <Button onClick={proceed}>
                  {gameRoundIndex + 1 >= totalRounds ? "See Score" : "Next Round"}
                </Button>
              </div>
            )}
          </Card>

          <div className="space-y-5">
            <Card className="text-center">
              <p className="font-display font-bold text-slate-900">Session Score</p>
              <div className="mt-3 flex justify-center">
                <ProgressRing value={accuracy} label={`${gameScore}/${totalRounds}`} sublabel="stars" size={124} color="#f59e0b" />
              </div>
              <p className="mt-2 text-xs text-slate-500">Correct picks this session (85% agreement target)</p>
            </Card>

            <Card>
              <p className="font-display font-bold text-slate-900">Why this game?</p>
              <p className="mt-1 text-sm text-slate-500">
                Picture matching drills receptive knowledge of the target sound before production. It is a warm-up — always
                follow it with a mic recording task.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 ring-1 ring-amber-200 ring-inset">
                <Trophy size={16} className="text-amber-600" />
                <p className="text-xs font-semibold text-amber-800">Every 5 ⭐ unlocks a new story in Story Practice</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
