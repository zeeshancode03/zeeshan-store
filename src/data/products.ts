// Mock data layer. Replace the functions in src/lib/api.ts with real REST/GraphQL calls later.
export type Category = "Audio" | "Wearables" | "Gaming" | "Cameras" | "Accessories";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category: Category;
  tags: string[];
  rating: number;
  reviews: number;
  stock: number;
  colors: string[]; // css color names for swatches
  sizes?: string[];
  images: string[];
  description: string;
  shape: "torus" | "box" | "sphere" | "knot" | "cone";
}

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=70`;

export const products: Product[] = [
  { id: "p1", name: "Aether Pro Headphones", price: 349, oldPrice: 429, category: "Audio", tags: ["new", "wireless", "bestseller"], rating: 4.8, reviews: 1204, stock: 24, colors: ["#0f172a", "#06b6d4", "#e2e8f0"], images: [img("photo-1505740420928-5e560c06d30e"), img("photo-1583394838336-acd977736f90"), img("photo-1546435770-a3e426bf472b")], description: "Adaptive noise cancelling, spatial audio and 40-hour battery wrapped in aerospace aluminium.", shape: "torus" },
  { id: "p2", name: "Nova Smartwatch X", price: 279, category: "Wearables", tags: ["new", "fitness"], rating: 4.6, reviews: 842, stock: 6, colors: ["#020617", "#8b5cf6"], sizes: ["40mm", "44mm"], images: [img("photo-1523275335684-37898b6baf30"), img("photo-1544117519-31a4b719223d"), img("photo-1508685096489-7aacd43bd3b1")], description: "Sapphire display, ECG, and always-on neon watch faces.", shape: "sphere" },
  { id: "p3", name: "Pulse Wireless Controller", price: 89, oldPrice: 109, category: "Gaming", tags: ["wireless", "sale"], rating: 4.5, reviews: 2310, stock: 58, colors: ["#e2e8f0", "#0f172a"], images: [img("photo-1606144042614-b2417e99c4e3"), img("photo-1592840496694-26d035b52b48")], description: "Haptic triggers, hall-effect sticks, 30 hours of play.", shape: "box" },
  { id: "p4", name: "Lumen Mirrorless Cam", price: 1299, category: "Cameras", tags: ["pro", "bestseller"], rating: 4.9, reviews: 311, stock: 3, colors: ["#020617"], images: [img("photo-1516035069371-29a1b244cc32"), img("photo-1502920917128-1aa500764cbd")], description: "Full-frame 45MP sensor with 8K RAW and in-body stabilisation.", shape: "box" },
  { id: "p5", name: "Orbit Earbuds", price: 159, category: "Audio", tags: ["wireless", "sale"], rating: 4.4, reviews: 1980, stock: 0, colors: ["#e2e8f0", "#0f172a"], images: [img("photo-1590658268037-6bf12165a8df"), img("photo-1606220588913-b3aacb4d2f46")], description: "Pocket-sized with studio tuning and wireless charging case.", shape: "sphere" },
  { id: "p6", name: "Flux Mechanical Keyboard", price: 199, category: "Accessories", tags: ["pro", "new"], rating: 4.7, reviews: 640, stock: 17, colors: ["#0f172a", "#8b5cf6"], sizes: ["65%", "75%", "Full"], images: [img("photo-1587829741301-dc798b83add3"), img("photo-1618384887929-16ec33fab9ef")], description: "Hot-swap switches, gasket mount and per-key RGB.", shape: "knot" },
  { id: "p7", name: "Vector VR Headset", price: 499, oldPrice: 599, category: "Gaming", tags: ["pro", "sale"], rating: 4.6, reviews: 521, stock: 9, colors: ["#e2e8f0"], images: [img("photo-1622979135225-d2ba269cf1ac"), img("photo-1593508512255-86ab42a8e620")], description: "4K per eye, pancake lenses and full color passthrough.", shape: "cone" },
  { id: "p8", name: "Halo Fitness Band", price: 99, category: "Wearables", tags: ["fitness", "bestseller"], rating: 4.3, reviews: 3120, stock: 44, colors: ["#06b6d4", "#0f172a", "#8b5cf6"], sizes: ["S", "M", "L"], images: [img("photo-1575311373937-040b8e1fd5b6"), img("photo-1557438159-51eec7a6c9e8")], description: "Sleep, stress and recovery tracking in a featherweight band.", shape: "torus" },
  { id: "p9", name: "Prism Action Camera", price: 379, category: "Cameras", tags: ["new", "wireless"], rating: 4.5, reviews: 402, stock: 12, colors: ["#020617"], images: [img("photo-1526170375885-4d8ecf77b99f"), img("photo-1495707902641-75cac588d2e9")], description: "5.3K60 video, waterproof to 10m, horizon lock.", shape: "box" },
  { id: "p10", name: "Glide Wireless Mouse", price: 69, category: "Accessories", tags: ["wireless"], rating: 4.2, reviews: 1500, stock: 4, colors: ["#0f172a", "#e2e8f0"], images: [img("photo-1527864550417-7fd91fc51a46"), img("photo-1615663245857-ac93bb7c39e7")], description: "8K polling, 55g ultralight shell, 90-hour battery.", shape: "sphere" },
  { id: "p11", name: "Sonic Studio Speaker", price: 229, category: "Audio", tags: ["pro"], rating: 4.7, reviews: 760, stock: 21, colors: ["#0f172a"], images: [img("photo-1608043152269-423dbba4e7e1"), img("photo-1545454675-3531b543be5d")], description: "360° room-filling sound with adaptive EQ.", shape: "cone" },
  { id: "p12", name: "Arc Gaming Headset", price: 149, oldPrice: 179, category: "Gaming", tags: ["sale", "wireless"], rating: 4.4, reviews: 980, stock: 33, colors: ["#8b5cf6", "#0f172a"], images: [img("photo-1599669454699-248893623440"), img("photo-1618366712010-f4ae9c647dcb")], description: "Low-latency 2.4GHz, detachable boom mic, memory foam.", shape: "torus" },
];

export const categories: Category[] = ["Audio", "Wearables", "Gaming", "Cameras", "Accessories"];
export const allTags = Array.from(new Set(products.flatMap((p) => p.tags)));

export const coupons: Record<string, number> = { ZEESHAN10: 0.1, NEON20: 0.2 };

export const salesData = [
  { month: "Jan", revenue: 42000, orders: 320 }, { month: "Feb", revenue: 38000, orders: 290 },
  { month: "Mar", revenue: 51000, orders: 410 }, { month: "Apr", revenue: 47000, orders: 380 },
  { month: "May", revenue: 62000, orders: 470 }, { month: "Jun", revenue: 58000, orders: 440 },
  { month: "Jul", revenue: 71000, orders: 530 }, { month: "Aug", revenue: 76000, orders: 590 },
  { month: "Sep", revenue: 83000, orders: 640 },
];
export const categorySales = [
  { name: "Audio", value: 34 }, { name: "Gaming", value: 26 }, { name: "Wearables", value: 18 },
  { name: "Cameras", value: 14 }, { name: "Accessories", value: 8 },
];

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export interface Order { id: string; customer: string; email: string; total: number; date: string; status: OrderStatus; items: number }
export const orders: Order[] = [
  { id: "ZS-1042", customer: "Ayesha Khan", email: "ayesha@mail.com", total: 628, date: "2026-09-27", status: "Pending", items: 3 },
  { id: "ZS-1041", customer: "Omar Farooq", email: "omar@mail.com", total: 1299, date: "2026-09-27", status: "Processing", items: 1 },
  { id: "ZS-1040", customer: "Sara Malik", email: "sara@mail.com", total: 248, date: "2026-09-26", status: "Shipped", items: 2 },
  { id: "ZS-1039", customer: "Bilal Ahmed", email: "bilal@mail.com", total: 89, date: "2026-09-26", status: "Delivered", items: 1 },
  { id: "ZS-1038", customer: "Hina Raza", email: "hina@mail.com", total: 518, date: "2026-09-25", status: "Pending", items: 4 },
  { id: "ZS-1037", customer: "Usman Tariq", email: "usman@mail.com", total: 159, date: "2026-09-25", status: "Cancelled", items: 1 },
  { id: "ZS-1036", customer: "Zara Iqbal", email: "zara@mail.com", total: 379, date: "2026-09-24", status: "Delivered", items: 1 },
];
