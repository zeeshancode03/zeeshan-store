import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CreditCard, MapPin, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useStore, useCartTotals, money } from "@/context/store";
import { btnGhost, btnPrimary } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Zeeshan Store" },
      { name: "description", content: "Securely complete your Zeeshan Store order." },
      { property: "og:title", content: "Checkout — Zeeshan Store" },
      { property: "og:description", content: "Fast, secure multi-step checkout." },
    ],
  }),
  component: Checkout,
});

const steps = [{ label: "Address", icon: MapPin }, { label: "Payment", icon: CreditCard }, { label: "Confirmed", icon: PartyPopper }];
const input = "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

function Checkout() {
  const t = useCartTotals();
  const clearCart = useStore((s) => s.clearCart);
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState({ name: "", email: "", street: "", city: "", zip: "" });
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvc: "" });
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null);

  useEffect(() => {
    if (step !== 2) return;
    const end = Date.now() + 1500;
    const f = () => { confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: ["#06b6d4", "#8b5cf6"] }); confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: ["#06b6d4", "#8b5cf6"] }); if (Date.now() < end) requestAnimationFrame(f); };
    f();
  }, [step]);

  if (t.lines.length === 0 && step < 2) return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-3xl font-extrabold">Your cart is empty</h1><Link to="/shop" className={`${btnPrimary} mt-6`}>Go shopping</Link></div>
  );

  const addrOk = addr.name && /\S+@\S+/.test(addr.email) && addr.street && addr.city && addr.zip;
  const cardOk = card.number.replace(/\s/g, "").length >= 12 && card.name && card.exp && card.cvc.length >= 3;
  const place = () => { setOrder({ id: `ZS-${Math.floor(1000 + Math.random() * 9000)}`, total: t.total }); clearCart(); setStep(2); };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto mb-10 flex max-w-xl items-center">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <motion.div animate={{ scale: i === step ? 1.1 : 1 }} className={cn("grid h-11 w-11 place-items-center rounded-full border-2 transition", i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary text-primary glow" : "text-muted-foreground")}>
                {i < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </motion.div>
              <span className="text-xs">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="mx-2 mb-6 h-0.5 flex-1 overflow-hidden rounded bg-muted"><motion.div animate={{ width: i < step ? "100%" : "0%" }} className="h-full bg-brand" /></div>}
          </div>
        ))}
      </div>

      <div className={cn("grid gap-8", step < 2 && "lg:grid-cols-[1fr_360px]")}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="rounded-3xl glass p-6 md:p-8">
            {step === 0 && (
              <form onSubmit={(e) => { e.preventDefault(); if (addrOk) setStep(1); }} className="space-y-4">
                <h2 className="text-2xl font-bold">Shipping address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={input} placeholder="Full name" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} />
                  <input className={input} placeholder="Email" type="email" value={addr.email} onChange={(e) => setAddr({ ...addr, email: e.target.value })} />
                </div>
                <input className={input} placeholder="Street address" value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={input} placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
                  <input className={input} placeholder="Postal code" value={addr.zip} onChange={(e) => setAddr({ ...addr, zip: e.target.value })} />
                </div>
                <button disabled={!addrOk} className={`${btnPrimary} w-full`}>Continue to payment</button>
              </form>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Payment</h2>
                <motion.div initial={{ rotateY: -30, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} style={{ transformPerspective: 800 }} className="relative aspect-[1.6] max-w-sm overflow-hidden rounded-2xl bg-brand p-6 text-primary-foreground glow">
                  <p className="text-sm font-semibold opacity-80">Zeeshan Pay</p>
                  <p className="mt-10 font-mono text-xl tracking-widest">{(card.number || "•••• •••• •••• ••••").padEnd(19, "•")}</p>
                  <div className="mt-6 flex justify-between text-xs uppercase"><span>{card.name || "Card holder"}</span><span>{card.exp || "MM/YY"}</span></div>
                </motion.div>
                <input className={input} placeholder="Card number" maxLength={19} value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() })} />
                <input className={input} placeholder="Name on card" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <input className={input} placeholder="MM/YY" maxLength={5} value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
                  <input className={input} placeholder="CVC" maxLength={4} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })} />
                </div>
                <p className="text-xs text-muted-foreground">Demo only — no real payment is taken.</p>
                <div className="flex gap-3"><button onClick={() => setStep(0)} className={btnGhost}>Back</button><button disabled={!cardOk} onClick={place} className={`${btnPrimary} flex-1`}>Place order · {money(t.total)}</button></div>
              </div>
            )}
            {step === 2 && order && (
              <div className="py-10 text-center">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand text-primary-foreground glow"><Check className="h-10 w-10" /></motion.div>
                <h2 className="mt-6 text-3xl font-extrabold">Order confirmed!</h2>
                <p className="mt-2 text-muted-foreground">Thanks{addr.name ? `, ${addr.name.split(" ")[0]}` : ""}! Order <span className="text-primary">{order.id}</span> · {money(order.total)}</p>
                <p className="text-sm text-muted-foreground">A confirmation was sent to {addr.email}.</p>
                <Link to="/shop" className={`${btnPrimary} mt-8`}>Continue shopping</Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {step < 2 && (
          <aside className="h-fit space-y-4 rounded-3xl glass p-6">
            <h3 className="font-bold">Order summary</h3>
            {t.lines.map((l) => (
              <div key={l.id} className="flex items-center gap-3 text-sm"><img src={l.product.images[0]} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="flex-1">{l.product.name} × {l.qty}</span><span>{money(l.product.price * l.qty)}</span></div>
            ))}
            <div className="space-y-1 border-t pt-3 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Subtotal</span><span>{money(t.subtotal)}</span></div>
              {t.discount > 0 && <div className="flex justify-between text-success"><span>Discount</span><span>-{money(t.discount)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span>{t.shipping ? money(t.shipping) : "Free"}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{money(t.tax)}</span></div>
              <div className="flex justify-between pt-2 text-base font-bold text-foreground"><span>Total</span><span>{money(t.total)}</span></div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
