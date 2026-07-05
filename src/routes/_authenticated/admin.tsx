import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ShieldCheck, LogOut, FileText, DollarSign, Users, TrendingUp, Trophy,
  BarChart3, LayoutDashboard, Package, Kanban, Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/site/BrandLogo";
import {
  getAdminStats, listAllRfqs, updateQuoteStatus, checkAdmin,
} from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · Wing Fires" },
      { name: "description", content: "Wing Fires admin — RFQs, quotes, vendors, analytics." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const check = useServerFn(checkAdmin);
  const statsFn = useServerFn(getAdminStats);
  const rfqsFn = useServerFn(listAllRfqs);
  const setQuote = useServerFn(updateQuoteStatus);

  const admin = useQuery({ queryKey: ["is-admin"], queryFn: () => check() });
  const isAdmin = admin.data?.isAdmin;

  const stats = useQuery({ queryKey: ["admin-stats"], queryFn: () => statsFn(), enabled: !!isAdmin });
  const rfqs = useQuery({ queryKey: ["admin-rfqs"], queryFn: () => rfqsFn(), enabled: !!isAdmin });

  const setQuoteMut = useMutation({
    mutationFn: (v: { id: string; status: "submitted" | "accepted" | "won" | "rejected" }) => setQuote({ data: v }),
    onSuccess: () => { toast.success("Quote status updated"); },
    onError: (e) => toast.error((e as Error).message),
  });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (admin.isLoading) {
    return <div className="min-h-screen grid place-items-center text-silver-dim">Checking permissions…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background grid place-items-center px-4">
        <div className="glass-strong rounded-2xl p-8 max-w-md text-center">
          <Lock className="h-10 w-10 text-electric mx-auto" />
          <h1 className="mt-4 text-2xl font-bold">Admin access required</h1>
          <p className="mt-2 text-sm text-silver-dim">
            Your account is signed in but does not have the <span className="font-mono">admin</span> role.
            Ask an existing admin to grant you access, or grant yourself via the backend:
          </p>
          <pre className="mt-4 text-left text-[11px] font-mono glass rounded-lg p-3 overflow-x-auto">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${admin.data?.userId}', 'admin');`}
          </pre>
          <div className="mt-5 flex justify-center gap-2">
            <Link to="/vendor" className="rounded-lg glass px-4 py-2 text-sm">Vendor portal</Link>
            <button onClick={signOut} className="rounded-lg glass px-4 py-2 text-sm">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AdminHeader onSignOut={signOut} />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Wing Fires Console</div>
          <h1 className="mt-2 text-2xl sm:text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-silver-dim">Overview of RFQs, vendor activity, and quote pipeline.</p>
        </motion.div>

        <div className="mt-6 grid gap-3 grid-cols-2 lg:grid-cols-5">
          <Tile icon={FileText} label="Total RFQs" value={stats.data?.totals.rfqs ?? "—"} accent="electric" />
          <Tile icon={TrendingUp} label="Last 7 days" value={stats.data?.totals.last7 ?? "—"} accent="amber" />
          <Tile icon={DollarSign} label="Quotes" value={stats.data?.totals.quotes ?? "—"} accent="silver" />
          <Tile icon={Users} label="Vendors" value={stats.data?.totals.vendors ?? "—"} accent="electric" />
          <Tile icon={Trophy} label="Won value" value={`$${(stats.data?.totals.wonValue ?? 0).toLocaleString()}`} accent="emerald" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <StatusChart title="Quote pipeline" data={stats.data?.quoteStatus ?? {}} icon={BarChart3} />
          <StatusChart title="RFQ pipeline" data={stats.data?.rfqStatus ?? {}} icon={Kanban} />
          <div className="glass-strong rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Package className="h-4 w-4 text-electric" />
              <div className="font-semibold">Top requested parts</div>
            </div>
            <ol className="space-y-2 text-sm">
              {(stats.data?.topParts ?? []).map(([pn, count]) => (
                <li key={pn} className="flex justify-between font-mono text-xs">
                  <span className="text-electric truncate">{pn}</span>
                  <span className="text-silver-dim">{count}</span>
                </li>
              ))}
              {(stats.data?.topParts ?? []).length === 0 && <li className="text-silver-dim text-sm">No RFQs yet.</li>}
            </ol>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex items-end justify-between mb-3">
            <h2 className="text-lg sm:text-xl font-bold">Recent RFQs</h2>
            <Link to="/crm" className="text-xs text-electric hover:underline">Open CRM →</Link>
          </div>
          <div className="glass rounded-2xl overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-white/5 text-silver-dim">
                <tr>
                  {["Lead", "Part", "Buyer", "Qty", "Status", "Created"].map((h) => (
                    <th key={h} className="text-left font-mono text-[10px] uppercase tracking-widest px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rfqs.data?.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-mono text-electric text-xs">{r.lead_id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{r.part_name || r.part_number}</div>
                      <div className="text-[11px] text-silver-dim font-mono">{r.part_number}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{r.buyer_company || r.buyer_name || "—"}</div>
                      <div className="text-[11px] text-silver-dim">{r.buyer_email || ""}</div>
                    </td>
                    <td className="px-4 py-3">{r.quantity}</td>
                    <td className="px-4 py-3"><span className="rounded-md border border-electric/30 bg-electric/10 text-electric px-2 py-0.5 text-[10px] font-medium uppercase">{r.status}</span></td>
                    <td className="px-4 py-3 text-silver-dim text-xs">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {rfqs.data?.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-silver-dim">No RFQs yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

function AdminHeader({ onSignOut }: { onSignOut: () => void }) {
  return (
    <header className="border-b border-white/5 bg-surface/40 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <BrandLogo size={34} subtitle="Admin" />
        </Link>
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          <Link to="/admin" className="rounded-md px-3 py-2 text-electric bg-white/5 flex items-center gap-1.5"><LayoutDashboard className="h-4 w-4" /> Admin</Link>
          <Link to="/crm" className="rounded-md px-3 py-2 hover:bg-white/5 flex items-center gap-1.5"><Kanban className="h-4 w-4" /> CRM</Link>
          <Link to="/vendor" className="rounded-md px-3 py-2 hover:bg-white/5 flex items-center gap-1.5"><Package className="h-4 w-4" /> Vendor</Link>
        </nav>
        <button onClick={onSignOut} className="inline-flex items-center gap-1.5 rounded-lg glass px-3 py-2 text-sm">
          <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}

function Tile({
  icon: Icon, label, value, accent,
}: { icon: typeof FileText; label: string; value: string | number; accent: "electric" | "amber" | "emerald" | "silver" }) {
  const cls = { electric: "text-electric", amber: "text-amber-300", emerald: "text-emerald-300", silver: "text-silver" }[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="glass-strong rounded-2xl p-4"
    >
      <div className="flex items-center justify-between">
        <Icon className={`h-5 w-5 ${cls}`} />
        <ShieldCheck className="h-3 w-3 text-silver-dim/60" />
      </div>
      <div className="mt-3 font-display text-2xl sm:text-3xl font-bold">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-widest text-silver-dim">{label}</div>
    </motion.div>
  );
}

function StatusChart({ title, data, icon: Icon }: { title: string; data: Record<string, number>; icon: typeof BarChart3 }) {
  const entries = Object.entries(data);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div className="glass-strong rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-4 w-4 text-electric" />
        <div className="font-semibold">{title}</div>
      </div>
      <div className="space-y-3">
        {entries.length === 0 && <div className="text-silver-dim text-sm">No data yet.</div>}
        {entries.map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-mono uppercase text-silver">{k}</span>
              <span className="text-silver-dim">{v}</span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(v / max) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-electric to-electric-glow"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
