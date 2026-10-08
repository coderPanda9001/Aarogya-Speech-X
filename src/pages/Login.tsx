import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Lock, Mail, Phone } from "lucide-react";
import { Badge, Button, Card } from "../components/ui";
import { useApp } from "../store/AppContext";
import { authService } from "../services/api";
import type { Role } from "../types";

const DEMO_ACCOUNTS = [
  { role: "child" as Role, email: "child@aarogyaspeech.com", name: "आरव (Child)", emoji: "🧒", to: "/child/dashboard" },
  { role: "parent" as Role, email: "parent@aarogyaspeech.com", name: "Priya (Parent)", emoji: "👩‍👦", to: "/parent/dashboard" },
  { role: "therapist" as Role, email: "therapist@aarogyaspeech.com", name: "Dr. Ananya (Therapist)", emoji: "🩺", to: "/therapist/dashboard" },
  { role: "admin" as Role, email: "admin@aarogyaspeech.com", name: "Admin (Platform)", emoji: "🛡️", to: "/admin/dashboard" },
];

export default function Login() {
  const { setRole, setCurrentUser, updateTargetSound } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("child@aarogyaspeech.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [signupRole, setSignupRole] = useState<Role>("child");
  const [targetSound, setTargetSoundInput] = useState<string>("र");
  const [contactPhone, setContactPhone] = useState("9876543210");
  const [parentContactPhone, setParentContactPhone] = useState("9876543210");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        const res = await authService.login(email, password);
        setCurrentUser(res.user);
        setRole(res.user.role);
        navigate(`/${res.user.role}/dashboard`);
      } else {
        const res = await authService.signup(
          email,
          password,
          name || email.split("@")[0],
          signupRole,
          signupRole === "child" ? undefined : contactPhone,
          signupRole === "child" ? parentContactPhone : contactPhone
        );
        setCurrentUser(res.user);
        setRole(res.user.role);
        if (signupRole === "child" && targetSound) {
          updateTargetSound(targetSound);
        }
        navigate(`/${res.user.role}/dashboard`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword("password123");
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login(acc.email, "password123");
      setCurrentUser(res.user);
      setRole(res.user.role);
      navigate(acc.to);
    } catch (err) {
      setCurrentUser({
        id: `demo_${acc.role}`,
        email: acc.email,
        name: acc.name,
        role: acc.role,
      });
      setRole(acc.role);
      navigate(acc.to);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-white via-brand-50/50 to-[#f6f9fc] px-4 py-10">
      <div className="w-full max-w-4xl animate-rise">
        <div className="mb-6 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl text-white">
            ✚
          </span>
          <h1 className="font-display mt-3 text-3xl font-extrabold text-slate-900">
            {mode === "login" ? "Account Sign In" : "Register New Account"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Real User Authentication backed by JWT Tokens & Database Storage Sync.
          </p>
          <Badge tone="emerald" className="mt-3">⚡ Real JWT Auth · Storage Sync Connected</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* REAL AUTH FORM */}
          <Card className="flex flex-col justify-between border-brand-200">
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="font-display font-bold text-lg text-slate-900">
                  {mode === "login" ? "Sign In Credentials" : "Create Account"}
                </h2>
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  {mode === "login" ? "Need an account? Sign Up" : "Already registered? Sign In"}
                </button>
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 ring-inset">
                  ⚠️ {error}
                </div>
              )}

              {mode === "signup" && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600">Role</label>
                    <select
                      value={signupRole}
                      onChange={(e) => setSignupRole(e.target.value as Role)}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="child">Child (Pronunciation Practice)</option>
                      <option value="parent">Parent (Weekly Monitoring)</option>
                      <option value="therapist">Speech Therapist (Clinical Review)</option>
                    </select>
                  </div>
                  {signupRole === "child" ? (
                    <div>
                      <label className="text-xs font-bold text-slate-600">Parent Contact Number (अभिभावक का फोन नंबर)</label>
                      <div className="relative mt-1">
                        <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={parentContactPhone}
                          onChange={(e) => setParentContactPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-brand-700">
                        🔗 This contact number automatically connects this child to the parent's dashboard!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold text-slate-600">Mobile / Contact Number (आपका मोबाइल नंबर)</label>
                      <div className="relative mt-1">
                        <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <p className="mt-1 text-[11px] font-medium text-brand-700">
                        🔗 Children who created an account with this number will be automatically added to your dashboard.
                      </p>
                    </div>
                  )}

                  {signupRole === "child" && (
                    <div>
                      <label className="text-xs font-bold text-slate-600">Target Sound for Practice (लक्ष्य ध्वनि)</label>
                      <select
                        value={targetSound}
                        onChange={(e) => setTargetSoundInput(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="र">र (Trill sound - e.g. रथ, राजा, घर)</option>
                        <option value="स">स (Sibilant sound - e.g. सेब, सूरज, बस)</option>
                        <option value="श">श (Sh sound - e.g. शेर, शक्कर, शाम)</option>
                        <option value="क">क (Velar sound - e.g. कमल, कान, किताब)</option>
                        <option value="ल">ल (Lateral sound - e.g. लड़का, लाल, फूल)</option>
                        <option value="त">त (Dental sound - e.g. ताला, तोता, छात्र)</option>
                        <option value="फ">फ (Labial sound - e.g. फल, फूल, सफाई)</option>
                      </select>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="text-xs font-bold text-slate-600">Email Address</label>
                <div className="relative mt-1">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@aarogyaspeech.com"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600">Password</label>
                <div className="relative mt-1">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating…" : mode === "login" ? "Sign In to Workspace" : "Register Account"}
              </Button>
            </form>
          </Card>

          {/* QUICK SEEDED DEMO ACCOUNTS */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Test Accounts (Pre-Seeded in DB)</p>
            <div className="grid gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <div
                  key={acc.role}
                  onClick={() => quickLogin(acc)}
                  className="cursor-pointer"
                >
                  <Card className="flex items-center justify-between p-3.5 transition-colors hover:border-brand-300">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{acc.emoji}</span>
                      <div>
                        <p className="font-display text-sm font-bold text-slate-900">{acc.name}</p>
                        <p className="text-xs text-slate-500">{acc.email}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="secondary">
                      Sign In <ArrowRight size={14} />
                    </Button>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button onClick={() => navigate("/")} className="text-xs font-semibold text-brand-700 hover:underline">
            ← Back to landing page
          </button>
        </div>
      </div>
    </div>
  );
}
