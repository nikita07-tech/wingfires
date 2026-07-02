import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Zap } from "lucide-react";
import turbine from "@/assets/hero-turbine.jpg";
import aircraft from "@/assets/aircraft-silhouette.png";

const STATS = [
  { label: "Aircraft Parts", value: "12,000+" },
  { label: "Verified Vendors", value: "2,500+" },
  { label: "Countries Served", value: "85+" },
  { label: "RFQ Support", value: "24/7" },
];

const TRUST = ["Verified Vendors", "OEM Parts", "FAA / EASA Certified", "Secure Transactions", "Global Logistics"];

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-hero pt-28 pb-16">
      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      {/* Rotating turbine */}
      <div className="pointer-events-none absolute -right-40 top-20 w-[720px] h-[720px] opacity-40 md:opacity-60">
        <div className="relative h-full w-full animate-float-slow">
          <img
            src={turbine}
            alt=""
            className="h-full w-full object-cover rounded-full animate-spin-slow"
            style={{ maskImage: "radial-gradient(circle, black 55%, transparent 72%)" }}
          />
        </div>
      </div>

      {/* Aircraft flying across */}
      <img
        src={aircraft}
        alt=""
        className="pointer-events-none absolute top-[18%] left-0 w-56 opacity-70 animate-fly-across drop-shadow-[0_10px_30px_rgba(96,165,250,0.4)]"
      />

      {/* Light streaks */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-0 h-px w-1/2 bg-gradient-to-r from-transparent via-electric to-transparent animate-streak" />
        <div className="absolute top-2/3 left-0 h-px w-1/3 bg-gradient-to-r from-transparent via-silver to-transparent animate-streak" style={{ animationDelay: "3s" }} />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-electric-glow animate-pulse-glow"
            style={{
              top: `${(i * 37) % 100}%`,
              left: `${(i * 53) % 100}%`,
              animationDelay: `${(i % 6) * 0.5}s`,
              opacity: 0.4 + ((i % 5) * 0.1),
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-electric" />
            <span className="text-silver">Trusted by 2,500+ MROs, airlines & brokers worldwide</span>
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight">
            The global marketplace for
            <span className="block text-gradient-electric">certified aircraft parts.</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg text-silver-dim">
            Source engine components, avionics, landing gear and consumables from verified vendors
            in 85+ countries. Instant RFQs, transparent quotes, AOG-ready in minutes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#rfq"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-6 py-3.5 text-sm font-semibold text-navy-deep glow-electric hover:scale-[1.02] transition-transform"
            >
              <Zap className="h-4 w-4" /> Get Instant Quote
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href="#catalog" className="inline-flex items-center gap-2 glass-strong rounded-xl px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition">
              Find Aircraft Parts
            </a>
            <a href="#vendor" className="inline-flex items-center gap-2 rounded-xl border border-silver/20 px-6 py-3.5 text-sm font-semibold text-silver hover:border-silver/40 transition">
              Become a Vendor
            </a>
          </div>
        </motion.div>

        {/* RFQ form */}
        <motion.form
          id="rfq"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onSubmit={(e) => e.preventDefault()}
          className="relative mt-12 glass-strong rounded-2xl p-4 md:p-5 max-w-5xl"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-electric animate-pulse-glow" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-silver-dim">
                Instant RFQ · Response in under 4 hours
              </span>
            </div>
            <span className="hidden md:inline font-mono text-[11px] text-silver-dim">SECURE · ENCRYPTED</span>
          </div>
          <div className="grid gap-2 md:grid-cols-[1.2fr_1fr_1fr_0.7fr_1fr_auto]">
            <RfqInput label="Part Number" placeholder="e.g. 2214M91G01" />
            <RfqInput label="Aircraft Model" placeholder="A320neo" />
            <RfqInput label="Manufacturer" placeholder="Honeywell" />
            <RfqInput label="Qty" placeholder="1" />
            <RfqSelect label="Condition" options={["New", "Overhauled", "Serviceable", "As Removed"]} />
            <button
              type="submit"
              className="grid h-full min-h-11 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 text-sm font-semibold text-navy-deep hover:shadow-[0_0_28px_rgba(96,165,250,0.6)]"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </motion.form>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="glass rounded-xl px-5 py-4"
            >
              <div className="font-display text-3xl font-bold text-gradient-silver">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-silver-dim">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-silver-dim">
          <span className="font-mono uppercase tracking-widest text-[10px]">Trusted for</span>
          {TRUST.map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-electric" /> {t}
            </span>
          ))}
        </div>
      </div>

      {/* Live activity feed */}
      <div className="pointer-events-none absolute bottom-6 right-6 hidden xl:block w-72">
        <div className="glass-strong rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">Live Activity</span>
            <span className="flex items-center gap-1.5 text-[10px] text-electric">
              <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" /> LIVE
            </span>
          </div>
          <div className="space-y-3 text-xs">
            {[
              ["RFQ", "Emirates · CFM56 blades", "just now"],
              ["Quote", "Lufthansa Technik → BA", "12s ago"],
              ["Delivered", "APU controller · JFK", "1m ago"],
              ["RFQ", "Delta · Landing gear seal", "2m ago"],
            ].map(([tag, text, time]) => (
              <div key={text} className="flex items-start justify-between gap-2">
                <div>
                  <span className="mr-2 rounded bg-electric/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-electric">
                    {tag}
                  </span>
                  <span className="text-silver">{text}</span>
                </div>
                <span className="font-mono text-[10px] text-silver-dim shrink-0">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RfqInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">{label}</span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-3 text-sm placeholder:text-silver-dim/70 focus:outline-none focus:border-electric focus:bg-white/10 transition"
      />
    </label>
  );
}
function RfqSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">{label}</span>
      <select className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-3 text-sm focus:outline-none focus:border-electric transition appearance-none">
        {options.map((o) => <option key={o} className="bg-navy">{o}</option>)}
      </select>
    </label>
  );
}
