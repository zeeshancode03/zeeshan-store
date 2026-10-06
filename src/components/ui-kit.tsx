import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.round(rating) ? "fill-warning text-warning" : "text-muted-foreground/40")} />
      ))}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("relative overflow-hidden rounded-xl bg-muted/50", className)}><div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-foreground/5 to-transparent" /></div>;
}

export function StockBadge({ stock }: { stock: number }) {
  const [label, cls] = stock === 0 ? ["Out of Stock", "bg-destructive/15 text-destructive border-destructive/30"] : stock < 10 ? ["Low Stock", "bg-warning/15 text-warning border-warning/30"] : ["In Stock", "bg-success/15 text-success border-success/30"];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", cls)}>{label}</span>;
}

export function CountUp({ to, prefix = "", suffix = "", decimals = 0 }: { to: number; prefix?: string | undefined; suffix?: string | undefined; decimals?: number | undefined }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: "easeOut", onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{prefix}{v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}</span>;
}

export const btnPrimary = "inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-primary-foreground glow transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50";
export const btnGhost = "inline-flex items-center justify-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold transition hover:border-primary/50 hover:text-primary";
