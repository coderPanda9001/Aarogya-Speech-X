import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { Button, Card } from "../components/ui";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="grid min-h-screen place-items-center bg-[#f6f9fc] px-4">
      <Card className="w-full max-w-lg text-center">
        <p className="text-5xl">🧭</p>
        <h1 className="font-display mt-3 text-2xl font-extrabold text-slate-900">यह पेज नहीं मिला (404)</h1>
        <p className="mt-1 text-sm text-slate-500">
          The route you opened does not exist in AarogyaSpeech X. Sign in to access your role dashboard.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button onClick={() => navigate("/")}>
            <Home size={16} /> Landing page
          </Button>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button variant="ghost" onClick={() => navigate("/child/dashboard")}>
            Child dashboard
          </Button>
        </div>
      </Card>
    </div>
  );
}
