"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, getAdminAuthHeaders, getAdminToken } from "@/lib/adminAuth";
import { CmsPost, getCmsApiBaseUrl } from "@/lib/cms";

interface Vendor {
  id: string;
  name: string;
  status: "pending" | "approved" | "suspended";
  rating: number;
  orders: number;
  revenue: number;
  growthPct: number;
}

interface OrderRecord {
  id: string;
  vendorId: string;
  amount: number;
  status: "completed" | "processing" | "refunded" | "flagged";
  fraudScore: number;
  createdAt: string;
}

interface ProductRecord {
  id: string;
  name: string;
  vendorId: string;
  category: "Electronics" | "Fashion" | "Home" | "Health";
  stock: number;
  unitsSold: number;
  revenue: number;
  flagged: boolean;
}

interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
}

interface RevenuePoint {
  month: string;
  revenue: number;
  vendors: number;
  orders: number;
}

interface SearchResult {
  type: string;
  label: string;
  href?: string;
}

const REVENUE_SERIES: RevenuePoint[] = [
  { month: "Jan", revenue: 112000, vendors: 48, orders: 920 },
  { month: "Feb", revenue: 129400, vendors: 53, orders: 1010 },
  { month: "Mar", revenue: 141800, vendors: 57, orders: 1088 },
  { month: "Apr", revenue: 156200, vendors: 63, orders: 1165 },
  { month: "May", revenue: 164900, vendors: 70, orders: 1224 },
  { month: "Jun", revenue: 181300, vendors: 74, orders: 1320 },
];

const INITIAL_VENDORS: Vendor[] = [
  { id: "v-001", name: "Northstar Supply", status: "approved", rating: 4.8, orders: 315, revenue: 84200, growthPct: 14.2 },
  { id: "v-002", name: "Urban Lane", status: "approved", rating: 4.2, orders: 241, revenue: 56300, growthPct: 7.8 },
  { id: "v-003", name: "Studio Botanica", status: "pending", rating: 0, orders: 0, revenue: 0, growthPct: 0 },
  { id: "v-004", name: "Pulse Forge", status: "approved", rating: 3.4, orders: 118, revenue: 23900, growthPct: -4.1 },
  { id: "v-005", name: "Bright Nest", status: "suspended", rating: 2.8, orders: 62, revenue: 9100, growthPct: -18.7 },
  { id: "v-006", name: "Circuit Cove", status: "approved", rating: 4.6, orders: 189, revenue: 42800, growthPct: 9.9 },
];

const INITIAL_ORDERS: OrderRecord[] = [
  { id: "o-1001", vendorId: "v-001", amount: 649, status: "completed", fraudScore: 12, createdAt: "2026-03-05T08:20:00.000Z" },
  { id: "o-1002", vendorId: "v-004", amount: 1289, status: "flagged", fraudScore: 91, createdAt: "2026-03-05T09:10:00.000Z" },
  { id: "o-1003", vendorId: "v-002", amount: 214, status: "processing", fraudScore: 22, createdAt: "2026-03-05T09:28:00.000Z" },
  { id: "o-1004", vendorId: "v-006", amount: 480, status: "completed", fraudScore: 15, createdAt: "2026-03-05T09:46:00.000Z" },
  { id: "o-1005", vendorId: "v-005", amount: 92, status: "refunded", fraudScore: 66, createdAt: "2026-03-05T10:05:00.000Z" },
  { id: "o-1006", vendorId: "v-001", amount: 740, status: "completed", fraudScore: 9, createdAt: "2026-03-05T10:42:00.000Z" },
];

const INITIAL_PRODUCTS: ProductRecord[] = [
  { id: "p-001", name: "Aurora Noise-Cancel Headphones", vendorId: "v-001", category: "Electronics", stock: 42, unitsSold: 870, revenue: 226200, flagged: false },
  { id: "p-002", name: "Monarch Linen Shirt", vendorId: "v-002", category: "Fashion", stock: 18, unitsSold: 530, revenue: 70490, flagged: false },
  { id: "p-003", name: "Cedar Air Diffuser", vendorId: "v-003", category: "Home", stock: 4, unitsSold: 101, revenue: 8080, flagged: false },
  { id: "p-004", name: "Pulse Fitness Band", vendorId: "v-006", category: "Health", stock: 0, unitsSold: 745, revenue: 111750, flagged: true },
  { id: "p-005", name: "Nova Smart Lamp", vendorId: "v-004", category: "Home", stock: 7, unitsSold: 364, revenue: 47320, flagged: false },
  { id: "p-006", name: "Helix Ceramic Bottle", vendorId: "v-005", category: "Health", stock: 61, unitsSold: 88, revenue: 3960, flagged: false },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);
}

function exportRowsToCsv(filename: string, headers: string[], rows: string[][]) {
  const body = [headers.join(","), ...rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(","))].join("\n");
  const blob = new Blob([body], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [posts, setPosts] = useState<CmsPost[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);
  const [orders] = useState<OrderRecord[]>(INITIAL_ORDERS);
  const [products, setProducts] = useState<ProductRecord[]>(INITIAL_PRODUCTS);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>([]);

  const [globalSearch, setGlobalSearch] = useState("");
  const [showShortcuts, setShowShortcuts] = useState(false);

  const [tableQuery, setTableQuery] = useState("");
  const [tableCategory, setTableCategory] = useState<"all" | ProductRecord["category"]>("all");
  const [tableStock, setTableStock] = useState<"all" | "low" | "out" | "healthy">("all");
  const [tableSort, setTableSort] = useState<"name" | "unitsSold" | "revenue" | "stock">("revenue");
  const [tableSortDirection, setTableSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  const [autoApproveMinRating, setAutoApproveMinRating] = useState(4.2);
  const [autoApproveMinRevenue, setAutoApproveMinRevenue] = useState(15000);
  const [reportsFrequency, setReportsFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [reportsEmail, setReportsEmail] = useState("ops@gngglobal.com.au");
  const [notifications, setNotifications] = useState({ email: true, inApp: true, sms: false });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = getCmsApiBaseUrl();

  function addActivity(message: string) {
    setActivityLog((current) => [{ id: `${Date.now()}`, message, timestamp: new Date().toISOString() }, ...current].slice(0, 20));
  }

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }

    async function load() {
      try {
        const response = await fetch(`${apiBase}/api/admin/posts`, {
          headers: {
            ...getAdminAuthHeaders(),
          },
        });

        if (response.status === 401) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load posts");
        }

        const data = (await response.json()) as { posts: CmsPost[] };
        setPosts(data.posts);
        addActivity(`Loaded dashboard data (${data.posts.length} content items)`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [apiBase, router]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const isTypingContext = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
        if (!isTypingContext) {
          event.preventDefault();
          searchInputRef.current?.focus();
        }
      }

      if (event.key.toLowerCase() === "n" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        const target = event.target as HTMLElement | null;
        const isTypingContext = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
        if (!isTypingContext) {
          router.push("/admin/posts/new");
        }
      }

      if (event.key === "?") {
        event.preventDefault();
        setShowShortcuts((value) => !value);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const topSellingProducts = useMemo(
    () => [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5),
    [products]
  );

  const totalRevenue = useMemo(
    () => products.reduce((sum, product) => sum + product.revenue, 0),
    [products]
  );

  const orderAnalytics = useMemo(() => {
    const completed = orders.filter((order) => order.status === "completed").length;
    const processing = orders.filter((order) => order.status === "processing").length;
    const refunded = orders.filter((order) => order.status === "refunded").length;
    const flagged = orders.filter((order) => order.status === "flagged").length;
    return { completed, processing, refunded, flagged, total: orders.length };
  }, [orders]);

  const fraudAlerts = useMemo(
    () => orders.filter((order) => order.fraudScore >= 80),
    [orders]
  );

  const vendorPerformanceAlerts = useMemo(
    () => vendors.filter((vendor) => vendor.status === "approved" && (vendor.rating > 0 && vendor.rating < 3.8 || vendor.growthPct < -5)),
    [vendors]
  );

  const inventoryAlerts = useMemo(
    () => products.filter((product) => product.stock <= 8),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = tableQuery.trim().toLowerCase();
    const rows = products.filter((product) => {
      const matchesQuery = !query || product.name.toLowerCase().includes(query);
      const matchesCategory = tableCategory === "all" || product.category === tableCategory;
      const matchesStock =
        tableStock === "all" ||
        (tableStock === "low" && product.stock > 0 && product.stock <= 8) ||
        (tableStock === "out" && product.stock === 0) ||
        (tableStock === "healthy" && product.stock > 8);

      return matchesQuery && matchesCategory && matchesStock;
    });

    rows.sort((left, right) => {
      const direction = tableSortDirection === "asc" ? 1 : -1;

      if (tableSort === "name") {
        return left.name.localeCompare(right.name) * direction;
      }

      return (left[tableSort] - right[tableSort]) * direction;
    });

    return rows;
  }, [products, tableCategory, tableQuery, tableSort, tableSortDirection, tableStock]);

  const quickSearchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return [] as SearchResult[];

    const productMatches: SearchResult[] = products
      .filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((item) => ({ type: "Product", label: item.name }));

    const vendorMatches: SearchResult[] = vendors
      .filter((item) => item.name.toLowerCase().includes(q))
      .slice(0, 4)
      .map((item) => ({ type: "Vendor", label: item.name }));

    const orderMatches: SearchResult[] = orders
      .filter((item) => item.id.toLowerCase().includes(q))
      .slice(0, 4)
      .map((item) => ({ type: "Order", label: `${item.id} • ${formatCurrency(item.amount)}` }));

    const contentMatches: SearchResult[] = posts
      .filter((item) => item.title.toLowerCase().includes(q))
      .slice(0, 4)
      .map((item) => ({ type: "Content", label: item.title, href: `/admin/posts/edit/${item._id}` }));

    return [...productMatches, ...vendorMatches, ...orderMatches, ...contentMatches].slice(0, 10);
  }, [globalSearch, orders, posts, products, vendors]);

  const approvalPreview = useMemo(
    () => vendors.filter((vendor) => vendor.status === "pending" && vendor.rating >= autoApproveMinRating && vendor.revenue >= autoApproveMinRevenue),
    [autoApproveMinRating, autoApproveMinRevenue, vendors]
  );

  async function onDelete(id: string) {
    if (!confirm("Delete this post?")) return;

    const response = await fetch(`${apiBase}/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: {
        ...getAdminAuthHeaders(),
      },
    });

    if (response.ok) {
      setPosts((prev) => prev.filter((post) => post._id !== id));
      addActivity(`Deleted content item ${id}`);
    }
  }

  function toggleAllRows(checked: boolean) {
    setSelectedProductIds(checked ? filteredProducts.map((row) => row.id) : []);
  }

  function toggleRow(id: string, checked: boolean) {
    setSelectedProductIds((current) => {
      if (checked) return [...new Set([...current, id])];
      return current.filter((item) => item !== id);
    });
  }

  function applyBulkAction(action: "feature" | "archive" | "flag") {
    if (selectedProductIds.length === 0) return;

    setProducts((current) =>
      current.map((product) => {
        if (!selectedProductIds.includes(product.id)) return product;
        if (action === "feature") return { ...product, flagged: false };
        if (action === "flag") return { ...product, flagged: true };
        return { ...product, stock: 0 };
      })
    );

    addActivity(`Bulk action '${action}' applied to ${selectedProductIds.length} product(s)`);
    setSelectedProductIds([]);
  }

  function exportFilteredProducts() {
    const rows = filteredProducts.map((product) => {
      const vendor = vendors.find((item) => item.id === product.vendorId);
      return [
        product.id,
        product.name,
        product.category,
        vendor?.name || "Unknown",
        String(product.stock),
        String(product.unitsSold),
        String(product.revenue),
      ];
    });

    exportRowsToCsv(
      `products-${new Date().toISOString().slice(0, 10)}.csv`,
      ["id", "name", "category", "vendor", "stock", "units_sold", "revenue"],
      rows
    );

    addActivity(`Exported ${rows.length} products to CSV`);
  }

  function saveReportSchedule() {
    window.localStorage.setItem(
      "admin_report_schedule",
      JSON.stringify({ frequency: reportsFrequency, email: reportsEmail, updatedAt: new Date().toISOString() })
    );
    addActivity(`Scheduled ${reportsFrequency} report to ${reportsEmail}`);
  }

  function sendBroadcast() {
    addActivity(
      `Notification sent via ${[
        notifications.email ? "email" : null,
        notifications.inApp ? "in-app" : null,
        notifications.sms ? "sms" : null,
      ].filter(Boolean).join(", ") || "none"}`
    );
  }

  function approvePreviewVendors() {
    if (approvalPreview.length === 0) return;

    setVendors((current) =>
      current.map((vendor) =>
        approvalPreview.some((candidate) => candidate.id === vendor.id)
          ? { ...vendor, status: "approved" }
          : vendor
      )
    );
    addActivity(`Auto-approved ${approvalPreview.length} pending vendor(s)`);
  }

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Marketplace Admin Command Center</h1>
            <p className="text-sm text-charcoal-600 mt-1">Revenue, vendor performance, order health, and operations automation in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/messages" className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Messages</Link>
            <Link href="/admin/subscribers" className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Subscribers</Link>
            <Link href="/admin/posts/new" className="rounded-md bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 font-semibold">Add New Post</Link>
            <button
              onClick={() => {
                clearAdminToken();
                router.push("/admin/login");
              }}
              className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700"
            >
              Logout
            </button>
          </div>
        </div>

        <section className="rounded-xl border border-ivory-300 bg-white p-5">
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={searchInputRef}
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Global search vendors, orders, products, content... (Press /)"
              className="flex-1 min-w-72 rounded-md border border-charcoal-300 px-3 py-2"
            />
            <button
              type="button"
              onClick={() => setShowShortcuts((value) => !value)}
              className="rounded-md border border-charcoal-300 px-3 py-2 text-sm"
            >
              Keyboard Shortcuts (?)
            </button>
            <button
              type="button"
              onClick={() => {
                router.push("/admin/posts/new");
              }}
              className="rounded-md bg-navy-700 px-3 py-2 text-sm font-semibold text-white"
            >
              Quick Action: New Listing
            </button>
          </div>

          {quickSearchResults.length > 0 && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {quickSearchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.label}-${index}`}
                  type="button"
                  onClick={() => {
                    if (result.href) {
                      router.push(result.href);
                    }
                  }}
                  className="rounded-md border border-ivory-300 bg-ivory-50 px-3 py-2 text-left"
                >
                  <p className="text-xs uppercase tracking-wide text-charcoal-500">{result.type}</p>
                  <p className="text-sm font-semibold text-navy-800">{result.label}</p>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">Revenue (YTD)</p>
            <p className="mt-2 text-2xl font-bold text-navy-800">{formatCurrency(totalRevenue)}</p>
            <p className="mt-1 text-xs text-emerald-700">+12.4% vs previous period</p>
          </div>
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">Active Vendors</p>
            <p className="mt-2 text-2xl font-bold text-navy-800">{vendors.filter((vendor) => vendor.status === "approved").length}</p>
            <p className="mt-1 text-xs text-charcoal-600">{vendors.filter((vendor) => vendor.status === "pending").length} pending approvals</p>
          </div>
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">Order Throughput</p>
            <p className="mt-2 text-2xl font-bold text-navy-800">{orderAnalytics.total}</p>
            <p className="mt-1 text-xs text-charcoal-600">{orderAnalytics.processing} in processing queue</p>
          </div>
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-charcoal-500">Fraud Exposure</p>
            <p className="mt-2 text-2xl font-bold text-navy-800">{fraudAlerts.length}</p>
            <p className="mt-1 text-xs text-destructive">High-risk orders need review</p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border border-ivory-300 bg-white p-5 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy-800">Revenue Chart</h2>
              <p className="text-xs text-charcoal-500">Last 6 months</p>
            </div>
            <div className="grid grid-cols-6 items-end gap-3 h-56">
              {REVENUE_SERIES.map((point) => {
                const maxRevenue = Math.max(...REVENUE_SERIES.map((entry) => entry.revenue));
                const ratio = Math.max(point.revenue / maxRevenue, 0.08);
                return (
                  <div key={point.month} className="flex flex-col items-center gap-2">
                    <div className="w-full rounded-md bg-gradient-to-t from-navy-700 to-cyan-500" style={{ height: `${Math.round(ratio * 180)}px` }} />
                    <span className="text-xs text-charcoal-600">{point.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h2 className="text-lg font-bold text-navy-800 mb-4">Order Analytics</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span>Completed</span><strong>{orderAnalytics.completed}</strong></div>
              <div className="flex items-center justify-between"><span>Processing</span><strong>{orderAnalytics.processing}</strong></div>
              <div className="flex items-center justify-between"><span>Refunded</span><strong>{orderAnalytics.refunded}</strong></div>
              <div className="flex items-center justify-between"><span>Flagged</span><strong className="text-destructive">{orderAnalytics.flagged}</strong></div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h2 className="text-lg font-bold text-navy-800 mb-4">Vendor Growth</h2>
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="rounded-md border border-ivory-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-navy-800">{vendor.name}</p>
                      <p className="text-xs text-charcoal-600">Rating {vendor.rating || 0} • {vendor.orders} orders</p>
                    </div>
                    <span className={`text-sm font-semibold ${vendor.growthPct >= 0 ? "text-emerald-700" : "text-destructive"}`}>
                      {vendor.growthPct >= 0 ? "+" : ""}{vendor.growthPct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h2 className="text-lg font-bold text-navy-800 mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {topSellingProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between rounded-md border border-ivory-200 p-3">
                  <div>
                    <p className="font-semibold text-navy-800">#{index + 1} {product.name}</p>
                    <p className="text-xs text-charcoal-600">{product.unitsSold} sold • {product.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-700">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-ivory-300 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-navy-800">Data Management: Product Operations</h2>
            <button onClick={exportFilteredProducts} className="rounded-md border border-charcoal-300 px-3 py-2 text-sm">Export CSV</button>
          </div>

          <div className="grid gap-3 md:grid-cols-5 mb-4">
            <input
              value={tableQuery}
              onChange={(event) => setTableQuery(event.target.value)}
              placeholder="Filter by product name"
              className="rounded-md border border-charcoal-300 px-3 py-2 md:col-span-2"
            />
            <select value={tableCategory} onChange={(event) => setTableCategory(event.target.value as "all" | ProductRecord["category"])} className="rounded-md border border-charcoal-300 px-3 py-2">
              <option value="all">All categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Home">Home</option>
              <option value="Health">Health</option>
            </select>
            <select value={tableStock} onChange={(event) => setTableStock(event.target.value as "all" | "low" | "out" | "healthy")} className="rounded-md border border-charcoal-300 px-3 py-2">
              <option value="all">All stock levels</option>
              <option value="healthy">Healthy stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
            <div className="flex gap-2">
              <select value={tableSort} onChange={(event) => setTableSort(event.target.value as "name" | "unitsSold" | "revenue" | "stock")} className="rounded-md border border-charcoal-300 px-3 py-2 w-full">
                <option value="revenue">Sort: Revenue</option>
                <option value="unitsSold">Sort: Units Sold</option>
                <option value="stock">Sort: Stock</option>
                <option value="name">Sort: Name</option>
              </select>
              <button
                type="button"
                onClick={() => setTableSortDirection((current) => (current === "asc" ? "desc" : "asc"))}
                className="rounded-md border border-charcoal-300 px-3 py-2 text-sm"
              >
                {tableSortDirection.toUpperCase()}
              </button>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button onClick={() => applyBulkAction("feature")} className="rounded-md border border-charcoal-300 px-3 py-1.5 text-sm">Bulk Feature</button>
            <button onClick={() => applyBulkAction("flag")} className="rounded-md border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm">Bulk Flag</button>
            <button onClick={() => applyBulkAction("archive")} className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-1.5 text-sm">Bulk Archive</button>
            <span className="text-xs text-charcoal-500">{selectedProductIds.length} selected</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-ivory-300">
            <table className="w-full text-sm">
              <thead className="bg-ivory-100">
                <tr>
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                      onChange={(event) => toggleAllRows(event.target.checked)}
                    />
                  </th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Units Sold</th>
                  <th className="p-3 text-left">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-t border-ivory-200">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={(event) => toggleRow(product.id, event.target.checked)}
                      />
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-navy-800">{product.name}</p>
                      {product.flagged && <p className="text-xs text-amber-700">Flagged for review</p>}
                    </td>
                    <td className="p-3">{product.category}</td>
                    <td className={`p-3 ${product.stock === 0 ? "text-destructive" : product.stock <= 8 ? "text-amber-700" : "text-emerald-700"}`}>
                      {product.stock}
                    </td>
                    <td className="p-3">{product.unitsSold}</td>
                    <td className="p-3">{formatCurrency(product.revenue)}</td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-charcoal-500">No products match the current filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5">
            <h3 className="font-bold text-destructive mb-3">Fraud Alerts</h3>
            <div className="space-y-2 text-sm">
              {fraudAlerts.length === 0 ? <p>No critical fraud signals.</p> : fraudAlerts.map((order) => (
                <div key={order.id} className="rounded-md border border-destructive/20 bg-white p-2">
                  <p className="font-semibold">Order {order.id}</p>
                  <p>Risk score {order.fraudScore} • {formatCurrency(order.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-300/40 bg-amber-50 p-5">
            <h3 className="font-bold text-amber-800 mb-3">Vendor Performance Alerts</h3>
            <div className="space-y-2 text-sm">
              {vendorPerformanceAlerts.length === 0 ? <p>No vendor performance risks.</p> : vendorPerformanceAlerts.map((vendor) => (
                <div key={vendor.id} className="rounded-md border border-amber-300/40 bg-white p-2">
                  <p className="font-semibold">{vendor.name}</p>
                  <p>Rating {vendor.rating} • Growth {vendor.growthPct}%</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-cyan-300/40 bg-cyan-50 p-5">
            <h3 className="font-bold text-cyan-900 mb-3">Inventory Alerts</h3>
            <div className="space-y-2 text-sm">
              {inventoryAlerts.length === 0 ? <p>No stock alerts.</p> : inventoryAlerts.map((product) => (
                <div key={product.id} className="rounded-md border border-cyan-300/40 bg-white p-2">
                  <p className="font-semibold">{product.name}</p>
                  <p>{product.stock === 0 ? "Out of stock" : `Low stock: ${product.stock} left`}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-800 mb-3">Automated Vendor Approval Rules</h3>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="block mb-1">Minimum rating</span>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={autoApproveMinRating}
                  onChange={(event) => setAutoApproveMinRating(Number(event.target.value))}
                  className="w-full rounded-md border border-charcoal-300 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="block mb-1">Minimum projected revenue</span>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={autoApproveMinRevenue}
                  onChange={(event) => setAutoApproveMinRevenue(Number(event.target.value))}
                  className="w-full rounded-md border border-charcoal-300 px-3 py-2"
                />
              </label>
              <p className="text-xs text-charcoal-600">{approvalPreview.length} pending vendors currently match these rules.</p>
              <button onClick={approvePreviewVendors} className="rounded-md bg-navy-700 px-3 py-2 text-white font-semibold">Run Approval Automation</button>
            </div>
          </div>

          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-800 mb-3">Scheduled Reports</h3>
            <div className="space-y-3 text-sm">
              <select value={reportsFrequency} onChange={(event) => setReportsFrequency(event.target.value as "daily" | "weekly" | "monthly")} className="w-full rounded-md border border-charcoal-300 px-3 py-2">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <input
                type="email"
                value={reportsEmail}
                onChange={(event) => setReportsEmail(event.target.value)}
                className="w-full rounded-md border border-charcoal-300 px-3 py-2"
                placeholder="ops@gngglobal.com.au"
              />
              <button onClick={saveReportSchedule} className="rounded-md bg-navy-700 px-3 py-2 text-white font-semibold">Save Report Schedule</button>
            </div>
          </div>

          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-800 mb-3">Notification System</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={notifications.email} onChange={(event) => setNotifications((current) => ({ ...current, email: event.target.checked }))} /> Email alerts</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={notifications.inApp} onChange={(event) => setNotifications((current) => ({ ...current, inApp: event.target.checked }))} /> In-app alerts</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={notifications.sms} onChange={(event) => setNotifications((current) => ({ ...current, sms: event.target.checked }))} /> SMS escalation</label>
              <button onClick={sendBroadcast} className="mt-2 rounded-md bg-navy-700 px-3 py-2 text-white font-semibold">Send Test Notification</button>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-800 mb-3">Activity Logs</h3>
            <div className="max-h-72 space-y-2 overflow-auto pr-2 text-sm">
              {activityLog.length === 0 ? <p className="text-charcoal-500">No activity yet in this session.</p> : activityLog.map((entry) => (
                <div key={entry.id} className="rounded-md border border-ivory-200 p-2">
                  <p className="text-navy-800">{entry.message}</p>
                  <p className="text-xs text-charcoal-500">{new Date(entry.timestamp).toLocaleString("en-AU")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-ivory-300 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-800 mb-3">Quick Actions</h3>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <button onClick={() => router.push("/admin/posts/new")} className="rounded-md border border-charcoal-300 px-3 py-2 text-left">Create product/news listing</button>
              <button onClick={() => router.push("/admin/messages")} className="rounded-md border border-charcoal-300 px-3 py-2 text-left">Review support queue</button>
              <button onClick={exportFilteredProducts} className="rounded-md border border-charcoal-300 px-3 py-2 text-left">Export current product view</button>
              <button onClick={saveReportSchedule} className="rounded-md border border-charcoal-300 px-3 py-2 text-left">Trigger scheduled report setup</button>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-lg bg-white p-6 border border-ivory-300">Loading posts...</div>
        ) : error ? (
          <div className="rounded-lg bg-destructive/5 border border-destructive/20 text-destructive p-6">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-ivory-300 bg-white">
            <div className="border-b border-ivory-200 bg-ivory-100 p-3 text-sm font-semibold text-navy-800">Content Operations</div>
            <table className="w-full text-sm">
              <thead className="bg-ivory-100">
                <tr>
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Updated</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  return (
                  <tr key={post._id} className="border-t border-ivory-200">
                    <td className="p-4">{post.title}</td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${post.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="p-4">{new Date(post.updatedAt).toLocaleDateString("en-AU")}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/posts/edit/${post._id}`} className="rounded-md border border-charcoal-300 px-3 py-1.5">Edit</Link>
                      <button onClick={() => onDelete(post._id)} className="rounded-md bg-destructive text-white px-3 py-1.5">Delete</button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        )}

        {showShortcuts && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-6">
            <div className="w-full max-w-md rounded-xl border border-ivory-300 bg-white p-5">
              <h3 className="text-lg font-bold text-navy-800 mb-3">Keyboard Shortcuts</h3>
              <ul className="space-y-2 text-sm text-charcoal-700">
                <li><strong>/</strong> Focus global search</li>
                <li><strong>n</strong> New listing/content</li>
                <li><strong>?</strong> Toggle shortcuts panel</li>
              </ul>
              <button onClick={() => setShowShortcuts(false)} className="mt-4 rounded-md border border-charcoal-300 px-3 py-2">Close</button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
