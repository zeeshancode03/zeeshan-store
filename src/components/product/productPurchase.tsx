import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useStore, money } from "@/context/store";
import { Stars, StockBadge, btnPrimary } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

/** Shared variant picker + add-to-cart used by the detail page and Quick View. */
export function ProductPurchase({ p, color, setColor }: { p: Product; color: string; setColor: (c: string) => void }) {
  const { addToCart, toggleWishlist, wishlist, setCartOpen } = useStore();
  const [size, setSize] = useState(p.sizes?.[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const fav = wishlist.includes(p.id);

  const add = () => {
    addToCart(p.id, qty, color, size);
    setAdded(true);
    toast.success(`${qty} × ${p.name} added`, { action: { label: "View cart", onClick: () => setCartOpen(true) } });
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-primary">{p.category}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{p.name}</h1>
        <div className="mt-2 flex items-center gap-3"><Stars rating={p.rating} /><span className="text-sm text-muted-foreground">{p.rating} · {p.reviews} reviews</span></div>
      </div>
      <div className="flex items-end gap-3"><span className="text-3xl font-bold text-gradient">{money(p.price)}</span>{p.oldPrice && <span className="text-lg text-muted-foreground line-through">{money(p.oldPrice)}</span>}</div>
      <p className="text-muted-foreground">{p.description}</p>
      <div>
        <p className="mb-2 text-sm font-medium">Color</p>
        <div className="flex gap-2">{p.colors.map((c) => (
          <button key={c} onClick={() => setColor(c)} aria-label={`Color ${c}`} className={cn("h-9 w-9 rounded-full border-2 transition", color === c ? "scale-110 border-primary glow" : "border-border")} style={{ background: c }} />
        ))}</div>
      </div>
      {p.sizes && (
        <div>
          <p className="mb-2 text-sm font-medium">Size</p>
          <div className="flex flex-wrap gap-2">{p.sizes.map((s) => (
            <button key={s} onClick={() => setSize(s)} className={cn("rounded-lg border px-4 py-2 text-sm transition", size === s ? "border-primary bg-primary/10 text-primary" : "hover:border-primary/40")}>{s}</button>
          ))}</div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <StockBadge stock={p.stock} />
        {p.stock > 0 && p.stock < 10 && <span className="text-sm text-warning">Only {p.stock} left — order soon!</span>}
      </div>
      {p.stock > 0 && <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (p.stock / 60) * 100)}%` }} className="h-full bg-brand" /></div>}
      <div className="flex gap-3">
        <div className="flex items-center rounded-xl border">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-3 hover:text-primary" aria-label="Decrease"><Minus className="h-4 w-4" /></button>
          <span className="w-8 text-center">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(p.stock || 1, q + 1))} className="p-3 hover:text-primary" aria-label="Increase"><Plus className="h-4 w-4" /></button>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} disabled={!p.stock} onClick={add} className={`${btnPrimary} flex-1`}>
          <AnimatePresence mode="wait">
            {added ? <motion.span key="a" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2"><Check className="h-4 w-4" /> Added!</motion.span>
              : <motion.span key="b" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="flex items-center gap-2"><ShoppingBag className="h-4 w-4" /> {p.stock ? "Add to Cart" : "Sold Out"}</motion.span>}
          </AnimatePresence>
        </motion.button>
        <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleWishlist(p.id)} className="grid w-12 place-items-center rounded-xl glass" aria-label="Wishlist"><Heart className={cn("h-5 w-5", fav && "fill-secondary text-secondary")} /></motion.button>
      </div>
    </div>
  );
}
