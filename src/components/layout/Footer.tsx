import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div><p className="text-lg font-extrabold">Zeeshan<span className="text-gradient">Store</span></p><p className="mt-2 text-sm text-muted-foreground">Future-grade tech, delivered with style.</p></div>
        <div className="space-y-2 text-sm"><p className="font-semibold">Shop</p><Link to="/shop" className="block text-muted-foreground hover:text-primary">All products</Link><Link to="/wishlist" className="block text-muted-foreground hover:text-primary">Wishlist</Link></div>
        <div className="space-y-2 text-sm"><p className="font-semibold">Company</p><Link to="/admin" className="block text-muted-foreground hover:text-primary">Admin portal</Link></div>
        <div className="text-sm text-muted-foreground"><p className="font-semibold text-foreground">Coupons</p><p className="mt-2">Use <span className="text-primary">ZEESHAN10</span> or <span className="text-secondary">NEON20</span> at checkout.</p></div>
      </div>
      <p className="border-t py-6 text-center text-xs text-muted-foreground">© 2026 Zeeshan Store. All rights reserved.</p>
    </footer>
  );
}
