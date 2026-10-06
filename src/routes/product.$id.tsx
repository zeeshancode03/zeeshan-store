import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Box, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { products as seed } from "@/data/products";
import { useStore } from "@/context/store";
import { Scene3D } from "@/components/three/Scene3D";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const p = seed.find((x) => x.id === params.id);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product not found — Zeeshan Store" }, { name: "robots", content: "noindex" }] };
    const p = loaderData.product;
    return {
      meta: [
        { title: `${p.name} — Zeeshan Store` },
        { name: "description", content: p.description },
        { property: "og:title", content: `${p.name} — Zeeshan Store` },
        { property: "og:description", content: p.description },
        { property: "og:image", content: p.images[0] },
        { name: "twitter:image", content: p.images[0] },
      ],
    };
  },
  notFoundComponent: () => <div className="p-20 text-center">Product not found. <Link to="/shop" className="text-primary">Back to shop</Link></div>,
  component: ProductPage,
});

function ProductPage() {
  const { product: base } = Route.useLoaderData();
  const products = useStore((s) => s.products);
  const p = products.find((x) => x.id === base.id) ?? base;
  const [mode, setMode] = useState<"photo" | "3d">("photo");
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(p.colors[0] ?? "#06b6d4");
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 text-sm text-muted-foreground"><Link to="/" className="hover:text-primary">Home</Link> / <Link to="/shop" search={{ category: p.category }} className="hover:text-primary">{p.category}</Link> / <span className="text-foreground">{p.name}</span></nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-3xl glass">
            {mode === "photo" ? (
              <motion.img key={img} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} src={p.images[img]} alt={p.name} className="h-full w-full object-cover" />
            ) : (
              <Scene3D shape={p.shape} color={color} />
            )}
            <div className="absolute right-4 top-4 flex rounded-xl glass p-1">
              <button onClick={() => setMode("photo")} className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs", mode === "photo" && "bg-primary/20 text-primary")}><ImageIcon className="h-3.5 w-3.5" /> Photos</button>
              <button onClick={() => setMode("3d")} className={cn("flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs", mode === "3d" && "bg-primary/20 text-primary")}><Box className="h-3.5 w-3.5" /> 3D View</button>
            </div>
          </div>
          <div className="mt-4 flex gap-3">{p.images.map((s, i) => (
            <button key={s} onClick={() => { setImg(i); setMode("photo"); }} className={cn("h-20 w-20 overflow-hidden rounded-xl border-2 transition", i === img && mode === "photo" ? "border-primary glow" : "border-transparent opacity-70 hover:opacity-100")}><img src={s} alt="" className="h-full w-full object-cover" /></button>
          ))}</div>
        </div>
        <ProductPurchase p={p} color={color} setColor={setColor} />
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-extrabold">You may also like</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((r, i) => <ProductCard key={r.id} p={r} index={i} />)}</div>
        </section>
      )}
    </div>
  );
}
