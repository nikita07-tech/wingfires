import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Package, MapPin, Tag, Loader2, ArrowRight, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Sections";

export const Route = createFileRoute("/parts")({
  head: () => ({
    meta: [
      { title: "Search Aircraft Parts Inventory · Wing Fires" },
      { name: "description", content: "Search 4,000+ in-stock aircraft engine parts — CFM56, CF6, GE LM6000, MS5001/MS7001EA. Filter by condition, asset type and warehouse. Instant RFQ." },
    ],
  }),
  component: PartsExplorer,
});

type Part = {
  pn: string; sn: string | null; name: string | null; cond: string | null;
  asset: string | null; qty: number; agency: string | null;
  trace: string | null; wh: string | null; src: string;
};

const PAGE = 48;

function PartsExplorer() {
  const [all, setAll] = useState<Part[] | null>(null);
  const [q, setQ] = useState("");
  const [cond, setCond] = useState<string>("");
  const [asset, setAsset] = useState<string>("");
  const [wh, setWh] = useState<string>("");
  const [visible, setVisible] = useState(PAGE);

  useEffect(() => {
    fetch("/parts.json")
      .then((r) => r.json())
      .then((rows: Part[]) => setAll(rows))
      .catch(() => setAll([]));
  }, []);

  const facets = useMemo(() => {
    if (!all) return { conds: [], assets: [], whs: [] };
    const u = (k: keyof Part) => {
      const s = new Set<string>();
      for (const r of all) { const v = r[k]; if (typeof v === "string" && v) s.add(v); }
      return Array.from(s).sort();
    };
    return { conds: u("cond"), assets: u("asset"), whs: u("wh") };
  }, [all]);

  const filtered = useMemo(() => {
    if (!all) return [];
    const query = q.trim().toLowerCase();
    return all.filter((r) => {
      if (cond && r.cond !== cond) return false;
      if (asset && r.asset !== asset) return false;
      if (wh && r.wh !== wh) return false;
      if (!query) return true;
      return (
        r.pn.toLowerCase().includes(query) ||
        (r.name?.toLowerCase().includes(query) ?? false) ||
        (r.sn?.toLowerCase().includes(query) ?? false) ||
        (r.asset?.toLowerCase().includes(query) ?? false) ||
        (r.agency?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [all, q, cond, asset, wh]);

  useEffect(() => { setVisible(PAGE); }, [q, cond, asset, wh]);

  const items = filtered.slice(0, visible);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 pb-16">
        <section className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Live Inventory · {all?.length.toLocaleString() ?? "…"} SKUs</div>
            <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">
              Search the <span className="text-gradient-electric">global aircraft parts</span> inventory.
            </h1>
            <p className="mt-4 text-silver-dim max-w-2xl">
              Every part below is available from verified Wing Fires vendors. Type a part number, keyword,
              serial number, or engine family — hit RFQ to get pricing in under 4 hours.
            </p>
          </motion.div>

          <div className="mt-8 glass-strong rounded-2xl p-4 md:p-5 sticky top-24 z-30 backdrop-blur">
            <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
              <label className="relative block">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-silver-dim" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search part number, keyword, serial, engine…"
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-3 text-sm placeholder:text-silver-dim/70 focus:outline-none focus:border-electric focus:bg-white/10 transition"
                />
              </label>
              <FacetSelect label="Condition" value={cond} onChange={setCond} options={facets.conds} icon={Tag} />
              <FacetSelect label="Engine / Asset" value={asset} onChange={setAsset} options={facets.assets} icon={Package} />
              <FacetSelect label="Warehouse" value={wh} onChange={setWh} options={facets.whs} icon={MapPin} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-silver-dim px-1">
              <div className="flex items-center gap-2"><Filter className="h-3.5 w-3.5 text-electric" /> {filtered.length.toLocaleString()} results {q && <>for <span className="text-foreground font-mono">"{q}"</span></>}</div>
              {(cond || asset || wh || q) && (
                <button onClick={() => { setQ(""); setCond(""); setAsset(""); setWh(""); }} className="hover:text-foreground underline">Clear filters</button>
              )}
            </div>
          </div>

          {all === null && (
            <div className="mt-10 flex items-center justify-center gap-2 text-silver-dim">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading 4,000+ parts…
            </div>
          )}

          {all && filtered.length === 0 && (
            <div className="mt-10 glass rounded-2xl p-10 text-center">
              <p className="text-silver">No matches. Try a partial part number or the engine family.</p>
              <Link to="/" hash="rfq" className="inline-flex items-center gap-2 mt-4 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 py-2.5 text-sm font-semibold text-navy-deep">
                Send us an RFQ <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <motion.article
                  key={`${p.pn}-${p.sn ?? i}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: Math.min((i % PAGE) * 0.012, 0.35) }}
                  className="group relative glass rounded-2xl p-4 hover:border-electric/40 hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] text-electric truncate">{p.pn}</div>
                      <div className="mt-1 font-semibold text-sm leading-tight line-clamp-2">
                        {p.name || "Aircraft component"}
                      </div>
                    </div>
                    <CondBadge cond={p.cond} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-1.5 text-[11px] text-silver-dim">
                    {p.asset && <Row label="Asset" value={p.asset} />}
                    {p.wh && <Row label="WH" value={p.wh} />}
                    {p.sn && <Row label="S/N" value={p.sn} />}
                    <Row label="Qty" value={String(p.qty || 1)} />
                  </div>
                  {p.agency && (
                    <div className="mt-3 rounded-lg bg-white/[0.04] border border-white/5 px-2.5 py-1.5 text-[10px] font-mono text-silver truncate" title={p.agency}>
                      Tag: {p.agency}
                    </div>
                  )}
                  <Link
                    to="/"
                    hash="rfq"
                    className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-electric to-electric-glow py-2 text-xs font-semibold text-navy-deep hover:shadow-[0_0_24px_rgba(96,165,250,0.5)] transition"
                  >
                    Request Quote <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {all && visible < filtered.length && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE)}
                className="inline-flex items-center gap-2 glass-strong rounded-xl px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Load {Math.min(PAGE, filtered.length - visible)} more · {(filtered.length - visible).toLocaleString()} remaining
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FacetSelect({
  label, value, onChange, options, icon: Icon,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; icon: typeof Filter }) {
  return (
    <label className="relative block">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-silver-dim" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 pl-10 pr-8 py-3 text-sm focus:outline-none focus:border-electric transition"
      >
        <option value="" className="bg-navy">All {label.toLowerCase()}</option>
        {options.map((o) => <option key={o} value={o} className="bg-navy">{o}</option>)}
      </select>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5 min-w-0">
      <span className="text-[9px] font-mono uppercase tracking-widest text-silver-dim/70">{label}</span>
      <span className="truncate text-silver text-[11px]">{value}</span>
    </div>
  );
}

function CondBadge({ cond }: { cond: string | null }) {
  if (!cond) return null;
  const c = cond.toUpperCase();
  const isNew = /NE|NEW/.test(c);
  const isOh = /OH|OVERHAUL/.test(c);
  const isTested = /TEST|SV|SERVICE/.test(c);
  const cls = isNew
    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
    : isOh
    ? "border-electric/40 bg-electric/10 text-electric"
    : isTested
    ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
    : "border-silver/30 bg-silver/5 text-silver";
  return (
    <span className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-semibold tracking-wider uppercase ${cls}`}>
      {cond}
    </span>
  );
}
