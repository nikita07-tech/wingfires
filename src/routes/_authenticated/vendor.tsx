import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane, Package, FileText, Clock, DollarSign, LogOut, ShieldCheck, X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { listOpenRfqs, listMyQuotes, submitQuote } from "@/lib/vendor.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/vendor")({
  head: () => ({
    meta: [
      { title: "Vendor Dashboard · Wing Fires" },
      { name: "description", content: "Vendor dashboard for submitting quotes on live aircraft-parts RFQs." },
    ],
  }),
  component: VendorDashboard,
});

type Rfq = {
  id: string; lead_id: string; part_number: string; part_name: string | null;
  aircraft: string | null; manufacturer: string | null; quantity: number;
  condition: string | null; buyer_company: string | null; created_at: string; status: string;
};

function VendorDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchRfqs = useServerFn(listOpenRfqs);
  const fetchQuotes = useServerFn(listMyQuotes);
  const [active, setActive] = useState<Rfq | null>(null);

  const rfqs = useQuery({ queryKey: ["rfqs"], queryFn: () => fetchRfqs() });
  const quotes = useQuery({ queryKey: ["quotes"], queryFn: () => fetchQuotes() });

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
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-glow">
              <Plane className="h-4.5 w-4.5 text-navy-deep" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold">Wing Fires</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Vendor Portal</div>
            </div>
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-lg glass px-3 py-2 text-sm hover:bg-white/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Vendor Dashboard</div>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold">Live RFQs waiting for your quote</h1>
            <p className="mt-2 text-silver-dim">Submit pricing, lead time, stock, shipping, warranty and certification in one form.</p>
          </div>
          <div className="flex gap-3">
            <Stat icon={FileText} label="Open RFQs" value={rfqs.data?.length ?? "…"} />
            <Stat icon={DollarSign} label="My Quotes" value={quotes.data?.length ?? "…"} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {rfqs.isLoading && <div className="glass rounded-2xl p-6 text-silver-dim">Loading RFQs…</div>}
          {rfqs.data?.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-silver-dim">
              No open RFQs right now. Check back soon.
            </div>
          )}
          {rfqs.data?.map((r: Rfq, i: number) => (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
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
                onClick={() => setActive(r)}
                className="mt-5 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-electric to-electric-glow py-2.5 text-sm font-semibold text-navy-deep"
              >
                Submit Quote
              </button>
            </motion.article>
          ))}
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-electric" /> My recent quotes
          </h2>
          <div className="mt-4 glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-silver-dim">
                <tr>
                  {["Lead ID", "Part", "Price", "Lead time", "Stock", "Cert", "Sent"].map(h => (
                    <th key={h} className="text-left font-mono text-[10px] uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {quotes.data?.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-silver-dim">No quotes submitted yet.</td></tr>
                )}
                {/* biome-ignore lint/suspicious/noExplicitAny: dynamic join shape */}
                {quotes.data?.map((q: any) => (
                  <tr key={q.id} className="border-t border-white/5">
                    <td className="px-4 py-3 font-mono text-electric text-xs">{q.rfqs?.lead_id ?? "—"}</td>
                    <td className="px-4 py-3">{q.rfqs?.part_name ?? q.rfqs?.part_number ?? "—"}</td>
                    <td className="px-4 py-3 font-semibold">{q.currency} {Number(q.price).toLocaleString()}</td>
                    <td className="px-4 py-3">{q.lead_time}</td>
                    <td className="px-4 py-3">{q.stock_qty}</td>
                    <td className="px-4 py-3 text-silver-dim text-xs">{q.certificate ?? "—"}</td>
                    <td className="px-4 py-3 text-silver-dim text-xs"><Clock className="inline h-3 w-3 mr-1" />{new Date(q.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {active && <QuoteModal rfq={active} onClose={() => setActive(null)} onSaved={() => { setActive(null); quotes.refetch(); }} />}
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof FileText; label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
      <Icon className="h-5 w-5 text-electric" />
      <div>
        <div className="font-display text-xl font-bold">{value}</div>
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

function QuoteModal({ rfq, onClose, onSaved }: { rfq: Rfq; onClose: () => void; onSaved: () => void }) {
  const submit = useServerFn(submitQuote);
  const [form, setForm] = useState({
    price: "", currency: "USD", lead_time: "", stock_qty: "",
    shipping: "", warranty: "", certificate: "FAA 8130-3", notes: "",
  });
  const m = useMutation({
    mutationFn: () => submit({
      data: {
        rfq_id: rfq.id,
        price: Number(form.price),
        currency: form.currency,
        lead_time: form.lead_time,
        stock_qty: Number(form.stock_qty),
        shipping: form.shipping,
        warranty: form.warranty,
        certificate: form.certificate,
        notes: form.notes,
      },
    }),
    onSuccess: () => { toast.success("Quote submitted."); onSaved(); },
    onError: (e) => toast.error((e as Error).message),
  });
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur grid place-items-center px-4 py-8" onClick={onClose}>
      <div className="glass-strong rounded-2xl w-full max-w-2xl p-6 max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[11px] text-electric">{rfq.lead_id}</div>
            <div className="mt-1 text-xl font-bold">{rfq.part_name || rfq.part_number}</div>
            <div className="text-sm text-silver-dim">Qty {rfq.quantity} · {rfq.condition} · {rfq.manufacturer}</div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); m.mutate(); }} className="mt-5 grid gap-3 sm:grid-cols-2">
          <Input label="Unit Price *" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" required />
          <Input label="Currency" value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} />
          <Input label="Lead Time *" value={form.lead_time} onChange={(v) => setForm({ ...form, lead_time: v })} placeholder="e.g. 5-7 days" required />
          <Input label="Stock Quantity *" value={form.stock_qty} onChange={(v) => setForm({ ...form, stock_qty: v })} type="number" required />
          <Input label="Shipping" value={form.shipping} onChange={(v) => setForm({ ...form, shipping: v })} placeholder="DHL Express DDP" />
          <Input label="Warranty" value={form.warranty} onChange={(v) => setForm({ ...form, warranty: v })} placeholder="12 months" />
          <Input label="Certificate" value={form.certificate} onChange={(v) => setForm({ ...form, certificate: v })} placeholder="FAA 8130-3 / EASA Form 1" />
          <div className="sm:col-span-2">
            <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">Notes</span>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm focus:outline-none focus:border-electric" />
          </div>
          <button type="submit" disabled={m.isPending}
            className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 py-3 text-sm font-semibold text-navy-deep disabled:opacity-60">
            <ShieldCheck className="h-4 w-4" /> {m.isPending ? "Submitting…" : "Submit quote"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({
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
