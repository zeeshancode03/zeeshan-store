import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Tag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useStore, useCartTotals, money } from "@/context/store";
import { btnPrimary } from "@/components/ui-kit";

export function CartDrawer() {
  const { cartOpen, setCartOpen, updateQty, removeFromCart, applyCoupon, coupon } = useStore();
  const t = useCartTotals();
  const [code, setCode] = useState("");

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} />
          <motion.aside initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }} className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l bg-popover/95 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b p-5">
              <h2 className="flex items-center gap-2 text-lg font-bold"><ShoppingBag className="h-5 w-5 text-primary" /> Your Cart <span className="text-sm font-normal text-muted-foreground">({t.count})</span></h2>
              <button onClick={() => setCartOpen(false)} className="rounded-lg p-2 hover:bg-accent" aria-label="Close cart"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {t.lines.length === 0 && (
                <div className="grid h-full place-items-center text-center text-muted-foreground">
                  <div><ShoppingBag className="mx-auto mb-3 h-12 w-12 opacity-40" /><p>Your cart is empty.</p>
                    <Link to="/shop" onClick={() => setCartOpen(false)} className="mt-4 inline-block text-primary">Start shopping →</Link></div>
                </div>
              )}
              <AnimatePresence initial={false}>
                {t.lines.map((l) => (
                  <motion.div key={l.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0 }} className="flex gap-3 rounded-xl glass p-3">
                    <img src={l.product.images[0]} alt={l.product.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2"><span className="text-sm font-semibold">{l.product.name}</span>
                        <button onClick={() => removeFromCart(l.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-4 w-4" /></button></div>
                      <span className="text-xs text-muted-foreground">{[l.color && "Color", l.size].filter(Boolean).join(" · ") || l.product.category}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-lg border">
                          <button onClick={() => updateQty(l.id, l.qty - 1)} className="p-1.5 hover:text-primary" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-8 text-center text-sm">{l.qty}</span>
                          <button onClick={() => updateQty(l.id, l.qty + 1)} className="p-1.5 hover:text-primary" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <span className="font-semibold text-primary">{money(l.product.price * l.qty)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {t.lines.length > 0 && (
              <div className="space-y-3 border-t p-5">
                <form onSubmit={(e) => { e.preventDefault(); if (applyCoupon(code)) { toast.success(`Coupon ${code.toUpperCase()} applied`); setCode(""); } else toast.error("Invalid coupon code"); }} className="flex gap-2">
                  <div className="relative flex-1"><Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Try ZEESHAN10" className="w-full rounded-lg border border-input bg-background/60 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary" /></div>
                  <button className="rounded-lg border border-primary/40 px-4 text-sm font-medium text-primary hover:bg-primary/10">Apply</button>
                </form>
                <div className="space-y-1.5 text-sm">
                  <Row l="Subtotal" v={money(t.subtotal)} />
                  {t.discount > 0 && <Row l={`Discount (${coupon})`} v={`-${money(t.discount)}`} cls="text-success" />}
                  <Row l="Shipping" v={t.shipping ? money(t.shipping) : "Free"} />
                  <Row l="Tax (8%)" v={money(t.tax)} />
                  <div className="flex justify-between border-t pt-2 text-base font-bold"><span>Total</span><motion.span key={t.total} initial={{ scale: 1.15, color: "var(--primary)" }} animate={{ scale: 1, color: "var(--foreground)" }}>{money(t.total)}</motion.span></div>
                </div>
                <Link to="/checkout" onClick={() => setCartOpen(false)} className={`${btnPrimary} w-full`}>Checkout</Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ l, v, cls = "" }: { l: string; v: string; cls?: string }) {
  return <div className={`flex justify-between text-muted-foreground ${cls}`}><span>{l}</span><span>{v}</span></div>;
}
