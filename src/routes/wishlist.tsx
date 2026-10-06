import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useStore } from "@/context/store";
import { ProductCard } from "@/components/product/ProductCard";
import { btnPrimary } from "@/components/ui-kit";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your Wishlist — Zeeshan Store" },
      { name: "description", content: "Products you've saved for later at Zeeshan Store." },
      { property: "og:title", content: "Your Wishlist — Zeeshan Store" },
      { property: "og:description", content: "Your saved favourites, ready when you are." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist, products } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">Wishlist <span className="text-gradient">({items.length})</span></h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl glass p-16 text-center">
          <Heart className="mx-auto h-12 w-12 text-secondary" />
          <p className="mt-4 text-muted-foreground">Tap the heart on any product to save it here.</p>
          <Link to="/shop" className={`${btnPrimary} mt-6`}>Explore products</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"><AnimatePresence mode="popLayout">{items.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}</AnimatePresence></div>
      )}
    </div>
  );
}
