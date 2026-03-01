"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, getAdminAuthHeaders, getAdminToken } from "@/lib/adminAuth";
import { getCmsApiBaseUrl, NewsletterSubscriber } from "@/lib/cms";

const ROW_DENSITY_STORAGE_KEY = "admin-subscribers-row-density";
const PAGE_SIZE_STORAGE_KEY = "admin-subscribers-page-size";
const STATUS_FILTER_STORAGE_KEY = "admin-subscribers-status-filter";
const SEARCH_QUERY_STORAGE_KEY = "admin-subscribers-search-query";

interface SubscribersApiResponse {
  subscribers: NewsletterSubscriber[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

function formatRelativeDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  const now = Date.now();
  const diffMs = now - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) return "";

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

function triggerTemporaryFlag(setter: (value: boolean) => void, durationMs = 1500) {
  setter(true);
  window.setTimeout(() => setter(false), durationMs);
}

export default function AdminSubscribersPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "unsubscribed">("all");
  const [rowDensity, setRowDensity] = useState<"comfortable" | "compact">("comfortable");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [refreshKey, setRefreshKey] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedPageEmails, setCopiedPageEmails] = useState(false);
  const [copiedPageEmailsLines, setCopiedPageEmailsLines] = useState(false);
  const [copiedPageCount, setCopiedPageCount] = useState(0);
  const [copiedPageLinesCount, setCopiedPageLinesCount] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [showResetMessage, setShowResetMessage] = useState(false);
  const [showExportMessage, setShowExportMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = useMemo(() => getCmsApiBaseUrl(), []);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }

    const controller = new AbortController();
    let isActive = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        query.set("status", statusFilter);
        query.set("page", String(page));
        query.set("limit", String(pageSize));
        if (searchQuery) {
          query.set("q", searchQuery);
        }

        const response = await fetch(`${apiBase}/api/admin/newsletter?${query.toString()}`, {
          headers: {
            ...getAdminAuthHeaders(),
          },
          signal: controller.signal,
        });

        if (!isActive) {
          return;
        }

        if (response.status === 401) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load subscribers");
        }

        const data = (await response.json()) as SubscribersApiResponse;
        setSubscribers(data.subscribers);
        setTotal(data.pagination.total);
        setTotalPages(Math.max(data.pagination.totalPages, 1));
        setLastUpdatedAt(new Date().toISOString());
        setError(null);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }

        if (!isActive) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Failed to load subscribers");
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [apiBase, page, pageSize, refreshKey, router, searchQuery, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, pageSize, searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const storedDensity = window.localStorage.getItem(ROW_DENSITY_STORAGE_KEY);
    if (storedDensity === "compact" || storedDensity === "comfortable") {
      setRowDensity(storedDensity);
    }

    const storedPageSize = Number(window.localStorage.getItem(PAGE_SIZE_STORAGE_KEY));
    if ([25, 50, 100].includes(storedPageSize)) {
      setPageSize(storedPageSize);
    }

    const storedStatusFilter = window.localStorage.getItem(STATUS_FILTER_STORAGE_KEY);
    if (storedStatusFilter === "all" || storedStatusFilter === "active" || storedStatusFilter === "unsubscribed") {
      setStatusFilter(storedStatusFilter);
    }

    const storedSearchQuery = window.localStorage.getItem(SEARCH_QUERY_STORAGE_KEY) || "";
    setSearchInput(storedSearchQuery);
    setSearchQuery(storedSearchQuery);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(ROW_DENSITY_STORAGE_KEY, rowDensity);
  }, [rowDensity]);

  useEffect(() => {
    window.localStorage.setItem(PAGE_SIZE_STORAGE_KEY, String(pageSize));
  }, [pageSize]);

  useEffect(() => {
    window.localStorage.setItem(STATUS_FILTER_STORAGE_KEY, statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    window.localStorage.setItem(SEARCH_QUERY_STORAGE_KEY, searchInput);
  }, [searchInput]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      const isTypingContext =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        Boolean(target?.isContentEditable);

      if (isTypingContext) {
        return;
      }

      if (event.key.toLowerCase() === "r" && !loading) {
        event.preventDefault();
        setRefreshKey((current) => current + 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loading]);

  const exportQuery = new URLSearchParams();
  exportQuery.set("status", statusFilter);
  if (searchQuery) {
    exportQuery.set("q", searchQuery);
  }
  const exportUrl = `${apiBase}/api/admin/newsletter/export.csv?${exportQuery.toString()}`;
  const isSearchPending = searchInput.trim() !== searchQuery;
  const pageWindowStart = Math.max(page - 2, 1);
  const pageWindowEnd = Math.min(page + 2, totalPages);
  const cellPaddingClass = rowDensity === "compact" ? "p-2" : "p-4";
  const actionCellPaddingClass = rowDensity === "compact" ? "p-2 text-right" : "p-4 text-right";
  const pageNumbers: number[] = [];
  for (let pageNumber = pageWindowStart; pageNumber <= pageWindowEnd; pageNumber += 1) {
    pageNumbers.push(pageNumber);
  }

  async function copyEmail(email: string) {
    try {
      await copyTextToClipboard(email);

      setCopiedEmail(email);
      setError(null);
      setTimeout(() => setCopiedEmail((current) => (current === email ? null : current)), 1500);
    } catch {
      setError("Failed to copy email");
    }
  }

  async function copyCurrentPageEmails() {
    try {
      const emails = subscribers.map((subscriber) => subscriber.email).filter(Boolean);
      if (emails.length === 0) return;

      const payload = emails.join(", ");
      await copyTextToClipboard(payload);

      setCopiedPageCount(emails.length);
      triggerTemporaryFlag(setCopiedPageEmails);
      setError(null);
    } catch {
      setError("Failed to copy page emails");
    }
  }

  async function copyCurrentPageEmailsLines() {
    try {
      const emails = subscribers.map((subscriber) => subscriber.email).filter(Boolean);
      if (emails.length === 0) return;

      const payload = emails.join("\n");
      await copyTextToClipboard(payload);

      setCopiedPageLinesCount(emails.length);
      triggerTemporaryFlag(setCopiedPageEmailsLines);
      setError(null);
    } catch {
      setError("Failed to copy page emails (lines)");
    }
  }

  function resetViewPreferences() {
    window.localStorage.removeItem(ROW_DENSITY_STORAGE_KEY);
    window.localStorage.removeItem(PAGE_SIZE_STORAGE_KEY);
    window.localStorage.removeItem(STATUS_FILTER_STORAGE_KEY);
    window.localStorage.removeItem(SEARCH_QUERY_STORAGE_KEY);

    setRowDensity("comfortable");
    setPageSize(25);
    setStatusFilter("all");
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
    setRefreshKey((current) => current + 1);
    setError(null);
    triggerTemporaryFlag(setShowResetMessage);
  }

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Newsletter Subscribers</h1>
            <p className="text-sm text-charcoal-600 mt-1">Manage and export newsletter signups.</p>
          </div>
          <div className="flex w-full sm:w-auto flex-wrap items-center justify-start gap-2 sm:gap-3">
            <Link href="/admin/dashboard" className="w-full sm:w-auto text-center rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Back to Dashboard</Link>
            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              disabled={loading}
              title={loading ? "Loading subscribers" : "Refresh subscribers (R)"}
              className="w-full sm:w-auto rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700 disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={copyCurrentPageEmails}
              disabled={loading || subscribers.length === 0}
              title={loading ? "Loading subscribers" : subscribers.length === 0 ? "No subscribers to copy" : "Copy emails on this page"}
              className="w-full sm:w-auto rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700 disabled:opacity-50"
            >
              {copiedPageEmails ? `Copied ${copiedPageCount} emails` : "Copy page emails"}
            </button>
            <button
              type="button"
              onClick={copyCurrentPageEmailsLines}
              disabled={loading || subscribers.length === 0}
              title={loading ? "Loading subscribers" : subscribers.length === 0 ? "No subscribers to copy" : "Copy emails on this page (one per line)"}
              className="w-full sm:w-auto rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700 disabled:opacity-50"
            >
              {copiedPageEmailsLines ? `Copied ${copiedPageLinesCount} lines` : "Copy page emails (lines)"}
            </button>
            <a
              href={exportUrl}
              className="w-full sm:w-auto text-center rounded-md bg-navy-700 hover:bg-navy-800 text-white px-4 py-2 font-semibold"
              onClick={(event) => {
                event.preventDefault();

                if (!getAdminToken()) {
                  router.replace("/admin/login");
                  return;
                }

                const token = getAdminToken();
                fetch(exportUrl, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                  .then(async (response) => {
                    if (response.status === 401) {
                      clearAdminToken();
                      router.replace("/admin/login");
                      return;
                    }

                    if (!response.ok) {
                      throw new Error("Export failed");
                    }
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `newsletter-subscribers-${Date.now()}.csv`;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    URL.revokeObjectURL(url);
                    setError(null);
                    triggerTemporaryFlag(setShowExportMessage);
                  })
                  .catch(() => {
                    setError("Failed to export CSV");
                  });
              }}
            >
              Export CSV
            </a>
            {showExportMessage && (
              <span className="text-xs text-charcoal-500">CSV exported</span>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <div>
              <label className="text-sm font-medium mr-2">Status:</label>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | "active" | "unsubscribed")}
                className="rounded-md border border-charcoal-300 px-3 py-2"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mr-2">Per page:</label>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="rounded-md border border-charcoal-300 px-3 py-2"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mr-2">Density:</label>
              <select
                value={rowDensity}
                onChange={(event) => setRowDensity(event.target.value as "comfortable" | "compact")}
                className="rounded-md border border-charcoal-300 px-3 py-2"
              >
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </div>
            <button
              type="button"
              onClick={resetViewPreferences}
              className="rounded-md border border-charcoal-300 px-3 py-2 text-charcoal-700"
              title="Clear saved view settings"
            >
              Reset view
            </button>
            {showResetMessage && (
              <span className="text-xs text-charcoal-500">View reset to defaults</span>
            )}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" htmlFor="subscriber-search">Email:</label>
              <input
                id="subscriber-search"
                type="text"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search email"
                className="rounded-md border border-charcoal-300 px-3 py-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchQuery("");
                  }}
                  className="rounded-md border border-charcoal-300 px-3 py-2 text-charcoal-700"
                >
                  Clear
                </button>
              )}
              {isSearchPending && (
                <span className="text-xs text-charcoal-500">Searching...</span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-charcoal-600">Total: {total}</p>
            <p className="text-xs text-charcoal-500">
              Last updated: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleString("en-AU") : "—"}
            </p>
            <p className="hidden sm:block text-xs text-charcoal-500">Tip: Press R to refresh</p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-lg border border-ivory-300 bg-white p-6">Loading subscribers...</div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-destructive flex items-center justify-between gap-3 flex-wrap">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setRefreshKey((current) => current + 1)}
              className="rounded-md border border-destructive/30 bg-white/70 px-3 py-1.5 text-sm text-destructive"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[70vh] rounded-lg border border-ivory-300 bg-white">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-ivory-100">
                <tr>
                  <th className={`text-left ${cellPaddingClass}`}>Email</th>
                  <th className={`text-left ${cellPaddingClass}`}>Status</th>
                  <th className={`text-left ${cellPaddingClass}`}>Consent</th>
                  <th className={`text-left ${cellPaddingClass}`}>Source</th>
                  <th className={`text-left ${cellPaddingClass}`}>Subscribed</th>
                  <th className={actionCellPaddingClass}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="border-t border-ivory-200 odd:bg-ivory-100/40 hover:bg-ivory-100/70 transition-colors">
                    <td className={cellPaddingClass}>{subscriber.email}</td>
                    <td className={cellPaddingClass}>{subscriber.status}</td>
                    <td className={cellPaddingClass}>{subscriber.consent ? "Yes" : "No"}</td>
                    <td className={cellPaddingClass}>{subscriber.source || "—"}</td>
                    <td className={cellPaddingClass}>
                      {subscriber.subscribedAt ? (
                        <div>
                          <p>{new Date(subscriber.subscribedAt).toLocaleDateString("en-AU")}</p>
                          <p className="text-xs text-charcoal-500">{formatRelativeDate(subscriber.subscribedAt)}</p>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={actionCellPaddingClass}>
                      <button
                        type="button"
                        onClick={() => copyEmail(subscriber.email)}
                        className="rounded-md border border-charcoal-300 px-3 py-1.5 text-charcoal-700"
                        title={copiedEmail === subscriber.email ? "Email copied" : `Copy ${subscriber.email}`}
                        aria-label={`Copy email for ${subscriber.email}`}
                      >
                        {copiedEmail === subscriber.email ? "Copied" : "Copy email"}
                      </button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr>
                    <td colSpan={6} className={rowDensity === "compact" ? "p-4 text-center text-charcoal-500" : "p-6 text-center text-charcoal-500"}>No subscribers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
              disabled={page <= 1}
              className="w-full sm:w-auto rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700 disabled:opacity-50"
            >
              Previous
            </button>
            <div className="w-full sm:w-auto flex items-center justify-center gap-2">
              {pageWindowStart > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setPage(1)}
                    className={`min-w-10 rounded-md border px-3 py-2 text-sm ${page === 1 ? "border-navy-700 bg-navy-700 text-white" : "border-charcoal-300 text-charcoal-700"}`}
                  >
                    1
                  </button>
                  {pageWindowStart > 2 && <span className="text-charcoal-500">…</span>}
                </>
              )}

              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`min-w-10 rounded-md border px-3 py-2 text-sm ${pageNumber === page ? "border-navy-700 bg-navy-700 text-white" : "border-charcoal-300 text-charcoal-700"}`}
                >
                  {pageNumber}
                </button>
              ))}

              {pageWindowEnd < totalPages && (
                <>
                  {pageWindowEnd < totalPages - 1 && <span className="text-charcoal-500">…</span>}
                  <button
                    type="button"
                    onClick={() => setPage(totalPages)}
                    className={`min-w-10 rounded-md border px-3 py-2 text-sm ${page === totalPages ? "border-navy-700 bg-navy-700 text-white" : "border-charcoal-300 text-charcoal-700"}`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
              disabled={page >= totalPages}
              className="w-full sm:w-auto rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
