import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, User, X, Zap } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { RfqDialog } from "./RfqDialog";

const NAV: { label: string; href: string }[] = [
  { label: "Search Parts", href: "/parts" },
  { label: "Categories", href: "/#catalog" },
  { label: "Featured", href: "/#featured" },
  { label: "Services", href: "/#services" },
  { label: "How it Works", href: "/#how" },
  { label: "Contact", href: "/#footer" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [rfqOpen, setRfqOpen] = useState(false);
  

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-3 sm:py-4"}`}
      >
        <div className="mx-auto max-w-7xl px-3 sm:px-4">
          <div
            className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-500 ${
              scrolled ? "glass-strong shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)]" : "glass"
            }`}
          >
            <Link to="/" className="flex items-center gap-2 min-w-0 shrink-0">
              <BrandLogo size={36} subtitle="Parts · RFQ · Global" />
            </Link>

            <div className="flex items-center gap-1.5">
              <nav className="hidden lg:flex items-center gap-0.5 mr-1">
                {NAV.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="rounded-md px-2.5 py-2 text-sm text-silver hover:text-foreground hover:bg-white/5 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <Link to="/vendor" className="rounded-md px-2.5 py-2 text-sm text-silver hover:text-foreground hover:bg-white/5">
                  Vendor
                </Link>
              </nav>

              <a
                href="/parts?focus=1"
                aria-label="Search parts"
                className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-silver hover:text-foreground hover:bg-white/5 transition"
              >
                <Search className="h-4 w-4" />
              </a>


              <div className="relative">
                <button
                  onClick={() => setBell((b) => !b)}
                  aria-label="Notifications"
                  className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-silver hover:text-foreground hover:bg-white/5 relative transition"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" />
                </button>
                <AnimatePresence>
                  {bell && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 mt-2 w-80 glass-strong rounded-2xl p-4 z-50"
                      onMouseLeave={() => setBell(false)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-sm">Live activity</div>
                        <span className="text-[10px] font-mono text-electric flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" /> LIVE
                        </span>
                      </div>
                      <div className="space-y-2.5 text-xs">
                        {[
                          ["RFQ", "New CFM56 blade request", "just now"],
                          ["Quote", "Lufthansa · APU controller", "12s ago"],
                          ["Delivered", "Landing gear seal · JFK", "1m ago"],
                          ["RFQ", "A320 brake assy · Emirates", "3m ago"],
                        ].map(([t, txt, time]) => (
                          <div key={txt} className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <span className="mr-1.5 rounded bg-electric/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-electric">{t}</span>
                              <span className="text-silver">{txt}</span>
                            </div>
                            <span className="font-mono text-[10px] text-silver-dim shrink-0">{time}</span>
                          </div>
                        ))}
                      </div>
                      <Link to="/vendor" className="mt-3 block text-center text-xs text-electric hover:underline">Open vendor portal →</Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/auth"
                aria-label="Sign in"
                className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-silver hover:text-foreground hover:bg-white/5 transition"
              >
                <User className="h-4 w-4" />
              </Link>

              <button
                onClick={() => setRfqOpen(true)}
                className="ml-1 hidden md:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-electric to-electric-glow px-3.5 py-2 text-sm font-semibold text-navy-deep hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-shadow"
              >
                <Zap className="h-3.5 w-3.5" /> Request Quote
              </button>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden grid h-9 w-9 place-items-center rounded-lg text-silver hover:bg-white/5 shrink-0"
                aria-label="Menu"
                aria-expanded={open}
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 260 }}
                className="lg:hidden mt-2 glass-strong rounded-2xl p-4 overflow-hidden"
              >
                <nav className="grid gap-1">
                  {NAV.map((item, i) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-3 text-sm text-silver hover:bg-white/5 hover:text-foreground"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <Link to="/vendor" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-silver hover:bg-white/5">Vendor Portal</Link>
                  <Link to="/auth" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-silver hover:bg-white/5">Sign in</Link>
                  <button
                    onClick={() => { setOpen(false); setRfqOpen(true); }}
                    className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-br from-electric to-electric-glow px-4 py-3 text-sm font-semibold text-navy-deep"
                  >
                    <Zap className="h-4 w-4" /> Request Quote
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      <RfqDialog open={rfqOpen} onClose={() => setRfqOpen(false)} />
    </>
  );
}
