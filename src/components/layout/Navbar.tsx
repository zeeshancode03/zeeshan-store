import { Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X, LayoutDashboard } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore, useCartTotals, money } from "@/context/store";

export function Navbar() {
  const { products, wishlist, setCartOpen } = useStore();
  const { count } = useCartTotals();
  const [q, setQ] = useState("");
  const [focus, setFocus] = useState(false);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();
  const results = useMemo(() => (q.trim() ? products.filter((p) => (p.name + p.category + p.tags.join(" ")).toLowerCase().includes(q.toLowerCase())).slice(0, 5) : []), [q, products]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/wishlist", label: "Wishlist" },
  ] as const;

  const search = (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setTimeout(() => setFocus(false), 150)}
        onKeyDown={(e) => { if (e.key === "Enter") { navigate({ to: "/shop", search: { q } }); setFocus(false); } }}
        placeholder="Search products…"
        className="w-full rounded-xl border border-input bg-background/60 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      <AnimatePresence>
        {focus && results.length > 0 && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border bg-popover p-1 shadow-2xl">
            {results.map((p) => (
              <li key={p.id}>
                <Link to="/product/$id" params={{ id: p.id }} onClick={() => { setQ(""); setMobile(false); }} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
                  <img src={p.images[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
                  <div className="flex-1 text-sm"><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.category}</div></div>
                  <span className="text-sm font-semibold text-primary">{money(p.price)}</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 glass border-x-0 border-t-0">
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-primary-foreground glow">Z</span>
          <span>Zeeshan<span className="text-gradient">Store</span></span>
        </Link>
        <div className="ml-6 hidden gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: true }} className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground" activeProps={{ className: "text-primary" }}>{l.label}</Link>
          ))}
        </div>
        <div className="mx-auto hidden max-w-md flex-1 md:block">{search}</div>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link to="/admin" className="hidden rounded-lg p-2.5 text-muted-foreground hover:text-primary sm:block" aria-label="Admin"><LayoutDashboard className="h-5 w-5" /></Link>
          <Link to="/wishlist" className="relative rounded-lg p-2.5 hover:text-secondary" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && <Badge n={wishlist.length} cls="bg-secondary text-secondary-foreground" />}
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative rounded-lg p-2.5 hover:text-primary" aria-label="Open cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <Badge n={count} cls="bg-primary text-primary-foreground" />}
          </button>
          <button className="rounded-lg p-2.5 md:hidden" onClick={() => setMobile((m) => !m)} aria-label="Menu">{mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </nav>
      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t md:hidden">
            <div className="space-y-3 p-4">
              {search}
              {[...links, { to: "/admin" as const, label: "Admin" }].map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setMobile(false)} className="block rounded-lg px-3 py-2 hover:bg-accent">{l.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Badge({ n, cls }: { n: number; cls: string }) {
  return (
    <motion.span key={n} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }} className={`absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold ${cls}`}>{n}</motion.span>
  );
}
