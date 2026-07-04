import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, FileText, Clock, DollarSign, LogOut, ShieldCheck, X,
  Trophy, Send, Ban, Pencil, TrendingUp, Bell,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  listOpenRfqs, listMyQuotes, submitQuote, updateQuote, vendorAnalytics,
} from "@/lib/vendor.functions";
import { toast } from "sonner";
import { BrandLogo } from "@/components/site/BrandLogo";

export const Route = createFileRoute("/_authenticated/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard · Wing Fires" },
      { name: "description", content: "Vendor dashboard for submitting and managing quotes on live aircraft-parts RFQs — with analytics, status tracking and instant notifications." },
    ],
  }),
  component: VendorDashboard,
});

type Rfq = {
  id: string; lead_id: string; part_number: string; part_name: string | null;
  aircraft: string | null; manufacturer: string | null; quantity: number;
  condition: string | null; buyer_company: string | null; created_at: string; status: string;
};

type Quote = {
  id: string; rfq_id: string; price: number; currency: string; lead_time: string;
  stock_qty: number; shipping: string | null; warranty: string | null;
  certificate: string | null; notes: string | null; status: "submitted" | "accepted" | "won" | "rejected";
  created_at: string; updated_at: string;
  rfqs: { lead_id: string; part_number: string; part_name: string | null } | null;
};

function VendorDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchRfqs = useServerFn(listOpenRfqs);
  const fetchQuotes = useServerFn(listMyQuotes);
  const fetchAnalytics = useServerFn(vendorAnalytics);
  const [quoteFor, setQuoteFor] = useState<Rfq | null>(null);
  const [editing, setEditing] = useState<Quote | null>(null);
  const lastRfqCount = useRef<number | null>(null);

  const rfqs = useQuery({
    queryKey: ["rfqs"],
    queryFn: () => fetchRfqs(),
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => fetchQuotes() });
  const stats = useQuery({ queryKey: ["vendor-analytics"], queryFn: () => fetchAnalytics(), refetchInterval: 60_000 });

  // Notify when new RFQs land
  useEffect(() => {
    const data = rfqs.data;
    if (!data) return;
    if (lastRfqCount.current == null) { lastRfqCount.current = data.length; return; }
    if (data.length > lastRfqCount.current) {
      const diff = data.length - lastRfqCount.current;
      toast(<span><Bell className="inline h-4 w-4 mr-1 text-electric" /> {diff} new RFQ{diff > 1 ? "s" : ""} just arrived</span>);
    }
    lastRfqCount.current = data.length;
  }, [rfqs.data]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/5 bg-surface/40 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <Link to="/"><BrandLogo size={36} subtitle="Vendor Portal" /></Link>
          <div className="flex items-center gap-2">
            <Link to="/parts" className="hidden sm:inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-sm hover:bg-white/10">
              <Package className="h-4 w-4" /> Browse Inventory
            </Link>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-sm hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Vendor Dashboard</div>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">Live RFQs waiting for your quote</h1>
          <p className="mt-2 text-silver-dim">Submit, edit and track quote status — accepted, won, or rejected — with instant notifications.</p>
        </div>

        <div className="mt-6 grid gap-3 grid-cols-2 md:grid-cols-5">
          <Stat icon={FileText} label="Open RFQs" value={stats.data?.openRfqs ?? "—"} />
          <Stat icon={DollarSign} label="My Quotes" value={stats.data?.totalQuotes ?? "—"} />
          <Stat icon={Send} label="Submitted" value={stats.data?.counts.submitted ?? 0} tone="electric" />
          <Stat icon={ShieldCheck} label="Accepted" value={stats.data?.counts.accepted ?? 0} tone="amber" />
          <Stat icon={Trophy} label="Won" value={stats.data?.counts.won ?? 0} tone="emerald" />
        </div>

        <section className="mt-10">
          <div className="flex items-end justify-between mb-4 gap-3 flex-wrap">
            <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-electric" /> Received RFQs</h2>
            <div className="text-xs text-silver-dim font-mono">Auto-refreshing every 30s</div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {rfqs.isLoading && <div className="glass rounded-2xl p-6 text-silver-dim">Loading RFQs…</div>}
            {rfqs.data?.length === 0 && (
              <div className="glass rounded-2xl p-8 text-center text-silver-dim col-span-full">
                No open RFQs right now. New ones will appear here automatically.
              </div>
            )}
            <AnimatePresence>
              {rfqs.data?.map((r: Rfq, i: number) => (
                <motion.article
                  key={r.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: (i % 6) * 0.05 }}
                  className="glass-strong rounded-2xl p-5 hover:border-electric/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[11px] text-electric">{r.lead_id}</div>
                      <div className="mt-1 font-semibold text-lg leading-tight">{r.part_name || r.part_number}</div>
                      <div className="mt-1 font-mono text-[11px] text-silver-dim">PN: {r.part_number}</div>
                    </div>
                    <span className="rounded-md border border-emerald-400/30 bg-emerald-400/15 text-emerald-300 px-2 py-0.5 text-[10px] font-medium">
                      {r.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-silver">
                    <Info label="Aircraft" value={r.aircraft || "—"} />
                    <Info label="Manufacturer" value={r.manufacturer || "—"} />
                    <Info label="Qty" value={String(r.quantity)} />
                    <Info label="Condition" value={r.condition || "—"} />
                  </div>
                  <button
                    onClick={() => setQuoteFor(r)}
                    className="mt-5 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-electric to-electric-glow py-2.5 text-sm font-semibold text-navy-deep"
                  >
                    Submit Quote
                  </button>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-electric" /> My quotes & status</h2>
          <div className="mt-4 glass rounded-2xl overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-white/5 text-silver-dim">
                <tr>
                  {["Lead ID", "Part", "Price", "Lead time", "Stock", "Status", "Updated", ""].map(h => (
                    <th key={h} className="text-left font-mono text-[10px] uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.data?.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-silver-dim">No quotes submitted yet.</td></tr>
                )}
                {quotes.data?.map((raw) => { const q = raw as unknown as Quote; return (
                  <tr key={q.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-electric text-xs">{q.rfqs?.lead_id ?? "—"}</td>
                    <td className="px-4 py-3">{q.rfqs?.part_name ?? q.rfqs?.part_number ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold">{q.currency} {Number(q.price).toLocaleString()}</td>
                    <td className="px-4 py-3">{q.lead_time}</td>
                    <td className="px-4 py-3">{q.stock_qty}</td>
                    <td className="px-4 py-3"><StatusBadge status={q.status} /></td>
                    <td className="px-4 py-3 text-silver-dim text-xs"><Clock className="inline h-3 w-3 mr-1" />{new Date(q.updated_at).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(q)}
                        disabled={q.status === "won" || q.status === "rejected"}
                        className="inline-flex items-center gap-1 rounded-md glass px-2.5 py-1.5 text-xs hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                    </td>
                  </tr>
                ); })}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {quoteFor && (
        <QuoteModal
          rfq={quoteFor}
          onClose={() => setQuoteFor(null)}
          onSaved={() => { setQuoteFor(null); quotes.refetch(); stats.refetch(); }}
        />
      )}
      {editing && (
        <QuoteModal
          rfq={{
            id: editing.rfq_id,
            lead_id: editing.rfqs?.lead_id ?? "",
            part_number: editing.rfqs?.part_number ?? "",
            part_name: editing.rfqs?.part_name ?? null,
            aircraft: null, manufacturer: null, quantity: 1,
            condition: null, buyer_company: null, created_at: "", status: "open",
          }}
          existing={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); quotes.refetch(); stats.refetch(); }}
        />
      )}
    </div>
  );
}

function Stat({
  icon: Icon, label, value, tone = "default",
}: { icon: typeof FileText; label: string; value: string | number; tone?: "default" | "electric" | "emerald" | "amber" }) {
  const toneCls = {
    default: "text-electric",
    electric: "text-electric",
    emerald: "text-emerald-300",
    amber: "text-amber-300",
  }[tone];
  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
      <Icon className={`h-5 w-5 ${toneCls}`} />
      <div>
        <div className="font-display text-2xl font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-silver-dim">{label}</div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
      <div className="text-[10px] uppercase tracking-widest text-silver-dim">{label}</div>
      <div className="mt-0.5 text-sm text-silver">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Quote["status"] }) {
  const map = {
    submitted: { cls: "border-electric/40 bg-electric/10 text-electric", icon: Send, label: "Submitted" },
    accepted: { cls: "border-amber-400/40 bg-amber-400/10 text-amber-300", icon: ShieldCheck, label: "Accepted" },
    won: { cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300", icon: Trophy, label: "Won" },
    rejected: { cls: "border-rose-400/40 bg-rose-400/10 text-rose-300", icon: Ban, label: "Rejected" },
  }[status];
  const Icon = map.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map.cls}`}>
      <Icon className="h-3 w-3" /> {map.label}
    </span>
  );
}

function QuoteModal({
  rfq, existing, onClose, onSaved,
}: { rfq: Rfq; existing?: Quote; onClose: () => void; onSaved: () => void }) {
  const submit = useServerFn(submitQuote);
  const update = useServerFn(updateQuote);
  const [form, setForm] = useState({
    price: existing ? String(existing.price) : "",
    currency: existing?.currency ?? "USD",
    lead_time: existing?.lead_time ?? "",
    stock_qty: existing ? String(existing.stock_qty) : "",
    shipping: existing?.shipping ?? "",
    warranty: existing?.warranty ?? "",
    certificate: existing?.certificate ?? "FAA 8130-3",
    notes: existing?.notes ?? "",
  });
  const m = useMutation({
    mutationFn: () => {
      const payload = {
        rfq_id: rfq.id,
        price: Number(form.price),
        currency: form.currency,
        lead_time: form.lead_time,
        stock_qty: Number(form.stock_qty),
        shipping: form.shipping,
        warranty: form.warranty,
        certificate: form.certificate,
        notes: form.notes,
      };
      return existing
        ? update({ data: { ...payload, id: existing.id } })
        : submit({ data: payload });
    },
    onSuccess: () => { toast.success(existing ? "Quote updated & resubmitted." : "Quote submitted."); onSaved(); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur grid place-items-center px-4 py-8" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-strong rounded-2xl w-full max-w-2xl p-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[11px] text-electric">{rfq.lead_id}</div>
            <div className="mt-1 text-xl font-bold">{rfq.part_name || rfq.part_number}</div>
            <div className="text-sm text-silver-dim">
              {existing ? "Update your existing quote — this will resubmit it for review." : `Qty ${rfq.quantity} · ${rfq.condition ?? ""} · ${rfq.manufacturer ?? ""}`}
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-5 grid gap-3 sm:grid-cols-2">
          <FInput label="Unit Price *" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" required />
          <FInput label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
          <FInput label="Lead Time *" value={form.lead_time} onChange={(v) => setForm({ ...form, lead_time: v })} placeholder="e.g. 5-7 days" required />
          <FInput label="Stock Quantity *" value={form.stock_qty} onChange={(v) => setForm({ ...form, stock_qty: v })} type="number" required />
          <FInput label="Shipping" value={form.shipping} onChange={(v) => setForm({ ...form, shipping: v })} placeholder="DHL Express DDP" />
          <FInput label="Warranty" value={form.warranty} onChange={(v) => setForm({ ...form, warranty: v })} placeholder="12 months" />
          <FInput label="Certificate" value={form.certificate} onChange={(v) => setForm({ ...form, certificate: v })} placeholder="FAA 8130-3 / EASA Form 1" />
          <div className="sm:col-span-2">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">Notes</span>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm focus:outline-none focus:border-electric" />
          </div>
          <button type="submit" disabled={m.isPending}
            className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 py-3 text-sm font-semibold text-navy-deep disabled:opacity-60">
            <ShieldCheck className="h-4 w-4" /> {m.isPending ? "Saving…" : existing ? "Update & resubmit" : "Submit quote"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function FInput({
  label, value, onChange, placeholder, type = "text", required,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">{label}</span>
      <input type={type} required={required} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm placeholder:text-silver-dim/70 focus:outline-none focus:border-electric" />
    </label>
  );
}
