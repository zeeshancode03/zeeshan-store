import { Outlet, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUp, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickView } from "@/components/product/QuickView";
import { useStore, useCartTotals } from "@/context/store";

export function SiteShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress, scrollY } = useScroll();
  const setCartOpen = useStore((s) => s.setCartOpen);
  const { count } = useCartTotals();

  useEffect(() => { useStore.persist.rehydrate(); }, []);
  useEffect(() => scrollY.on("change", (v) => setShowTop(v > 600)), [scrollY]);

  return (
    <>
      <motion.div style={{ scaleX: scrollYProgress }} className="fixed left-0 right-0 top-0 z-[60] h-0.5 origin-left bg-brand" />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <motion.main key={isAdmin ? "admin" : pathname} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
          <Outlet />
        </motion.main>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      {!isAdmin && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <AnimatePresence>
            {showTop && (
              <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="grid h-12 w-12 place-items-center rounded-full glass hover:text-primary" aria-label="Back to top"><ArrowUp className="h-5 w-5" /></motion.button>
            )}
          </AnimatePresence>
          <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.9 }} onClick={() => setCartOpen(true)} className="relative grid h-14 w-14 place-items-center rounded-full bg-brand text-primary-foreground glow" aria-label="Open cart">
            <ShoppingBag className="h-6 w-6" />
            {count > 0 && <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-foreground px-1 text-xs font-bold text-background">{count}</span>}
          </motion.button>
        </div>
      )}
      <CartDrawer />
      <QuickView />
      <Toaster theme="dark" position="bottom-left" richColors toastOptions={{ className: "!rounded-xl !border-border !bg-popover/90 !backdrop-blur-xl" }} />
    </>
  );
}
