import { useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  CalendarClock,
  Gamepad2,
  LayoutDashboard,
  LogOut,
  Menu,
  MessagesSquare,
  Mic,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Target,
  Users,
  X,
} from "lucide-react";
import { cn } from "../utils/cn";
import { useApp } from "../store/AppContext";
import { Badge } from "./ui";
import type { Role } from "../types";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

const NAV: Record<Role, NavItem[]> = {
  child: [
    { label: "Dashboard", to: "/child/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Practice", to: "/child/therapy", icon: <Mic size={18} /> },
    { label: "Materials", to: "/child/materials", icon: <BookOpen size={18} /> },
    { label: "Stories", to: "/child/story", icon: <ScrollText size={18} /> },
    { label: "Games", to: "/child/game", icon: <Gamepad2 size={18} /> },
    { label: "Progress", to: "/child/progress", icon: <BarChart3 size={18} /> },
    { label: "Speech Profile", to: "/child/digital-twin", icon: <Sparkles size={18} /> },
  ],
  parent: [
    { label: "Dashboard", to: "/parent/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Children", to: "/parent/children", icon: <Users size={18} /> },
    { label: "Progress", to: "/parent/progress", icon: <BarChart3 size={18} /> },
    { label: "Appointments", to: "/parent/appointments", icon: <CalendarClock size={18} /> },
    { label: "Activities", to: "/parent/activities", icon: <Activity size={18} /> },
  ],
  therapist: [
    { label: "Dashboard", to: "/therapist/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Children", to: "/therapist/children", icon: <Users size={18} /> },
    { label: "Assessments", to: "/therapist/assessments", icon: <Target size={18} /> },
    { label: "Phoneme Analysis", to: "/therapist/phonemes", icon: <Activity size={18} /> },
    { label: "Therapy Plans", to: "/therapist/plans", icon: <Stethoscope size={18} /> },
    { label: "Appointments", to: "/therapist/appointments", icon: <CalendarClock size={18} /> },
    { label: "Messages", to: "/therapist/messages", icon: <MessagesSquare size={18} /> },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Users", to: "/admin/users", icon: <Users size={18} /> },
    { label: "Therapists", to: "/admin/therapists", icon: <Stethoscope size={18} /> },
    { label: "Content", to: "/admin/content", icon: <BookOpen size={18} /> },
    { label: "Analytics", to: "/admin/analytics", icon: <BarChart3 size={18} /> },
    { label: "AI Models", to: "/admin/ai-models", icon: <Bot size={18} /> },
    { label: "Audit Logs", to: "/admin/audit-logs", icon: <ShieldCheck size={18} /> },
  ],
};

const ROLE_META: Record<Role, { label: string; emoji: string; accent: string }> = {
  child: { label: "Child", emoji: "🧒", accent: "from-brand-500 to-sky-500" },
  parent: { label: "Parent", emoji: "👩‍👦", accent: "from-sky-500 to-violet-500" },
  therapist: { label: "Therapist", emoji: "🩺", accent: "from-violet-500 to-indigo-600" },
  admin: { label: "Admin", emoji: "🛡️", accent: "from-slate-700 to-slate-900" },
};

export function AppLayout() {
  const { role, setRole, activeChild, currentUser, logout, isFreshAccount } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const effectiveRole: Role = role ?? "child";
  const items = useMemo(() => NAV[effectiveRole], [effectiveRole]);
  const meta = ROLE_META[effectiveRole];

  const switchRole = (r: Role) => {
    setRole(r);
    setOpen(false);
    navigate(r === "child" ? "/child/dashboard" : `/${r}/dashboard`);
  };

  const sidebar = (
    <div className="flex h-full flex-col gap-1 bg-white/95 p-4">
      <div className="mb-4 flex items-center gap-2.5 px-1">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-lg text-white shadow-sm">
          ✚
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-extrabold text-slate-900">AarogyaSpeech X</p>
          <p className="text-[11px] font-semibold text-brand-600">हिंदी वाक् अभ्यास • Speech AI</p>
        </div>
      </div>

      <div className={cn("mb-3 rounded-xl bg-gradient-to-br p-3 text-white shadow-sm", meta.accent)}>
        <p className="text-[10px] font-bold tracking-wide uppercase opacity-80">
          {isFreshAccount ? "🌱 Registered Account" : "⚡ Demo Profile"}
        </p>
        <p className="font-display text-lg font-bold truncate">
          {meta.emoji} {currentUser ? currentUser.name : (effectiveRole === "child" ? activeChild.hindiName : meta.label)}
        </p>
        <p className="text-[11px] opacity-90 truncate">
          {effectiveRole === "child" ? `Target: "${activeChild.targetSound}" sound` : (currentUser?.email || "Demo user")}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200 ring-inset"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              )
            }
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
        <p className="px-1 text-[10px] font-bold tracking-wide text-slate-400 uppercase">Quick Switch Role</p>
        <div className="grid grid-cols-2 gap-1.5">
          {(["child", "parent", "therapist", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={cn(
                "rounded-lg px-2 py-1.5 text-[11px] font-bold capitalize transition-colors",
                r === effectiveRole ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
              )}
            >
              {ROLE_META[r].emoji} {r}
            </button>
          ))}
        </div>
        <button
          onClick={() => {
            logout();
            setOpen(false);
            navigate("/login");
          }}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
        >
          <LogOut size={14} /> Sign Out & Exit
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f9fc]">
      <div className="mx-auto flex w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-68 shrink-0 border-r border-slate-200 lg:block">{sidebar}</aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <div className="absolute top-0 left-0 h-full w-72 max-w-[85vw] shadow-2xl">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 -right-11 grid size-9 place-items-center rounded-xl bg-white text-slate-600 shadow-lg"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
              {sidebar}
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="grid size-9 place-items-center rounded-xl ring-1 ring-slate-200 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={18} />
              </button>
              <div className="leading-tight">
                <p className="font-display text-sm font-extrabold text-slate-900 lg:hidden">AarogyaSpeech X</p>
                <p className="hidden text-xs font-semibold text-slate-500 lg:block">
                  {meta.emoji} {meta.label} workspace ·{" "}
                  {effectiveRole === "child" ? `${activeChild.hindiName} (${activeChild.name})` : "Demo data"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="emerald">⚡ Real AI Engine Active</Badge>
              <Badge tone="sky" className="hidden sm:inline-flex">
                Python FastAPI (Port 8000)
              </Badge>
            </div>
          </header>
          <main className="animate-rise p-4 pb-16 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
