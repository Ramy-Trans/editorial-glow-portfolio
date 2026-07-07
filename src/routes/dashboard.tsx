import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import {
  adminLoginFn,
  verifyAdminFn,
  getBookingsFn,
  getContactMessagesFn,
  updateBookingStatusFn,
  deleteBookingFn,
  deleteContactMessageFn,
  type Booking,
  type ContactMessage,
} from "@/lib/booking-fns";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Studio Dashboard — GJ Media House" }],
  }),
  component: DashboardPage,
});

type PageState = "checking" | "login" | "dashboard";
type Tab = "bookings" | "messages";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  },
  confirmed: {
    label: "Confirmed",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-400 bg-red-400/10 border-red-400/30",
  },
} as const;

const TOKEN_KEY = "gjstudio_admin_token";

function DashboardPage() {
  const [pageState, setPageState] = useState<PageState>("checking");
  const [token, setToken] = useState<string | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [tab, setTab] = useState<Tab>("bookings");

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setPageState("login");
      return;
    }
    verifyAdminFn({ data: { token: stored } })
      .then((res) => {
        if (res.valid) {
          setToken(stored);
          setPageState("dashboard");
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setPageState("login");
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setPageState("login");
      });
  }, []);

  useEffect(() => {
    if (pageState === "dashboard" && token) fetchAll(token);
  }, [pageState, token]);

  async function fetchAll(tok: string) {
    setLoading(true);
    try {
      const [b, m] = await Promise.all([
        getBookingsFn({ data: { token: tok } }),
        getContactMessagesFn({ data: { token: tok } }),
      ]);
      setBookings(b.bookings);
      setMessages(m.messages);
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : "Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await adminLoginFn({ data: { password: loginPassword } });
      localStorage.setItem(TOKEN_KEY, res.token);
      setToken(res.token);
      setPageState("dashboard");
    } catch (err: unknown) {
      // Extract the real message from TanStack's wrapped error
      let msg = "Login failed";
      if (err instanceof Error) {
        msg = err.message;
      } else if (typeof err === "string") {
        msg = err;
      }
      // TanStack Start wraps errors — pull the inner message out
      const match = msg.match(/["']?message["']?\s*:\s*["']([^"']+)["']/i);
      if (match) msg = match[1];
      setLoginError(msg);
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setBookings([]);
    setMessages([]);
    setPageState("login");
  }

  async function handleStatusChange(id: number, status: string) {
    if (!token) return;
    try {
      await updateBookingStatusFn({ data: { token, id, status } });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      flash("Status updated.");
    } catch {
      flash("Failed to update status.");
    }
  }

  async function handleDeleteBooking(id: number) {
    if (!token || !confirm("Delete this booking?")) return;
    try {
      await deleteBookingFn({ data: { token, id } });
      setBookings((prev) => prev.filter((b) => b.id !== id));
      flash("Booking deleted.");
    } catch {
      flash("Failed to delete booking.");
    }
  }

  async function handleDeleteMessage(id: number) {
    if (!token || !confirm("Delete this message?")) return;
    try {
      await deleteContactMessageFn({ data: { token, id } });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      flash("Message deleted.");
    } catch {
      flash("Failed to delete message.");
    }
  }

  function flash(msg: string) {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(""), 3000);
  }

  /* ── Checking auth ── */
  if (pageState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  /* ── Login ── */
  if (pageState === "login") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 text-center">
            <div className="font-display text-3xl font-extrabold tracking-tight">
              GJ<span className="text-gold"> Media</span> House
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Media House Dashboard — Admin Access
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-white/10 bg-charcoal px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-gold focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <AnimatePresence>
              {loginError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-400"
                >
                  {loginError}
                </motion.p>
              )}
            </AnimatePresence>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loginLoading ? "Verifying…" : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  /* ── Dashboard ── */
  const stats = {
    bookings: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    messages: messages.length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <div className="font-display text-xl font-extrabold tracking-tight">
            GJ<span className="text-gold"> Media</span> House
            <span className="ml-3 text-xs text-muted-foreground/60">/ Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => token && fetchAll(token)}
              className="flex items-center gap-1.5 border border-white/10 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 border border-white/10 px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-red-400/50 hover:text-red-400"
            >
              <LogOut className="h-3 w-3" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Bookings", val: stats.bookings, color: "text-foreground" },
            { label: "Pending", val: stats.pending, color: "text-amber-400" },
            { label: "Confirmed", val: stats.confirmed, color: "text-emerald-400" },
            { label: "Messages", val: stats.messages, color: "text-gold" },
          ].map((s) => (
            <div key={s.label} className="border border-white/5 bg-charcoal px-6 py-5">
              <div className={`font-display text-4xl font-extrabold ${s.color}`}>{s.val}</div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Flash message */}
        <AnimatePresence>
          {actionMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold"
            >
              {actionMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="mb-0 flex border-b border-white/5">
          {(
            [
              { key: "bookings" as Tab, label: "Booking Inquiries", icon: CalendarDays, count: stats.bookings },
              { key: "messages" as Tab, label: "Contact Messages", icon: MessageSquare, count: stats.messages },
            ] as const
          ).map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] border-b-2 transition-colors ${
                tab === key
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span
                className={`ml-1 rounded-sm px-1.5 py-0.5 text-[10px] ${
                  tab === key ? "bg-gold/20 text-gold" : "bg-white/5 text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Table panel */}
        <div className="border border-t-0 border-white/5">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
            </div>
          ) : tab === "bookings" ? (
            bookings.length === 0 ? (
              <div className="py-20 text-center text-sm text-muted-foreground">
                No booking inquiries yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-sm">
                  <thead>
                    <tr className="border-b border-white/5 text-left">
                      {["#", "Name", "Contact", "Occasion", "Description", "Date", "Status", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, idx) => {
                      const sc =
                        STATUS_CONFIG[b.status as keyof typeof STATUS_CONFIG] ??
                        STATUS_CONFIG.pending;
                      return (
                        <motion.tr
                          key={b.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-4 text-muted-foreground">{b.id}</td>
                          <td className="px-4 py-4 font-medium">{b.name}</td>
                          <td className="px-4 py-4">
                            <div className="text-xs text-muted-foreground">{b.email}</div>
                            <div className="text-xs text-muted-foreground">{b.phone}</div>
                          </td>
                          <td className="px-4 py-4">{b.occasion}</td>
                          <td className="max-w-[200px] px-4 py-4">
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {b.description || "—"}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(b.created_at).toLocaleDateString("en-EG", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-block border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] ${sc.color}`}
                            >
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleStatusChange(b.id, "confirmed")}
                                title="Confirm"
                                className="text-emerald-400 transition-opacity hover:opacity-70"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(b.id, "pending")}
                                title="Set Pending"
                                className="text-amber-400 transition-opacity hover:opacity-70"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(b.id, "rejected")}
                                title="Reject"
                                className="text-red-400 transition-opacity hover:opacity-70"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                title="Delete"
                                className="text-muted-foreground transition-colors hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-sm text-muted-foreground">
              No contact messages yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-left">
                    {["#", "Name", "Contact", "Event Type", "Message", "Date", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, idx) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-4 text-muted-foreground">{m.id}</td>
                      <td className="px-4 py-4 font-medium">{m.name}</td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-muted-foreground">{m.email}</div>
                        <div className="text-xs text-muted-foreground">{m.phone}</div>
                      </td>
                      <td className="px-4 py-4 text-xs">{m.event_type || "—"}</td>
                      <td className="max-w-[240px] px-4 py-4">
                        <p className="line-clamp-3 text-xs text-muted-foreground">
                          {m.message || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString("en-EG", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleDeleteMessage(m.id)}
                          title="Delete"
                          className="text-muted-foreground transition-colors hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
