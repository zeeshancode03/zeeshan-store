import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, BarChart3, Clock, DollarSign, Menu, Package, Pencil, Plus, ShoppingCart, Trash2, TrendingUp, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { useStore, money } from "@/context/store";
import { categories, categorySales, orders as seedOrders, salesData, type Category, type Order, type OrderStatus, type Product } from "@/data/products";
import { CountUp, StockBadge, btnGhost, btnPrimary } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Zeeshan Store" },
      { name: "description", content: "Manage products, orders and customers and track store analytics." },
      { property: "og:title", content: "Admin Dashboard — Zeeshan Store" },
      { property: "og:description", content: "Revenue analytics, product and order management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Tab = "overview" | "products" | "orders";
const statusCls: Record<OrderStatus, string> = {
  Pending: "bg-warning/15 text-warning", Processing: "bg-primary/15 text-primary", Shipped: "bg-secondary/15 text-secondary",
  Delivered: "bg-success/15 text-success", Cancelled: "bg-destructive/15 text-destructive",
};
const pieColors = ["var(--primary)", "var(--secondary)", "var(--success)", "var(--warning)", "var(--destructive)"];
const tooltip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 } };

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const [side, setSide] = useState(false);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const nav = [{ id: "overview", label: "Overview", icon: BarChart3 }, { id: "products", label: "Products", icon: Package }, { id: "orders", label: "Orders & Customers", icon: ShoppingCart }] as const;

  return (
    <div className="flex min-h-screen">
      <aside className={cn("fixed inset-y-0 left-0 z-40 w-64 border-r bg-popover/90 p-5 backdrop-blur-xl transition-transform lg:translate-x-0", side ? "translate-x-0" : "-translate-x-full")}>
        <div className="mb-8 flex items-center justify-between"><span className="text-lg font-extrabold">Zeeshan<span className="text-gradient">Admin</span></span><button className="lg:hidden" onClick={() => setSide(false)} aria-label="Close menu"><X className="h-5 w-5" /></button></div>
        <nav className="space-y-1">
          {nav.map((n) => (
            <button key={n.id} onClick={() => { setTab(n.id); setSide(false); }} className={cn("relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition", tab === n.id ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
              {tab === n.id && <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/30" />}
              <n.icon className="relative h-4 w-4" /><span className="relative">{n.label}</span>
            </button>
          ))}
        </nav>
        <Link to="/" className="absolute bottom-5 left-5 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to store</Link>
      </aside>
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 glass border-x-0 border-t-0 px-4 md:px-8">
          <button className="lg:hidden" onClick={() => setSide(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <h1 className="text-lg font-bold">{nav.find((n) => n.id === tab)?.label}</h1>
          <div className="ml-auto flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:block">Zeeshan Ahmed</span><span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-primary-foreground">ZA</span></div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="p-4 md:p-8">
            {tab === "overview" && <Overview orders={orders} />}
            {tab === "products" && <Products />}
            {tab === "orders" && <Orders orders={orders} setOrders={setOrders} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Overview({ orders }: { orders: Order[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const kpis = [
    { label: "Total Revenue", value: 528000, prefix: "$", icon: DollarSign, delta: "+12.4%" },
    { label: "Customers", value: 12840, icon: Users, delta: "+8.1%" },
    { label: "Pending Orders", value: orders.filter((o) => o.status === "Pending").length, icon: Clock, delta: "Needs action" },
    { label: "Conversion Rate", value: 3.6, suffix: "%", decimals: 1, icon: TrendingUp, delta: "+0.4pt" },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="relative overflow-hidden rounded-2xl glass p-5">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-brand opacity-20 blur-2xl" />
            <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{k.label}</span><k.icon className="h-5 w-5 text-primary" /></div>
            <p className="mt-3 text-3xl font-extrabold"><CountUp to={k.value} prefix={k.prefix} suffix={k.suffix} decimals={k.decimals} /></p>
            <p className="mt-1 text-xs text-success">{k.delta}</p>
          </motion.div>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl glass p-5 xl:col-span-2">
          <h3 className="mb-4 font-semibold">Monthly Sales Revenue</h3>
          <div className="h-72">{ready && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip {...tooltip} formatter={(v) => money(Number(v))} />
                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          )}</div>
        </div>
        <div className="rounded-2xl glass p-5">
          <h3 className="mb-4 font-semibold">Top Selling Categories</h3>
          <div className="h-56">{ready && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={categorySales} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={4}>{categorySales.map((c, i) => <Cell key={c.name} fill={pieColors[i] ?? "var(--primary)"} stroke="none" />)}</Pie><Tooltip {...tooltip} formatter={(v) => `${v}%`} /></PieChart>
            </ResponsiveContainer>
          )}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">{categorySales.map((c, i) => <span key={c.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i] }} />{c.name} · {c.value}%</span>)}</div>
        </div>
      </div>
      <div className="rounded-2xl glass p-5">
        <h3 className="mb-4 font-semibold">Orders per month</h3>
        <div className="h-56">{ready && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} /><YAxis stroke="var(--muted-foreground)" fontSize={12} /><Tooltip {...tooltip} cursor={{ fill: "var(--accent)" }} /><Bar dataKey="orders" fill="var(--secondary)" radius={[6, 6, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        )}</div>
      </div>
    </div>
  );
}

const blank: Product = { id: "", name: "", price: 0, category: "Audio", tags: [], rating: 4.5, reviews: 0, stock: 0, colors: ["#0f172a"], images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=70"], description: "", shape: "box" };
const field = "w-full rounded-lg border border-input bg-background/60 px-3 py-2 text-sm outline-none focus:border-primary";

function Products() {
  const { products, upsertProduct, deleteProduct } = useStore();
  const [edit, setEdit] = useState<Product | null>(null);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit?.name) return;
    const isNew = !edit.id;
    upsertProduct({ ...edit, id: edit.id || `p${Date.now()}` });
    toast.success(isNew ? "Product added" : "Product updated");
    setEdit(null);
  };
  return (
    <div className="rounded-2xl glass">
      <div className="flex items-center justify-between border-b p-5"><h3 className="font-semibold">{products.length} products</h3><button onClick={() => setEdit({ ...blank })} className={btnPrimary}><Plus className="h-4 w-4" /> Add product</button></div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody>
            <AnimatePresence initial={false}>
              {products.map((p) => (
                <motion.tr key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} className="border-t transition hover:bg-accent/40">
                  <td className="p-4"><div className="flex items-center gap-3"><img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" /><span className="font-medium">{p.name}</span></div></td>
                  <td className="text-muted-foreground">{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>{p.stock}</td>
                  <td><StockBadge stock={p.stock} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => setEdit(p)} className="rounded-lg p-2 hover:bg-primary/10 hover:text-primary" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => { deleteProduct(p.id); toast.success(`${p.name} deleted`); }} className="rounded-lg p-2 hover:bg-destructive/10 hover:text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {edit && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEdit(null)}>
            <motion.form onSubmit={save} onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="w-full max-w-lg space-y-4 rounded-2xl border bg-popover p-6">
              <h3 className="text-lg font-bold">{edit.id ? "Edit product" : "Add product"}</h3>
              <input className={field} placeholder="Name" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required />
              <div className="grid grid-cols-3 gap-3">
                <label className="text-xs text-muted-foreground">Price<input type="number" min={0} className={field} value={edit.price} onChange={(e) => setEdit({ ...edit, price: +e.target.value })} /></label>
                <label className="text-xs text-muted-foreground">Stock<input type="number" min={0} className={field} value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: +e.target.value })} /></label>
                <label className="text-xs text-muted-foreground">Category<select className={field} value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value as Category })}>{categories.map((c) => <option key={c}>{c}</option>)}</select></label>
              </div>
              <input className={field} placeholder="Image URL" value={edit.images[0]} onChange={(e) => setEdit({ ...edit, images: [e.target.value, ...edit.images.slice(1)] })} />
              <textarea className={field} rows={3} placeholder="Description" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setEdit(null)} className={btnGhost}>Cancel</button><button className={btnPrimary}>Save</button></div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Orders({ orders, setOrders }: { orders: Order[]; setOrders: (o: Order[]) => void }) {
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const list = filter === "All" ? orders : orders.filter((o) => o.status === filter);
  const setStatus = (id: string, status: OrderStatus) => { setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o))); toast.success(`${id} marked ${status}`); };
  const customers = Array.from(new Map(orders.map((o) => [o.email, o])).values());
  return (
    <div className="space-y-6">
      <div className="rounded-2xl glass">
        <div className="flex flex-wrap items-center gap-2 border-b p-5">
          <h3 className="mr-auto font-semibold">Recent orders</h3>
          {(["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={cn("rounded-full px-3 py-1 text-xs transition", filter === s ? "bg-brand text-primary-foreground" : "border hover:border-primary/40")}>{s}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground"><tr><th className="p-4">Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th className="p-4 text-right">Quick actions</th></tr></thead>
            <tbody>{list.map((o) => (
              <tr key={o.id} className="border-t hover:bg-accent/40">
                <td className="p-4 font-mono text-primary">{o.id}</td>
                <td><p className="font-medium">{o.customer}</p><p className="text-xs text-muted-foreground">{o.email}</p></td>
                <td className="text-muted-foreground">{o.date}</td><td>{o.items}</td><td className="font-semibold">{money(o.total)}</td>
                <td><select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className={cn("rounded-full border-0 px-3 py-1 text-xs font-medium outline-none", statusCls[o.status])}>{Object.keys(statusCls).map((s) => <option key={s} className="bg-popover text-foreground">{s}</option>)}</select></td>
                <td className="space-x-1 p-4 text-right">
                  {o.status === "Pending" && <button onClick={() => setStatus(o.id, "Processing")} className="rounded-lg border px-2.5 py-1 text-xs hover:border-primary hover:text-primary">Approve</button>}
                  {o.status === "Processing" && <button onClick={() => setStatus(o.id, "Shipped")} className="rounded-lg border px-2.5 py-1 text-xs hover:border-secondary hover:text-secondary">Ship</button>}
                  {!["Cancelled", "Delivered"].includes(o.status) && <button onClick={() => setStatus(o.id, "Cancelled")} className="rounded-lg border px-2.5 py-1 text-xs hover:border-destructive hover:text-destructive">Cancel</button>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <div className="rounded-2xl glass p-5">
        <h3 className="mb-4 font-semibold">Recent customers</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{customers.map((c) => {
          const spent = orders.filter((o) => o.email === c.email).reduce((a, o) => a + o.total, 0);
          return (
            <div key={c.email} className="flex items-center gap-3 rounded-xl border p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground">{c.customer.split(" ").map((w) => w[0]).join("")}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{c.customer}</p><p className="text-xs text-muted-foreground">{money(spent)} spent</p></div>
            </div>
          );
        })}</div>
      </div>
    </div>
  );
}
