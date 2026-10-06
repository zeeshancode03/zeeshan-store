import { lazy, Suspense, useEffect, useState } from "react";
import type { Product } from "@/data/products";

const ProductScene = lazy(() => import("./ProductScene"));

/** Client-only 3D viewer; three.js never loads during SSR. */
export function Scene3D(props: { shape?: Product["shape"]; color?: string; controls?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fallback = <div className="h-full w-full animate-pulse rounded-2xl bg-muted/40" />;
  if (!mounted) return fallback;
  return (
    <Suspense fallback={fallback}>
      <ProductScene {...props} />
    </Suspense>
  );
}
