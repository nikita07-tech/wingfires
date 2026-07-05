import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Mail, Phone, Building2, User, X, Kanban, LayoutDashboard, Package, Lock,
  ChevronRight, ArrowRight, Clock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/site/BrandLogo";
import { listAllRfqs, updateRfqStatus, listRfqQuotes, checkAdmin } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/crm")({
  head: () => ({
    meta: [
      { title: "CRM · Wing Fires" },
      { name: "description", content: "Wing Fires CRM — lead pipeline for buyer RFQs, contact history, quote comparison." },
    ],
  }),
  component: CRM,
});

const COLUMNS = [
  { key: "open", label: "New", tone: "border-electric/40 bg-electric/5" },
  { key: "contacted", label: "Contacted", tone: "border-amber-400/40 bg-amber-400/5" },
  { key: "quoted", label: "Quoted", tone: "border-sky-400/40 bg-sky-400/5" },
  { key: "won", label: "Won", tone: "border-emerald-400/40 bg-emerald-400/5" },
  { key: "lost", label: "Lost", tone: "border-rose-400/40 bg-rose-400/5" },
] as const;

type StatusKey = typeof COLUMNS[number]["key"];

function CRM() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const check = useServerFn(checkAdmin);
  const rfqsFn = useServerFn(listAllRfqs);
  const setStatus = useServerFn(updateRfqStatus);
  const [active, setActive] = useState<string | null>(null);

  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => check() });
  const rfqs = useQuery({ queryKey: ["admin-rfqs"], queryFn: () => rfqsFn(), enabled: !!admin.data?.isAdmin });

  const mut = useMutation({
    mutationFn: (v: { id: string; status: StatusKey }) => setStatus({ data: v }),
    onSuccess: () => { toast.success("Lead moved"); qc.invalidateQueries({ queryKey: ["admin-rfqs"] }); },
    onError: (e) => toast.error((e as Error).message),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (admin.isLoading) return <div className="min-h-screen grid place-items-center text-silver-dim">Loading…</div>;
  if (!admin.data?.isAdmin) return (
    <div className="min-h-screen grid place-items-center px-4">
      <div className="glass-strong rounded-2xl p-8 max-w-md text-center">
        <Lock className="h-10 w-10 text-electric mx-auto" />
        <h1 className="mt-4 text-2xl font-bold">Admin access required</h1>
        <p className="mt-2 text-sm text-silver-dim">The CRM is restricted to Wing Fires admins.</p>
        <Link to="/admin" className="mt-5 inline-block rounded-lg glass px-4 py-2 text-sm">See instructions</Link>
      </div>
    </div>
  );

  const byStatus: Record<string, typeof rfqs.data extends undefined ? never : NonNullable<typeof rfqs.data>> = {} as any;
  for (const c of COLUMNS) byStatus[c.key] = [] as any;
  for (const r of rfqs.data ?? []) {
    const key = (byStatus[r.status] ? r.status : "open") as string;
    (byStatus[key] as any).push(r);
  }

  const activeRfq = rfqs.data?.find((r) => r.id === active) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/5 bg-surface/40 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-[1400px] px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2"><BrandLogo size={34} subtitle="CRM" /></Link>
          <nav className="hidden sm:flex items-center gap-1 text-sm">
            <Link to="/admin" className="rounded-md px-3 py-2 hover:bg-white/5 flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Admin</Link>
            <Link to="/crm" className="rounded-md px-3 py-2 text-electric bg-white/5 flex items-center gap-1.5"><Kanban className="h-4 w-4" /> CRM</Link>
            <Link to="/vendor" className="rounded-md px-3 py-2 hover:bg-white/5 flex items-center gap-1.5"><Package className="h-4 w-4" /> Vendor</Link>
          </nav>
          <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:py-8">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Lead Pipeline</div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold">CRM · Buyer RFQs</h1>
          </div>
          <div className="text-xs text-silver-dim font-mono">{rfqs.data?.length ?? 0} total leads</div>
        </div>

        <div className="mt-6 grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-5">
          {COLUMNS.map((col) => (
            <div key={col.key} className={`glass rounded-2xl p-3 border ${col.tone}`}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="font-mono text-[10px] uppercase tracking-widest text-silver">{col.label}</div>
                <div className="text-xs font-semibold text-silver-dim">{(byStatus[col.key] as any).length}</div>
              </div>
              <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
                <AnimatePresence>
                  {((byStatus[col.key] as any[]) ?? []).map((r: any, i: number) => (
                    <motion.button
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: (i % 8) * 0.03 }}
                      onClick={() => setActive(r.id)}
                      className="w-full text-left glass-strong rounded-xl p-3 hover:border-electric/40 transition group"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="font-mono text-[10px] text-electric truncate">{r.lead_id}</div>
                        <ChevronRight className="h-3 w-3 text-silver-dim opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="mt-1 font-semibold text-sm leading-tight line-clamp-2">
                        {r.part_name || r.part_number}
                      </div>
                      <div className="mt-2 text-[11px] text-silver-dim truncate">
                        {r.buyer_company || r.buyer_email || "Anonymous"}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-silver-dim/70">
                        <Clock className="h-2.5 w-2.5" /> {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
                {((byStatus[col.key] as any[]) ?? []).length === 0 && (
                  <div className="text-center text-[11px] text-silver-dim/60 py-6">No leads</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <AnimatePresence>
        {activeRfq && (
          <LeadDrawer
            rfq={activeRfq}
            onClose={() => setActive(null)}
            onMove={(status) => mut.mutate({ id: activeRfq.id, status })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadDrawer({
  rfq, onClose, onMove,
}: { rfq: any; onClose: () => void; onMove: (s: StatusKey) => void }) {
  const listQuotes = useServerFn(listRfqQuotes);
  const quotes = useQuery({
    queryKey: ["rfq-quotes", rfq.id],
    queryFn: () => listQuotes({ data: { rfq_id: rfq.id } }),
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] bg-surface/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[11px] text-electric">{rfq.lead_id}</div>
              <h2 className="mt-1 text-xl sm:text-2xl font-bold leading-tight">{rfq.part_name || rfq.part_number}</h2>
              <div className="text-xs text-silver-dim font-mono mt-1">PN: {rfq.part_number}</div>
            </div>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"><X className="h-4 w-4" /></button>
          </div>

          <div className="mt-5 glass rounded-2xl p-4 space-y-2 text-sm">
            <Line icon={User} label="Buyer" value={rfq.buyer_name} />
            <Line icon={Building2} label="Company" value={rfq.buyer_company} />
            <Line icon={Mail} label="Email" value={rfq.buyer_email} href={rfq.buyer_email ? `mailto:${rfq.buyer_email}` : undefined} />
            <Line icon={Package} label="Qty · Condition" value={`${rfq.quantity} · ${rfq.condition ?? "—"}`} />
          </div>

          {rfq.notes && (
            <div className="mt-4 glass rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-silver-dim mb-1">Notes</div>
              <p className="text-sm text-silver whitespace-pre-wrap">{rfq.notes}</p>
            </div>
          )}

          <div className="mt-5">
            <div className="text-xs uppercase tracking-widest text-silver-dim font-mono mb-2">Move to</div>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map((c) => (
                <button
                  key={c.key}
                  onClick={() => onMove(c.key)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold border transition ${
                    rfq.status === c.key
                      ? "bg-electric text-navy-deep border-electric"
                      : "glass border-white/10 hover:border-electric/40"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs uppercase tracking-widest text-silver-dim font-mono mb-2">Vendor quotes ({quotes.data?.length ?? 0})</div>
            <div className="space-y-2">
              {quotes.data?.map((q: any) => (
                <div key={q.id} className="glass rounded-xl p-3">
                  <div className="flex justify-between items-baseline">
                    <div className="font-semibold text-sm">{q.vendor_profiles?.company_name || "Vendor"}</div>
                    <div className="font-display font-bold text-electric">{q.currency} {Number(q.price).toLocaleString()}</div>
                  </div>
                  <div className="mt-1 text-xs text-silver-dim">
                    {q.lead_time} · {q.stock_qty} in stock · {q.certificate ?? "—"}
                  </div>
                </div>
              ))}
              {quotes.data?.length === 0 && <div className="text-sm text-silver-dim">No quotes yet.</div>}
            </div>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function Line({ icon: Icon, label, value, href }: { icon: typeof Mail; label: string; value: string | null; href?: string }) {
  const content = (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-electric shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-silver-dim">{label}</div>
        <div className="text-sm text-silver truncate">{value || "—"}</div>
      </div>
      {href && <ArrowRight className="h-3 w-3 text-silver-dim" />}
    </div>
  );
  return href ? <a href={href} className="block hover:bg-white/5 -mx-1 px-1 rounded">{content}</a> : content;
}
