import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Scene3D } from "@/components/three/Scene3D";
import { ProductCard } from "@/components/product/ProductCard";
import { useStore, money } from "@/context/store";
import { btnGhost, btnPrimary } from "@/components/ui-kit";
import { categories } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zeeshan Store — Futuristic Tech & Gear" },
      { name: "description", content: "Discover premium headphones, smartwatches, gaming and camera gear with interactive 3D previews." },
      { property: "og:title", content: "Zeeshan Store — Futuristic Tech & Gear" },
      { property: "og:description", content: "Premium tech with interactive 3D previews and exclusive deals." },
    ],
  }),
  component: Home,
});

function TiltCard() {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), { stiffness: 150, damping: 15 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 });
  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left) / r.width - 0.5); y.set((e.clientY - r.top) / r.height - 0.5); }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className="relative aspect-square w-full max-w-lg rounded-[2rem] glass glow"
    >
      <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,color-mix(in_oklab,var(--primary)_25%,transparent),transparent_60%)]" />
      <Scene3D shape="knot" color="#8b5cf6" />
      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl glass px-4 py-3">
        <div><p className="text-xs text-muted-foreground">Drag to rotate</p><p className="font-semibold">Flux Keyboard Core</p></div>
        <span className="text-lg font-bold text-primary">$199</span>
      </div>
    </motion.div>
  );
}

function DealsSlider() {
  const products = useStore((s) => s.products);
  const deals = products.filter((p) => p.oldPrice);
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % Math.max(1, deals.length)), 4500); return () => clearInterval(t); }, [deals.length]);
  const d = deals[i];
  if (!d) return null;
  return (
    <section className="mx-auto max-w-7xl px-4">
      <div className="relative overflow-hidden rounded-3xl glass">
        <AnimatePresence mode="wait">
          <motion.div key={d.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.45 }} className="grid items-center gap-6 p-6 md:grid-cols-2 md:p-10">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary"><Zap className="h-3 w-3" /> Featured deal · Save {Math.round((1 - d.price / d.oldPrice!) * 100)}%</span>
              <h3 className="mt-4 text-3xl font-extrabold md:text-4xl">{d.name}</h3>
              <p className="mt-3 text-muted-foreground">{d.description}</p>
              <div className="mt-5 flex items-center gap-3"><span className="text-3xl font-bold text-gradient">{money(d.price)}</span><span className="text-muted-foreground line-through">{money(d.oldPrice!)}</span></div>
              <Link to="/product/$id" params={{ id: d.id }} className={`${btnPrimary} mt-6`}>Grab the deal <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <img src={d.images[0]} alt={d.name} className="aspect-[4/3] w-full rounded-2xl object-cover" />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-5 left-6 flex gap-2 md:left-10">
          {deals.map((x, k) => <button key={x.id} onClick={() => setI(k)} aria-label={`Deal ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === i ? "w-8 bg-primary" : "w-3 bg-muted-foreground/40"}`} />)}
        </div>
        <div className="absolute bottom-4 right-6 flex gap-2">
          <button onClick={() => setI((i - 1 + deals.length) % deals.length)} className="rounded-full glass p-2" aria-label="Previous"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => setI((i + 1) % deals.length)} className="rounded-full glass p-2" aria-label="Next"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const products = useStore((s) => s.products);
  const featured = products.filter((p) => p.tags.includes("bestseller") || p.tags.includes("new")).slice(0, 8);
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-primary"><Sparkles className="h-3.5 w-3.5" /> New season drop · Up to 30% off</span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">Tech that feels like <span className="text-gradient">the future.</span></h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">Premium audio, wearables and creator gear — explore every product in interactive 3D before it lands at your door.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className={btnPrimary}>Shop now <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/shop" search={{ tag: "sale" }} className={btnGhost}>View deals</Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            {[["50K+", "Happy customers"], ["4.8★", "Average rating"], ["48h", "Express delivery"]].map(([a, b]) => <div key={b}><p className="text-2xl font-bold">{a}</p><p className="text-muted-foreground">{b}</p></div>)}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex justify-center"><TiltCard /></motion.div>
      </section>

      <DealsSlider />

      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {categories.map((c, i) => (
            <motion.div key={c} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to="/shop" search={{ category: c }} className="block rounded-2xl glass p-5 text-center font-semibold transition hover:border-primary/50 hover:text-primary hover:glow">{c}</Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="text-sm text-primary">Curated for you</p><h2 className="text-3xl font-extrabold">Trending now</h2></div>
          <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">View all →</Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{featured.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl gap-4 px-4 md:grid-cols-3">
        {[[Truck, "Free shipping", "On orders over $200"], [ShieldCheck, "2-year warranty", "On every device"], [Zap, "Instant support", "24/7 live experts"]].map(([Icon, t, d], i) => {
          const I = Icon as typeof Truck;
          return (
            <motion.div key={t as string} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 rounded-2xl glass p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand text-primary-foreground"><I className="h-5 w-5" /></span>
              <div><p className="font-semibold">{t as string}</p><p className="text-sm text-muted-foreground">{d as string}</p></div>
            </motion.div>
          );
        })}
      </section>
    </>
  );
}
