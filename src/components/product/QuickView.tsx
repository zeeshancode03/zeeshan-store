import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useStore } from "@/context/store";
import { ProductPurchase } from "./ProductPurchase";

export function QuickView() {
  const { quickView, setQuickView, products } = useStore();
  const p = products.find((x) => x.id === quickView);
  const [color, setColor] = useState("");
  const [img, setImg] = useState(0);
  useEffect(() => { if (p) { setColor(p.colors[0] ?? ""); setImg(0); } }, [p]);

  return (
    <AnimatePresence>
      {p && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuickView(null)}>
          <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} onClick={(e) => e.stopPropagation()} className="relative grid max-h-[90vh] w-full max-w-4xl gap-6 overflow-y-auto rounded-3xl border bg-popover p-6 md:grid-cols-2">
            <button onClick={() => setQuickView(null)} className="absolute right-4 top-4 z-10 rounded-full glass p-2" aria-label="Close"><X className="h-4 w-4" /></button>
            <div>
              <motion.img key={img} initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={p.images[img]} alt={p.name} className="aspect-square w-full rounded-2xl object-cover" />
              <div className="mt-3 flex gap-2">{p.images.map((s, i) => <button key={s} onClick={() => setImg(i)} className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${i === img ? "border-primary" : "border-transparent"}`}><img src={s} alt="" className="h-full w-full object-cover" /></button>)}</div>
            </div>
            <div>
              <ProductPurchase p={p} color={color} setColor={setColor} />
              <Link to="/product/$id" params={{ id: p.id }} onClick={() => setQuickView(null)} className="mt-4 inline-block text-sm text-primary">View full details & 3D preview →</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
