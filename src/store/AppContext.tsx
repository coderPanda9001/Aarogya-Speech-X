import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  CHILDREN,
  CURRENT_CHILD_ID,
  PHONEME_OBSERVATIONS,
  RECOMMENDED_ACTIVITIES,
  PROGRESS_HISTORY,
} from "../data/demoData";
import { buildRecommendation } from "../services/speechAnalysisService";
import { authService } from "../services/api";
import type { AuthUser } from "../services/api";
import type {
  Child,
  PhonemeObservation,
  Recommendation,
  Role,
  SpeechAnalysisResult,
  TherapistReviewRecord as TherapyReviewActions,
} from "../types";

export interface PracticeAttempt {
  id: string;
  childId: string;
  word: string;
  targetSound: string;
  observedSound: string;
  errorType: string;
  confidence: number;
  createdAt: number;
}

const DEMO_EMAILS = [
  "child@aarogyaspeech.com",
  "parent@aarogyaspeech.com",
  "therapist@aarogyaspeech.com",
  "admin@aarogyaspeech.com",
];

interface AppState {
  currentUser: AuthUser | null;
  setCurrentUser: (user: AuthUser | null) => void;
  role: Role | null;
  setRole: (role: Role | null) => void;
  activeChildId: string;
  activeChild: Child;
  attempts: PracticeAttempt[];
  observations: PhonemeObservation[];
  lastAnalysis: SpeechAnalysisResult | null;
  recommendation: Recommendation | null;
  childProgress: number;
  streakDays: number;
  level: Child["level"];
  gameScore: number;
  gameRoundIndex: number;
  reviews: Record<string, TherapyReviewActions>;
  isFreshAccount: boolean;
  updateTargetSound: (sound: string) => void;
  logAttempt: (result: SpeechAnalysisResult) => void;
  selectChild: (id: string) => void;
  bumpGameScore: (delta: number) => void;
  nextRound: () => void;
  resetGame: () => void;
  setReview: (observationId: string, action: "accept" | "modify" | "reject", note: string) => void;
  hasAttemptFor: (word: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => authService.getUser());
  const [role, setRole] = useState<Role | null>(() => currentUser?.role || null);
  const [activeChildId, setActiveChildId] = useState(CURRENT_CHILD_ID);
  const [lastAnalysis, setLastAnalysis] = useState<SpeechAnalysisResult | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameRoundIndex, setGameRoundIndex] = useState(0);
  const [reviews, setReviews] = useState<Record<string, TherapyReviewActions>>({});

  const isFreshAccount = useMemo(() => {
    if (!currentUser) return false;
    return !DEMO_EMAILS.includes(currentUser.email.toLowerCase());
  }, [currentUser]);

  // Target sound for fresh profile or default
  const [targetSound, setTargetSound] = useState<string>(() => {
    if (currentUser && !DEMO_EMAILS.includes(currentUser.email.toLowerCase())) {
      const stored = localStorage.getItem(`aarogyaspeech_target_sound_${currentUser.id}`);
      return stored || "र";
    }
    return "र";
  });

  // Attempts stored per user
  const [attempts, setAttempts] = useState<PracticeAttempt[]>(() => {
    if (currentUser && !DEMO_EMAILS.includes(currentUser.email.toLowerCase())) {
      const stored = localStorage.getItem(`aarogyaspeech_attempts_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  // Observations stored per user
  const [observations, setObservations] = useState<PhonemeObservation[]>(() => {
    if (currentUser && !DEMO_EMAILS.includes(currentUser.email.toLowerCase())) {
      const stored = localStorage.getItem(`aarogyaspeech_obs_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [];
    }
    return PHONEME_OBSERVATIONS;
  });

  // Reload user state when currentUser updates
  useEffect(() => {
    if (currentUser) {
      setRole(currentUser.role);
      const isDemo = DEMO_EMAILS.includes(currentUser.email.toLowerCase());
      if (!isDemo) {
        const sound = localStorage.getItem(`aarogyaspeech_target_sound_${currentUser.id}`);
        setTargetSound(sound || "र");
        const att = localStorage.getItem(`aarogyaspeech_attempts_${currentUser.id}`);
        setAttempts(att ? JSON.parse(att) : []);
        const obs = localStorage.getItem(`aarogyaspeech_obs_${currentUser.id}`);
        setObservations(obs ? JSON.parse(obs) : []);
      } else {
        setAttempts([]);
        setObservations(PHONEME_OBSERVATIONS);
      }
    }
  }, [currentUser]);

  const updateTargetSound = useCallback((sound: string) => {
    setTargetSound(sound);
    if (currentUser) {
      localStorage.setItem(`aarogyaspeech_target_sound_${currentUser.id}`, sound);
    }
  }, [currentUser]);

  // Dynamically constructed child profile
  const activeChild: Child = useMemo(() => {
    if (currentUser && isFreshAccount) {
      const matches = attempts.filter((a) => a.errorType === "match").length;
      return {
        id: currentUser.id,
        name: currentUser.name,
        hindiName: currentUser.name,
        age: 6,
        avatar: "🧒",
        targetSound: targetSound,
        level: matches >= 3 ? "Sentences" : "Words",
        progress: 0, // baseline
        streakDays: Math.max(1, attempts.length > 0 ? 1 : 1),
        therapistId: "t1",
        parentId: "p1",
        needsReview: false,
        sessionsThisWeek: attempts.length,
        weeklyGoal: 6,
      };
    }
    const found = CHILDREN.find((c) => c.id === activeChildId) ?? CHILDREN[0];
    return {
      ...found,
      targetSound: targetSound || found.targetSound,
    };
  }, [currentUser, isFreshAccount, targetSound, attempts, activeChildId]);

  // Dynamic progress calculation starting from 0% for fresh accounts
  const childProgress = useMemo(() => {
    if (isFreshAccount) {
      if (attempts.length === 0) return 0;
      const matches = attempts.filter((a) => a.errorType === "match").length;
      const otherAttempts = attempts.length - matches;
      // 15% per correct match, 5% per practice attempt (capped at 98%)
      const calculated = matches * 15 + otherAttempts * 5;
      return Math.min(98, calculated);
    }
    const base = activeChild.progress;
    const bonus = attempts.filter((a) => a.childId === activeChild.id).length * 2;
    return Math.min(98, base + bonus);
  }, [isFreshAccount, activeChild, attempts]);

  const level: Child["level"] = useMemo(() => {
    if (isFreshAccount) {
      const matchCount = attempts.filter((a) => a.errorType === "match").length;
      return matchCount >= 3 ? "Sentences" : "Words";
    }
    return lastAnalysis && lastAnalysis.errorType === "match" ? "Sentences" : activeChild.level;
  }, [isFreshAccount, attempts, lastAnalysis, activeChild.level]);

  const logAttempt = useCallback(
    (result: SpeechAnalysisResult) => {
      setLastAnalysis(result);
      setRecommendation(buildRecommendation(result, RECOMMENDED_ACTIVITIES));
      const attempt: PracticeAttempt = {
        id: `att-${Date.now()}`,
        childId: activeChild.id,
        word: result.word,
        targetSound: result.targetPhoneme,
        observedSound: result.observedPhoneme,
        errorType: result.errorType,
        confidence: result.confidence,
        createdAt: Date.now(),
      };
      const newObs: PhonemeObservation = {
        id: `obs-${Date.now()}`,
        childId: activeChild.id,
        expected: result.targetPhoneme,
        observed: result.observedPhoneme,
        errorType: result.errorType,
        confidence: result.confidence,
        word: result.word,
        position: result.position,
        date: new Date().toISOString().slice(0, 10),
        needsTherapistReview: result.needsTherapistReview,
        isDemo: !isFreshAccount,
      };

      setAttempts((prev) => {
        const next = [...prev, attempt];
        if (currentUser && isFreshAccount) {
          localStorage.setItem(`aarogyaspeech_attempts_${currentUser.id}`, JSON.stringify(next));
        }
        return next;
      });

      setObservations((prev) => {
        const next = [newObs, ...prev];
        if (currentUser && isFreshAccount) {
          localStorage.setItem(`aarogyaspeech_obs_${currentUser.id}`, JSON.stringify(next));
        }
        return next;
      });
    },
    [activeChild.id, currentUser, isFreshAccount],
  );

  const setReview = useCallback(
    (observationId: string, action: "accept" | "modify" | "reject", note: string) => {
      setReviews((prev) => ({
        ...prev,
        [observationId]: { observationId, action, note, reviewedAt: new Date().toISOString() },
      }));
      import("../services/api").then(({ therapistService }) => {
        therapistService.submitReview(observationId, action, note);
      });
    },
    [],
  );

  const logout = useCallback(() => {
    authService.clearToken();
    setCurrentUser(null);
    setRole(null);
  }, []);

  const value: AppState = {
    currentUser,
    setCurrentUser,
    role,
    setRole,
    activeChildId,
    activeChild,
    attempts,
    observations,
    lastAnalysis,
    recommendation,
    childProgress,
    streakDays: activeChild.streakDays + (attempts.length > 0 ? 1 : 0),
    level,
    gameScore,
    gameRoundIndex,
    reviews,
    isFreshAccount,
    updateTargetSound,
    logAttempt,
    selectChild: setActiveChildId,
    bumpGameScore: (delta) => setGameScore((s) => Math.max(0, s + delta)),
    nextRound: () => setGameRoundIndex((i) => i + 1),
    resetGame: () => {
      setGameScore(0);
      setGameRoundIndex(0);
    },
    setReview,
    hasAttemptFor: (word: string) => attempts.some((a) => a.word === word),
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export { PROGRESS_HISTORY };

