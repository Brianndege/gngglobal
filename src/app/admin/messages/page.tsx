"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, getAdminAuthHeaders, getAdminToken } from "@/lib/adminAuth";
import { ContactMessage, getCmsApiBaseUrl } from "@/lib/cms";

interface ContactMessagesResponse {
  messages: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "responded">("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testMessage, setTestMessage] = useState<string | null>(null);
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

        const response = await fetch(`${apiBase}/api/admin/contact-messages?${query.toString()}`, {
          headers: {
            ...getAdminAuthHeaders(),
          },
          signal: controller.signal,
        });

        if (!isActive) return;

        if (response.status === 401) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load contact messages");
        }

        const data = (await response.json()) as ContactMessagesResponse;
        setMessages(data.messages);
      } catch (loadError) {
        if (loadError instanceof DOMException && loadError.name === "AbortError") {
          return;
        }
        if (!isActive) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load contact messages");
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
  }, [apiBase, router, statusFilter]);

  async function updateMessageStatus(item: ContactMessage, status: "new" | "responded") {
    const notes = status === "responded"
      ? (prompt("Optional response notes", item.responseNotes || "") ?? item.responseNotes ?? "")
      : "";

    setUpdatingId(item._id);
    setError(null);

    try {
      const response = await fetch(`${apiBase}/api/admin/contact-messages/${item._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify({
          status,
          responseNotes: notes,
        }),
      });

      if (response.status === 401) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { message?: string };
        throw new Error(data?.message || "Failed to update message status");
      }

      const data = (await response.json()) as { message: ContactMessage };
      setMessages((previous) => previous.map((entry) => (entry._id === data.message._id ? data.message : entry)));
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update message status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function sendTestNotification() {
    setIsSendingTest(true);
    setError(null);
    setTestMessage(null);

    try {
      const response = await fetch(`${apiBase}/api/admin/contact-messages/test-notification`, {
        method: "POST",
        headers: {
          ...getAdminAuthHeaders(),
        },
      });

      if (response.status === 401) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data?.message || "Failed to send test notification");
      }

      setTestMessage(data?.message || "Test notification email sent");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Failed to send test notification");
    } finally {
      setIsSendingTest(false);
    }
  }

  return (
    <main className="p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-navy-800">Contact Messages</h1>
            <p className="text-sm text-charcoal-600 mt-1">Review incoming contact requests and mark response status.</p>
            {testMessage && <p className="text-xs text-emerald-700 mt-2">{testMessage}</p>}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={sendTestNotification}
              disabled={isSendingTest}
              className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700 disabled:opacity-60"
            >
              {isSendingTest ? "Sending test..." : "Send SMTP Test"}
            </button>
            <Link href="/admin/guide" className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Guide</Link>
            <Link href="/admin/dashboard" className="rounded-md border border-charcoal-300 px-4 py-2 text-charcoal-700">Back to Dashboard</Link>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | "new" | "responded")}
            className="rounded-md border border-charcoal-300 px-3 py-2"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="responded">Responded</option>
          </select>
        </div>

        {loading ? (
          <div className="rounded-lg border border-ivory-300 bg-white p-6">Loading messages...</div>
        ) : error ? (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-destructive">{error}</div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-ivory-300 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ivory-100">
                <tr>
                  <th className="text-left p-4">Received</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Message</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((item) => (
                  <tr key={item._id} className="border-t border-ivory-200 align-top">
                    <td className="p-4 whitespace-nowrap">{new Date(item.createdAt).toLocaleString("en-AU")}</td>
                    <td className="p-4">
                      <p className="font-semibold text-navy-800">{item.name}</p>
                      <p className="text-charcoal-700">{item.email}</p>
                      {item.phone && <p className="text-charcoal-600">{item.phone}</p>}
                      {item.company && <p className="text-charcoal-600">{item.company}</p>}
                    </td>
                    <td className="p-4">
                      <p className="text-charcoal-800 whitespace-pre-wrap">{item.message}</p>
                      {item.responseNotes && (
                        <p className="mt-2 text-xs text-charcoal-600">Notes: {item.responseNotes}</p>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "responded" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {item.status}
                      </span>
                      {item.respondedAt && (
                        <p className="mt-2 text-xs text-charcoal-600">{new Date(item.respondedAt).toLocaleString("en-AU")}</p>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      {item.status !== "responded" ? (
                        <button
                          type="button"
                          onClick={() => updateMessageStatus(item, "responded")}
                          disabled={updatingId === item._id}
                          className="rounded-md bg-navy-700 hover:bg-navy-800 text-white px-3 py-1.5 disabled:opacity-60"
                        >
                          {updatingId === item._id ? "Saving..." : "Mark Responded"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateMessageStatus(item, "new")}
                          disabled={updatingId === item._id}
                          className="rounded-md border border-charcoal-300 px-3 py-1.5 text-charcoal-700 disabled:opacity-60"
                        >
                          {updatingId === item._id ? "Saving..." : "Mark New"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-charcoal-500">No contact messages found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
