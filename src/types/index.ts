export type Role = "child" | "parent" | "therapist" | "admin";

export type PhonemeErrorType =
  | "substitution"
  | "omission"
  | "distortion"
  | "addition"
  | "match";

export type PhonemePosition = "Initial" | "Medial" | "Final";

export type TherapyLevel =
  | "Sound"
  | "Syllables"
  | "Words"
  | "Sentences"
  | "Story";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Child {
  id: string;
  name: string;
  hindiName: string;
  age: number;
  avatar: string;
  targetSound: string;
  level: TherapyLevel;
  progress: number;
  streakDays: number;
  therapistId: string;
  parentId: string;
  needsReview: boolean;
  sessionsThisWeek: number;
  weeklyGoal: number;
}

export interface Parent {
  id: string;
  name: string;
  phone: string;
  childIds: string[];
}

export interface TherapistAccount {
  id: string;
  name: string;
  qualification: string;
  city: string;
  activeChildren: number;
}

export interface TherapyMaterial {
  id: string;
  word: string;
  meaning: string;
  emoji: string;
  targetSound: string;
  position: PhonemePosition;
  difficulty: Difficulty;
  category: MaterialCategory;
  level: TherapyLevel;
}

export type MaterialCategory =
  | "स्वर"
  | "व्यंजन"
  | "चित्र अभ्यास"
  | "शब्द अभ्यास"
  | "वाक्य अभ्यास"
  | "कहानी"
  | "सुनो और बोलो"
  | "खेल";

export interface PhonemeObservation {
  id: string;
  childId: string;
  expected: string;
  observed: string;
  errorType: PhonemeErrorType;
  confidence: number;
  word: string;
  position: PhonemePosition;
  date: string;
  needsTherapistReview: boolean;
  isDemo: boolean;
}

export interface Assessment {
  id: string;
  childId: string;
  name: string;
  score: number;
  maxScore: number;
  date: string;
  status: "Completed" | "In Progress" | "Scheduled";
}

export interface ProgressPoint {
  label: string;
  accuracy: number;
  attempts: number;
  minutes: number;
}

export interface Appointment {
  id: string;
  childId: string;
  therapistId: string;
  date: string;
  time: string;
  mode: "Video" | "In-clinic" | "Home visit";
  status: "Confirmed" | "Pending" | "Completed";
}

export interface StorySentence {
  hi: string;
  transliteration: string;
  targetWords: string[];
}

export interface Story {
  id: string;
  title: string;
  targetSound: string;
  level: TherapyLevel;
  emoji: string;
  sentences: StorySentence[];
}

export interface GameRound {
  id: string;
  word: string;
  emoji: string;
  targetSound: string;
  options: { emoji: string; label: string; correct: boolean }[];
}

export interface TherapistReviewRecord {
  observationId: string;
  action: "accept" | "modify" | "reject" | null;
  note: string;
  reviewedAt: string | null;
}

export interface SpeechAnalysisResult {
  targetPhoneme: string;
  observedPhoneme: string;
  spokenText?: string;
  errorType: PhonemeErrorType;
  confidence: number;
  needsTherapistReview: boolean;
  isDemo: boolean;
  word: string;
  position: PhonemePosition;
  notes: string;
  createdAt: string;
}

export interface Recommendation {
  targetSound: string;
  position: PhonemePosition;
  headline: string;
  rationale: string;
  ladder: TherapyLevel[];
  activities: { title: string; detail: string; emoji: string; route: string }[];
}

export interface AdminUser {
  id: string;
  name: string;
  role: Role;
  email: string;
  status: "Active" | "Invited" | "Suspended";
  joined: string;
}

export interface AiModelCard {
  id: string;
  name: string;
  purpose: string;
  status: "Demo / simulated" | "Planned" | "Prototype";
  accuracy: string;
  version: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}
