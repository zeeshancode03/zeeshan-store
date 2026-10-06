import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useStore } from "@/context/store";
import { allTags, categories } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ q: z.string().optional(), category: z.string().optional(), tag: z.string().optional() });

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Shop All Products — Zeeshan Store" },
      { name: "description", content: "Browse and filter headphones, wearables, gaming gear, cameras and accessories." },
      { property: "og:title", content: "Shop All Products — Zeeshan Store" },
      { property: "og:description", content: "Filter by category, price and tags to find your next favourite gadget." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const products = useStore((s) => s.products);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [maxPrice, setMaxPrice] = useState(1500);
  const [tags, setTags] = useState<string[]>(search.tag ? [search.tag] : []);
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const cat = search.category ?? "All";

  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 500); return () => clearTimeout(t); }, [cat]);

  const list = useMemo(() => {
    let r = products.filter((p) => (cat === "All" || p.category === cat) && p.price <= maxPrice && tags.every((t) => p.tags.includes(t)) && (!search.q || p.name.toLowerCase().includes(search.q.toLowerCase())));
    if (sort === "low") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "high") r = [...r].sort((a, b) => b.price - a.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [products, cat, maxPrice, tags, sort, search.q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">{search.q ? <>Results for “<span className="text-gradient">{search.q}</span>”</> : "All Products"}</h1>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => navigate({ search: (s) => ({ ...s, category: c === "All" ? undefined : c }) })} className={cn("relative shrink-0 rounded-full px-4 py-2 text-sm transition", cat === c ? "text-primary-foreground" : "glass text-muted-foreground hover:text-foreground")}>
            {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-brand" />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit space-y-6 rounded-2xl glass p-5 lg:sticky lg:top-24">
          <p className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="h-4 w-4 text-primary" /> Filters</p>
          <div>
            <div className="mb-2 flex justify-between text-sm"><span>Max price</span><span className="text-primary">${maxPrice}</span></div>
            <input type="range" min={50} max={1500} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <p className="mb-2 text-sm">Tags</p>
            <div className="flex flex-wrap gap-2">{allTags.map((t) => (
              <button key={t} onClick={() => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))} className={cn("rounded-full border px-3 py-1 text-xs capitalize transition", tags.includes(t) ? "border-secondary bg-secondary/15 text-secondary" : "hover:border-primary/40")}>#{t}</button>
            ))}</div>
          </div>
          <button onClick={() => { setTags([]); setMaxPrice(1500); navigate({ search: {} }); }} className="text-sm text-muted-foreground hover:text-primary">Reset filters</button>
        </aside>
        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{list.length} products</p>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="featured">Featured</option><option value="low">Price: Low → High</option><option value="high">Price: High → Low</option><option value="rating">Top rated</option>
              </select>
              <div className="flex rounded-lg glass p-1">
                <button onClick={() => setView("grid")} className={cn("rounded-md p-1.5", view === "grid" && "bg-primary/20 text-primary")} aria-label="Grid view"><Grid3X3 className="h-4 w-4" /></button>
                <button onClick={() => setView("list")} className={cn("rounded-md p-1.5", view === "list" && "bg-primary/20 text-primary")} aria-label="List view"><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="space-y-3"><Skeleton className="aspect-square" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/3" /></div>)}</div>
          ) : list.length === 0 ? (
            <p className="rounded-2xl glass p-10 text-center text-muted-foreground">No products match these filters.</p>
          ) : (
            <motion.div layout className={cn("grid gap-5", view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              <AnimatePresence mode="popLayout">{list.map((p, i) => <ProductCard key={p.id} p={p} list={view === "list"} index={i} />)}</AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
