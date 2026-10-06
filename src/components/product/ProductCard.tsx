import { motion } from "framer-motion";
import { Eye, Heart, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useStore, money } from "@/context/store";
import { Stars, StockBadge } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export function ProductCard({ p, list = false, index = 0 }: { p: Product; list?: boolean; index?: number }) {
  const { wishlist, toggleWishlist, addToCart, setQuickView } = useStore();
  const fav = wishlist.includes(p.id);
  const add = () => { addToCart(p.id, 1, p.colors[0], p.sizes?.[0]); toast.success(`${p.name} added to cart`); };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -6 }}
      className={cn("group relative overflow-hidden rounded-2xl glass transition-shadow hover:border-primary/40 hover:glow", list && "flex")}
    >
      <div className={cn("relative overflow-hidden", list ? "w-40 shrink-0 sm:w-56" : "aspect-square")}>
        <Link to="/product/$id" params={{ id: p.id }}>
          <img src={p.images[0]} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        </Link>
        {p.oldPrice && <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-secondary-foreground">-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
        <motion.button whileTap={{ scale: 0.8 }} onClick={() => { toggleWishlist(p.id); toast(fav ? "Removed from wishlist" : "Added to wishlist"); }} aria-label="Toggle wishlist" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full glass">
          <Heart className={cn("h-4 w-4 transition", fav && "fill-secondary text-secondary")} />
        </motion.button>
        {!list && (
          <div className="absolute inset-x-3 bottom-3 flex translate-y-4 gap-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
            <button onClick={() => setQuickView(p.id)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg glass py-2 text-xs font-semibold hover:text-primary"><Eye className="h-3.5 w-3.5" /> Quick View</button>
            <button disabled={!p.stock} onClick={add} className="grid w-10 place-items-center rounded-lg bg-brand text-primary-foreground disabled:opacity-40" aria-label="Add to cart"><ShoppingBag className="h-4 w-4" /></button>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{p.category}</span><StockBadge stock={p.stock} /></div>
        <Link to="/product/$id" params={{ id: p.id }} className="font-semibold leading-snug hover:text-primary">{p.name}</Link>
        <div className="flex items-center gap-2"><Stars rating={p.rating} /><span className="text-xs text-muted-foreground">({p.reviews})</span></div>
        {list && <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
        <div className="mt-auto flex items-end justify-between">
          <div><span className="text-lg font-bold text-primary">{money(p.price)}</span>{p.oldPrice && <span className="ml-2 text-sm text-muted-foreground line-through">{money(p.oldPrice)}</span>}</div>
          {list && (
            <div className="flex gap-2">
              <button onClick={() => setQuickView(p.id)} className="rounded-lg glass p-2 hover:text-primary" aria-label="Quick view"><Eye className="h-4 w-4" /></button>
              <button disabled={!p.stock} onClick={add} className="rounded-lg bg-brand p-2 text-primary-foreground disabled:opacity-40" aria-label="Add to cart"><ShoppingBag className="h-4 w-4" /></button>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
