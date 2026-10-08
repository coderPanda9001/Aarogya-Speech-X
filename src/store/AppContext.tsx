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
  linkedChildren: Child[];
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
  weeklyPractice: { day: string; minutes: number; score: number }[];
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

  // Auto-linked children matching parent's contact phone number
  const linkedChildren: Child[] = useMemo(() => {
    if (!currentUser) return CHILDREN;

    if (currentUser.role === "child") {
      const freshChild: Child = {
        id: currentUser.id,
        name: currentUser.name,
        hindiName: currentUser.name,
        age: 6,
        avatar: "🧒",
        targetSound: targetSound || "र",
        level: "Words",
        progress: 0,
        streakDays: Math.max(1, attempts.length > 0 ? 1 : 1),
        therapistId: "t1",
        parentId: "p1",
        needsReview: false,
        sessionsThisWeek: attempts.length,
        weeklyGoal: 6,
      };
      return [freshChild];
    }

    const parentPhone = currentUser.phone || currentUser.parentPhone || "9876543210";

    let localUsers: any[] = [];
    try {
      const raw = localStorage.getItem("aarogyaspeech_local_users");
      localUsers = raw ? JSON.parse(raw) : [];
    } catch {
      localUsers = [];
    }

    const matchedChildren = localUsers.filter(
      (u) => u.role === "child" && (u.parentPhone === parentPhone || u.phone === parentPhone)
    );

    const formattedMatched: Child[] = matchedChildren.map((mc, idx) => ({
      id: mc.id,
      name: mc.name,
      hindiName: mc.name,
      age: 6,
      avatar: idx % 2 === 0 ? "🧒" : "👧",
      targetSound: "र",
      level: "Words",
      progress: 0,
      streakDays: 1,
      therapistId: "t1",
      parentId: currentUser.id,
      parentPhone: mc.parentPhone || parentPhone,
      needsReview: false,
      sessionsThisWeek: 0,
      weeklyGoal: 6,
    }));

    // For fresh/real parent accounts: ONLY return children whose parentPhone matches this parent's contact number!
    if (isFreshAccount) {
      return formattedMatched;
    }

    // For demo parent account (parent@aarogyaspeech.com): return formattedMatched + default demo children
    const defaultDemo = CHILDREN.filter((c) => c.parentId === "p1" || c.id === "c1" || c.id === "c2");

    const combined = [...formattedMatched];
    for (const d of defaultDemo) {
      if (!combined.some((c) => c.id === d.id || c.name.toLowerCase() === d.name.toLowerCase())) {
        combined.push(d);
      }
    }
    return combined;
  }, [currentUser, targetSound, attempts, isFreshAccount]);

  // Dynamically constructed active child profile
  const activeChild: Child = useMemo(() => {
    if (currentUser && currentUser.role === "child") {
      return linkedChildren[0] || {
        id: currentUser.id,
        name: currentUser.name,
        hindiName: currentUser.name,
        age: 6,
        avatar: "🧒",
        targetSound: targetSound,
        level: "Words",
        progress: 0,
        streakDays: 1,
        therapistId: "t1",
        parentId: "p1",
        needsReview: false,
        sessionsThisWeek: attempts.length,
        weeklyGoal: 6,
      };
    }

    const foundInLinked = linkedChildren.find((c) => c.id === activeChildId);
    if (foundInLinked) return foundInLinked;

    if (linkedChildren.length > 0) {
      return linkedChildren[0];
    }

    // Placeholder if no child connected yet
    return {
      id: "none",
      name: "No Child Connected",
      hindiName: "कोई बच्चा जुड़ा नहीं",
      age: 0,
      avatar: "👶",
      targetSound: "—",
      level: "Words",
      progress: 0,
      streakDays: 0,
      therapistId: "",
      parentId: currentUser ? currentUser.id : "",
      needsReview: false,
      sessionsThisWeek: 0,
      weeklyGoal: 0,
    };
  }, [currentUser, activeChildId, linkedChildren, targetSound, attempts]);

  // Dynamic progress calculation starting from 0% when no attempts have been logged
  const childProgress = useMemo(() => {
    if (attempts.length === 0) return 0;
    const matches = attempts.filter((a) => a.errorType === "match").length;
    const accuracy = Math.round((matches / attempts.length) * 100);
    return Math.min(100, Math.max(0, accuracy));
  }, [attempts]);

  const level: Child["level"] = useMemo(() => {
    const matchCount = attempts.filter((a) => a.errorType === "match").length;
    return matchCount >= 3 ? "Sentences" : "Words";
  }, [attempts]);

  const streakDays = useMemo(() => {
    if (attempts.length === 0) return 0;
    const dates = new Set(attempts.map((a) => new Date(a.createdAt).toDateString()));
    return dates.size;
  }, [attempts]);

  const logAttempt = useCallback(
    (result: SpeechAnalysisResult) => {
      setLastAnalysis(result);
      setRecommendation(buildRecommendation(result, RECOMMENDED_ACTIVITIES));
      const attempt: PracticeAttempt = {
        id: `att-${Date.now()}`,
        childId: activeChild ? activeChild.id : "c1",
        word: result.word,
        targetSound: result.targetPhoneme,
        observedSound: result.observedPhoneme,
        errorType: result.errorType,
        confidence: result.confidence,
        createdAt: Date.now(),
      };
      const newObs: PhonemeObservation = {
        id: `obs-${Date.now()}`,
        childId: activeChild ? activeChild.id : "c1",
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
    [activeChild, currentUser, isFreshAccount],
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

  const weeklyPractice = useMemo(() => {
    const days = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];
    if (attempts.length === 0) {
      return days.map((day) => ({ day, minutes: 0, score: 0 }));
    }

    const dayStats: Record<number, { count: number; matches: number }> = {
      0: { count: 0, matches: 0 },
      1: { count: 0, matches: 0 },
      2: { count: 0, matches: 0 },
      3: { count: 0, matches: 0 },
      4: { count: 0, matches: 0 },
      5: { count: 0, matches: 0 },
      6: { count: 0, matches: 0 },
    };

    attempts.forEach((a) => {
      const date = new Date(a.createdAt);
      const jsDay = date.getDay(); // 0 is Sun, 1 is Mon, ..., 6 is Sat
      const devDay = jsDay === 0 ? 6 : jsDay - 1; // 0 = Mon ... 6 = Sun
      if (dayStats[devDay]) {
        dayStats[devDay].count += 1;
        if (a.errorType === "match") {
          dayStats[devDay].matches += 1;
        }
      }
    });

    return days.map((day, idx) => {
      const stat = dayStats[idx];
      if (stat.count === 0) {
        return { day, minutes: 0, score: 0 };
      }
      const minutes = Math.round(stat.count * 1.5 * 10) / 10;
      const score = Math.round((stat.matches / stat.count) * 100);
      return { day, minutes, score };
    });
  }, [attempts]);

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
    linkedChildren,
    attempts,
    observations,
    lastAnalysis,
    recommendation,
    childProgress,
    streakDays: isFreshAccount ? (attempts.length > 0 ? 1 : 0) : activeChild.streakDays + (attempts.length > 0 ? 1 : 0),
    level,
    gameScore,
    gameRoundIndex,
    reviews,
    isFreshAccount,
    weeklyPractice,
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

