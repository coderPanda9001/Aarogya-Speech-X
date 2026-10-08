import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_-18px_rgba(15,23,42,0.18)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

const badgeTones: Record<string, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  slate: "bg-slate-100 text-slate-600 ring-slate-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
  sky: "bg-sky-50 text-sky-700 ring-sky-200",
};

export function Badge({
  children,
  tone = "slate",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset whitespace-nowrap",
        badgeTones[tone] ?? badgeTones.slate,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function DemoBadge({ label = "AI Speech Analysis" }: { label?: string }) {
  return <Badge tone="violet">⚡ {label}</Badge>;
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "success" | "dark";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/25 focus-visible:outline-brand-600",
  secondary:
    "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  success: "bg-emerald-600 text-white hover:bg-emerald-700",
  dark: "bg-slate-900 text-white hover:bg-slate-800",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2.5 text-sm",
        size === "lg" && "px-5 py-3 text-base",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function ProgressRing({
  value,
  size = 112,
  stroke = 10,
  label,
  sublabel,
  color = "#0d8d8a",
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl font-bold text-slate-900">{label ?? `${Math.round(value)}%`}</span>
        {sublabel && <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase">{sublabel}</span>}
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  tone?: keyof typeof badgeTones;
}) {
  return (
    <Card className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</p>
        <p className="font-display mt-1 text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
      {icon && (
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl ring-1 ring-inset", badgeTones[tone])}>
          {icon}
        </span>
      )}
    </Card>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
  hindi,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  hindi?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={cn("font-display text-2xl font-bold text-slate-900 sm:text-3xl", hindi && "font-hi")}>
          {title}
        </h1>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-500">{subtitle}</p>}
      </div>
      {right && <div className="flex flex-wrap items-center gap-2">{right}</div>}
    </div>
  );
}

export function EmptyState({
  icon = "🗂️",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center">
      <div className="animate-floaty mx-auto grid size-14 place-items-center rounded-2xl bg-brand-50 text-2xl ring-1 ring-brand-200 ring-inset">
        {icon}
      </div>
      <h3 className="font-display mt-3 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Disclaimer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200 ring-inset", className)}>
      {children}
    </p>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            {head.map((h) => (
              <th key={h} className="border-b border-slate-200 px-3 py-2 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
