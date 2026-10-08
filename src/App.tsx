import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "./components/Layout";
import { AppProvider, useApp } from "./store/AppContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ChildDashboard from "./pages/child/ChildDashboard";
import TherapySession from "./pages/child/TherapySession";
import Materials from "./pages/child/Materials";
import StoryPage from "./pages/child/StoryPage";
import GamePage from "./pages/child/GamePage";
import ProgressPage from "./pages/child/ProgressPage";
import SpeechProfile from "./pages/child/SpeechProfile";
import {
  ParentActivities,
  ParentAppointments,
  ParentChildren,
  ParentDashboard,
  ParentProgress,
} from "./pages/parent/ParentPages";
import {
  ChildDetail,
  PhonemeAnalysis,
  TherapistAppointments,
  TherapistAssessments,
  TherapistChildren,
  TherapistDashboard,
  TherapistMessages,
  TherapyPlans,
} from "./pages/therapist/TherapistPages";
import {
  AdminAiModels,
  AdminAnalytics,
  AdminAuditLogs,
  AdminContent,
  AdminDashboard,
  AdminTherapists,
  AdminUsers,
} from "./pages/admin/AdminPages";
import type { Role } from "./types";

/** Keeps the mock "session role" in sync with the URL so deep links work. */
function RoleSync() {
  const location = useLocation();
  const { role, setRole } = useApp();
  useEffect(() => {
    const seg = location.pathname.split("/")[1] as Role | "";
    if (["child", "parent", "therapist", "admin"].includes(seg) && seg !== role) {
      setRole(seg as Role);
    }
  }, [location.pathname, role, setRole]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <RoleSync />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route element={<AppLayout />}>
            {/* Child */}
            <Route path="/child/dashboard" element={<ChildDashboard />} />
            <Route path="/child/therapy" element={<TherapySession />} />
            <Route path="/child/materials" element={<Materials />} />
            <Route path="/child/story" element={<StoryPage />} />
            <Route path="/child/game" element={<GamePage />} />
            <Route path="/child/progress" element={<ProgressPage />} />
            <Route path="/child/digital-twin" element={<SpeechProfile />} />

            {/* Parent */}
            <Route path="/parent/dashboard" element={<ParentDashboard />} />
            <Route path="/parent/children" element={<ParentChildren />} />
            <Route path="/parent/progress" element={<ParentProgress />} />
            <Route path="/parent/appointments" element={<ParentAppointments />} />
            <Route path="/parent/activities" element={<ParentActivities />} />

            {/* Therapist */}
            <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
            <Route path="/therapist/children" element={<TherapistChildren />} />
            <Route path="/therapist/children/:id" element={<ChildDetail />} />
            <Route path="/therapist/assessments" element={<TherapistAssessments />} />
            <Route path="/therapist/phonemes" element={<PhonemeAnalysis />} />
            <Route path="/therapist/plans" element={<TherapyPlans />} />
            <Route path="/therapist/appointments" element={<TherapistAppointments />} />
            <Route path="/therapist/messages" element={<TherapistMessages />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/therapists" element={<AdminTherapists />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/ai-models" element={<AdminAiModels />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          </Route>

          <Route path="/dashboard" element={<Navigate to="/login" replace />} />
          <Route path="/child" element={<Navigate to="/child/dashboard" replace />} />
          <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
          <Route path="/therapist" element={<Navigate to="/therapist/dashboard" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}
