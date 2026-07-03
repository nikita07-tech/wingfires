import { motion } from "framer-motion";
import {
  Cog, Disc, Circle, Wrench, Gauge, Cpu, Plane, Zap, Fuel, Wind,
  Bolt, Filter, Layers, Battery, Lightbulb, Box, RotateCw, Package,
  Truck, Hammer, Boxes, Radio, ShieldCheck, Globe, Clock, Award,
  CheckCircle2, ArrowRight, Star, Quote, PlaneTakeoff, Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import turbineBlade from "@/assets/part-turbine-blade.jpg";
import avionics from "@/assets/part-avionics.jpg";
import landingGear from "@/assets/part-landing-gear.jpg";
import apu from "@/assets/part-apu.jpg";
import hydraulic from "@/assets/part-hydraulic.jpg";
import brake from "@/assets/part-brake.jpg";

/* ------------------------------ SECTION SHELL ----------------------------- */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: string }) {
  return (
    <div className="max-w-3xl">
      <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-electric">
        <span className="h-1 w-1 rounded-full bg-electric" /> {eyebrow}
      </div>
      <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {sub && <p className="mt-4 text-silver-dim text-lg">{sub}</p>}
    </div>
  );
}

/* --------------------------------- CATALOG -------------------------------- */
type Category = { icon: LucideIcon; name: string; count: string; brands: string; img?: string };

const FEATURED_CATEGORIES: Category[] = [
  { icon: Cog, name: "Engine Components", count: "3,240 parts", brands: "GE · P&W · Rolls-Royce", img: turbineBlade },
  { icon: Cpu, name: "Avionics & Controls", count: "1,540 parts", brands: "Collins · Honeywell · Thales", img: avionics },
  { icon: PlaneTakeoff, name: "Landing Gear", count: "540 parts", brands: "Safran · Liebherr", img: landingGear },
  { icon: Cog, name: "APU Systems", count: "180 units", brands: "Honeywell · P&WC", img: apu },
  { icon: Gauge, name: "Hydraulic Systems", count: "812 parts", brands: "Parker · Eaton", img: hydraulic },
  { icon: Disc, name: "Wheels & Brakes", count: "670 parts", brands: "Meggitt · Honeywell", img: brake },
];

const MORE_CATEGORIES: Category[] = [
  { icon: RotateCw, name: "Turbine Blades", count: "1,120", brands: "GE · Safran" },
  { icon: Circle, name: "Bearings", count: "980", brands: "SKF · Timken" },
  { icon: Plane, name: "Flight Controls", count: "430", brands: "Moog · Parker" },
  { icon: Zap, name: "Electrical", count: "2,100", brands: "Safran · Astronics" },
  { icon: Box, name: "Cabin Equipment", count: "760", brands: "Recaro · Zodiac" },
  { icon: Fuel, name: "Fuel Systems", count: "390", brands: "Parker · Woodward" },
  { icon: Wind, name: "Pneumatic", count: "310", brands: "Liebherr" },
  { icon: Bolt, name: "Fasteners", count: "9,800", brands: "LISI · Alcoa" },
  { icon: Filter, name: "Filters", count: "1,240", brands: "Pall · Donaldson" },
  { icon: Layers, name: "Gaskets & Seals", count: "3,100", brands: "Trelleborg" },
  { icon: Battery, name: "Batteries", count: "280", brands: "Saft · Concorde" },
  { icon: Lightbulb, name: "Lighting", count: "540", brands: "Collins" },
  { icon: Package, name: "Airframe", count: "620", brands: "Boeing · Airbus" },
  { icon: Plane, name: "Propellers", count: "210", brands: "Hartzell" },
  { icon: Truck, name: "GSE", count: "340", brands: "TLD · JBT" },
  { icon: Hammer, name: "Tooling", count: "1,800", brands: "Snap-on" },
  { icon: Boxes, name: "Consumables", count: "12,400", brands: "Henkel · 3M" },
  { icon: Radio, name: "Comm Systems", count: "460", brands: "Collins" },
];

export function Catalog() {
  return (
    <section id="catalog" className="relative py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Parts Catalog"
          title={<>Every category. <span className="text-gradient-electric">One marketplace.</span></>}
          sub="From turbine blades to consumables — browse 24 certified categories with live inventory from vendors worldwide."
        />

        {/* Featured category cards with imagery */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CATEGORIES.map((c, i) => (
            <motion.a
              key={c.name}
              href="#catalog"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group relative overflow-hidden glass-strong rounded-2xl hover:border-electric/50 transition-all hover:-translate-y-1"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent" />
                <div className="absolute top-3 left-3 rounded-md glass px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-electric">
                  Certified
                </div>
                <div className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-lg glass-strong">
                  <c.icon className="h-4 w-4 text-electric" />
                </div>
              </div>
              <div className="relative p-5">
                <div className="font-semibold text-lg leading-tight">{c.name}</div>
                <div className="mt-1 font-mono text-[11px] text-electric">{c.count} · in stock</div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-silver-dim">{c.brands}</div>
                  <span className="inline-flex items-center gap-1 text-xs text-silver group-hover:text-electric transition">
                    Browse <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Compact category tiles */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {MORE_CATEGORIES.map((c, i) => (
            <motion.a
              key={c.name}
              href="#catalog"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.03 }}
              className="group relative overflow-hidden glass rounded-xl p-4 hover:bg-white/10 hover:border-electric/40 transition"
            >
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 group-hover:border-electric/50 transition">
                <c.icon className="h-4 w-4 text-electric" />
              </div>
              <div className="mt-3 font-semibold text-sm leading-tight">{c.name}</div>
              <div className="mt-0.5 font-mono text-[10px] text-silver-dim">{c.count} parts</div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FEATURED PARTS ------------------------------ */
type Part = {
  pn: string; name: string; mfr: string; ac: string; cond: string;
  cert: string; eta: string; stock: string; img: string; price: string;
};
const PARTS: Part[] = [
  { pn: "2214M91G01", name: "HPT Blade — Stage 1", mfr: "GE Aerospace", ac: "A320neo · LEAP-1A", cond: "New", cert: "FAA 8130-3", eta: "24-48h", stock: "In Stock", img: turbineBlade, price: "$4,850" },
  { pn: "AV-3450-27B", name: "Avionics Control Unit", mfr: "Collins Aerospace", ac: "B737 MAX", cond: "Overhauled", cert: "EASA Form 1", eta: "3-5 days", stock: "12 units", img: avionics, price: "$12,400" },
  { pn: "LG-77-4412", name: "Main Landing Gear Actuator", mfr: "Safran", ac: "A350-900", cond: "Serviceable", cert: "FAA · OEM", eta: "5-7 days", stock: "3 units", img: landingGear, price: "$38,200" },
  { pn: "APU-131-9A", name: "APU Controller", mfr: "Honeywell", ac: "B777 · B787", cond: "New", cert: "OEM · FAA", eta: "Same day", stock: "AOG Ready", img: apu, price: "$21,900" },
  { pn: "HYD-2210-P", name: "Hydraulic Pump Assy", mfr: "Parker Aerospace", ac: "A330 · A340", cond: "Overhauled", cert: "EASA · FAA", eta: "48h", stock: "8 units", img: hydraulic, price: "$7,650" },
  { pn: "BRK-A320-M", name: "Carbon Brake Assembly", mfr: "Meggitt", ac: "A320 Family", cond: "New", cert: "FAA 8130-3", eta: "72h", stock: "In Stock", img: brake, price: "$16,300" },
];

const CONDITION_COLOR: Record<string, string> = {
  New: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  Overhauled: "bg-electric/15 text-electric-glow border-electric/30",
  Serviceable: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  "As Removed": "bg-white/10 text-silver border-white/20",
};

export function FeaturedParts() {
  return (
    <section id="featured" className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-surface/30 to-transparent">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <SectionHeader
            eyebrow="Featured Inventory"
            title={<>Trending parts, <span className="text-gradient-silver">ready to ship.</span></>}
          />
          <div className="flex flex-wrap gap-2">
            {["All", "Airbus", "Boeing", "Engines", "Avionics"].map((f, i) => (
              <button key={f} className={`rounded-full px-4 py-1.5 text-xs border transition ${i === 0 ? "bg-electric text-navy-deep border-electric" : "glass text-silver hover:text-foreground border-white/10"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PARTS.map((p, i) => (
            <motion.article
              key={p.pn}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              className="group glass-strong rounded-2xl overflow-hidden hover:border-electric/50 transition-all hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-15px_rgba(96,165,250,0.35)]"
            >
              <div className="relative h-52 overflow-hidden bg-navy-deep">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className={`rounded-md border px-2 py-0.5 text-[10px] font-medium ${CONDITION_COLOR[p.cond]}`}>{p.cond}</span>
                </div>
                <div className="absolute top-3 right-3 rounded-md glass px-2 py-0.5 text-[10px] font-mono text-silver">
                  {p.stock}
                </div>
                <div className="absolute bottom-3 left-3 rounded-lg glass-strong px-3 py-1.5">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">From</div>
                  <div className="font-display text-lg font-bold text-electric-glow leading-none">{p.price}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="font-mono text-[11px] text-silver-dim">{p.pn}</div>
                <div className="mt-1 font-semibold text-lg leading-tight">{p.name}</div>
                <div className="mt-2 text-sm text-silver-dim">{p.mfr}</div>
                <div className="mt-3 flex items-center gap-3 text-xs text-silver">
                  <Plane className="h-3.5 w-3.5 text-electric" /> {p.ac}
                </div>
                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-[11px] text-silver-dim">
                    <ShieldCheck className="h-3.5 w-3.5 text-electric" /> {p.cert}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-silver-dim">
                    <Clock className="h-3.5 w-3.5" /> {p.eta}
                  </div>
                </div>
                <a href="#rfq" className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-electric hover:to-electric-glow hover:text-navy-deep py-2.5 text-sm font-semibold transition">
                  Request Quote <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
const MODELS = [
  "Airbus A320", "Airbus A330", "Airbus A350", "Boeing 737", "Boeing 747",
  "Boeing 777", "Boeing 787", "ATR 72", "Bombardier", "Embraer E-Jets",
  "Gulfstream G650", "Dassault Falcon", "Cessna Citation", "Bell 429",
  "Leonardo AW139", "Sikorsky S-92",
];

export function Aircraft() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Fleet Coverage"
          title={<>Parts for every <span className="text-gradient-electric">aircraft family.</span></>}
          sub="From narrow-body workhorses to business jets and rotor-wing — inventory mapped to your fleet."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          {MODELS.map((m, i) => (
            <motion.div
              key={m}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 8) * 0.03 }}
              className="group glass rounded-2xl p-5 hover:border-electric/40 hover:-translate-y-0.5 transition-all"
            >
              <Plane className="h-6 w-6 text-silver-dim group-hover:text-electric transition-colors" />
              <div className="mt-3 font-semibold">{m}</div>
              <div className="mt-1 font-mono text-[11px] text-silver-dim">
                Engines · Airframe · Avionics
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- HOW IT WORKS ------------------------------- */
const STEPS = [
  { icon: Search, title: "Search Parts", text: "Browse 12,000+ SKUs or submit a Part Number directly." },
  { icon: Zap, title: "Submit RFQ", text: "One form reaches every matched verified vendor instantly." },
  { icon: Radio, title: "Vendors Respond", text: "Receive multiple quotes with price, lead time and certs." },
  { icon: CheckCircle2, title: "Compare & Award", text: "Side-by-side comparison. Award the best offer in a click." },
  { icon: ShieldCheck, title: "Secure Purchase", text: "Escrow-protected payment with full documentation." },
  { icon: Truck, title: "Global Delivery", text: "AOG logistics, DGR-compliant packaging, worldwide." },
];

export function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-transparent via-surface/30 to-transparent">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Procurement Flow"
          title={<>From RFQ to <span className="text-gradient-electric">wheels-up</span> in 6 steps.</>}
        />
        <div className="mt-16 relative">
          <div className="hidden lg:block absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-electric/40 to-transparent" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <div className="relative grid h-16 w-16 place-items-center rounded-2xl glass-strong border-electric/30">
                  <s.icon className="h-7 w-7 text-electric" />
                  <div className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-electric to-electric-glow font-mono text-[10px] font-bold text-navy-deep">
                    {i + 1}
                  </div>
                </div>
                <div className="mt-4 font-semibold">{s.title}</div>
                <div className="mt-1.5 text-sm text-silver-dim">{s.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- WHY / SERVICES ----------------------------- */
const SERVICES = [
  { icon: ShieldCheck, title: "OEM & PMA Parts", text: "Genuine OEM plus certified PMA alternatives." },
  { icon: Wrench, title: "Repair & Overhaul", text: "Vetted MRO partners across engines, avionics, LG." },
  { icon: Zap, title: "AOG Emergency", text: "24/7 desk. Wheels-up within hours, not days." },
  { icon: Boxes, title: "Inventory Management", text: "Consignment, pooling and just-in-time delivery." },
  { icon: Globe, title: "Global Logistics", text: "DGR handling, customs clearance, door-to-hangar." },
  { icon: Award, title: "Inspection & Testing", text: "In-house inspection to FAA / EASA standards." },
  { icon: CheckCircle2, title: "Documentation", text: "8130-3, EASA Form 1, ATA-100, trace to birth." },
  { icon: Package, title: "Supply Chain", text: "End-to-end programs for airlines & operators." },
];

export function Services() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Services"
          title={<>An operating system for <span className="text-gradient-silver">aviation supply chains.</span></>}
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 4) * 0.06 }}
              className="glass rounded-2xl p-6 hover:border-electric/40 hover:bg-white/10 transition"
            >
              <s.icon className="h-6 w-6 text-electric" />
              <div className="mt-4 font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-silver-dim">{s.text}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- MANUFACTURERS -------------------------------- */
const BRANDS = [
  "BOEING", "AIRBUS", "HONEYWELL", "COLLINS AEROSPACE", "SAFRAN",
  "GE AEROSPACE", "PRATT & WHITNEY", "ROLLS-ROYCE", "PARKER",
  "EATON", "LIEBHERR", "MEGGITT",
];

export function Manufacturers() {
  return (
    <section className="relative py-20 border-y border-white/5 bg-surface/40">
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center">
          <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">
            Certified inventory from
          </div>
          <div className="mt-2 text-2xl font-semibold text-silver">
            The industry's most trusted manufacturers
          </div>
        </div>
        <div className="mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
          <div className="flex gap-14 animate-marquee whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className="font-display text-2xl font-bold tracking-widest text-silver-dim hover:text-silver transition">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TESTIMONIALS ------------------------------- */
const TESTIMONIALS = [
  { name: "Marcus Reinhardt", role: "Head of Procurement, Lufthansa Technik", text: "Wing Fires cut our RFQ turnaround from 3 days to under 4 hours. The vendor network is unmatched.", },
  { name: "Priya Nair", role: "AOG Manager, Emirates Engineering", text: "Sourced an APU controller for a grounded 777 at 2am. Wheels-up in 6 hours. That's the definition of AOG support.", },
  { name: "Alessandro Rossi", role: "Managing Director, Alitalia MRO", text: "Transparent quotes, verified certifications, and airtight documentation. This is how aviation procurement should work.", },
];

export function Testimonials() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Testimonials"
          title={<>Trusted by the teams keeping <span className="text-gradient-electric">fleets in the air.</span></>}
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-strong rounded-2xl p-7"
            >
              <Quote className="h-8 w-8 text-electric/60" />
              <p className="mt-4 text-silver leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3 pt-6 border-t border-white/5">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-electric to-electric-glow font-semibold text-navy-deep">
                  {t.name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-silver-dim">{t.role}</div>
                </div>
                <div className="ml-auto flex text-electric">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- CTA ----------------------------------- */
export function CTA() {
  return (
    <section id="vendor" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden glass-strong rounded-3xl p-10 md:p-16">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-electric/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-electric/10 blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Join the network</div>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold leading-tight">
                Ready to source smarter, or <span className="text-gradient-electric">sell to the world?</span>
              </h2>
              <p className="mt-4 text-silver-dim text-lg max-w-lg">
                Whether you're an airline, MRO, broker or vendor — get onboarded in under 48 hours with dedicated support.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#rfq" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-6 py-3.5 text-sm font-semibold text-navy-deep glow-electric">
                  Post an RFQ <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#" className="inline-flex items-center gap-2 rounded-xl border border-silver/30 px-6 py-3.5 text-sm font-semibold text-silver hover:border-silver/60 transition">
                  Apply as Vendor
                </a>
              </div>
            </div>
            <div className="space-y-3">
              {[
                ["48h", "Onboarding time"],
                ["< 4h", "Avg RFQ response"],
                ["99.7%", "Fulfillment rate"],
              ].map(([k, v]) => (
                <div key={v} className="flex items-baseline justify-between glass rounded-xl px-5 py-4">
                  <span className="font-display text-3xl font-bold text-gradient-silver">{k}</span>
                  <span className="text-sm text-silver-dim">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- FOOTER -------------------------------- */
export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-surface/40 pt-20 pb-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-glow">
                <Plane className="h-4.5 w-4.5 text-navy-deep" strokeWidth={2.5} />
              </div>
              <div className="font-display text-lg font-bold">Wing Fires</div>
            </div>
            <p className="mt-4 text-sm text-silver-dim max-w-xs">
              The global marketplace for certified aircraft parts. Trusted by 2,500+ vendors across 85+ countries.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex gap-2 max-w-sm">
              <input type="email" placeholder="Your work email" className="flex-1 rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm focus:outline-none focus:border-electric" />
              <button className="rounded-lg bg-gradient-to-br from-electric to-electric-glow px-4 py-2.5 text-sm font-semibold text-navy-deep">Subscribe</button>
            </form>
          </div>
          {[
            { h: "Marketplace", l: ["Browse Parts", "Categories", "Featured", "New Arrivals", "AOG Support"] },
            { h: "Solutions", l: ["Airlines", "MROs", "Brokers", "Leasing", "Vendors"] },
            { h: "Company", l: ["About", "Careers", "Press", "Blog", "Contact"] },
            { h: "Legal", l: ["Terms", "Privacy", "Cookies", "Compliance", "Security"] },
          ].map((col) => (
            <div key={col.h}>
              <div className="font-mono text-[10px] uppercase tracking-widest text-silver-dim">{col.h}</div>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.l.map((li) => (
                  <li key={li}><a href="#" className="text-silver hover:text-foreground transition">{li}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs text-silver-dim">
          <div id="footer">© {new Date().getFullYear()} Wing Fires. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-electric" /> FAA / EASA Compliant</span>
            <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-electric" /> 85+ Countries</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
