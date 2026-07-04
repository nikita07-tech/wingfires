import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Bell, Menu, Search, User, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

const NAV: { label: string; href: string }[] = [
  { label: "Browse Parts", href: "/#catalog" },
  { label: "Categories", href: "/#catalog" },
  { label: "Featured", href: "/#featured" },
  { label: "Services", href: "/#services" },
  { label: "RFQ Portal", href: "/#rfq" },
  { label: "How it Works", href: "/#how" },
  { label: "Contact", href: "/#footer" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
            scrolled ? "glass-strong shadow-[0_10px_40px_-12px_rgba(0,0,0,0.5)]" : "glass"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-glow glow-electric">
              <Plane className="h-4.5 w-4.5 text-navy-deep" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="font-display text-base font-bold tracking-tight">Wing Fires</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Parts · RFQ · Global
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-silver hover:text-foreground hover:bg-white/5 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/vendor"
              className="rounded-md px-3 py-2 text-sm text-silver hover:text-foreground hover:bg-white/5 transition-colors"
            >
              Vendor Portal
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <a href="/#catalog" className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-silver hover:text-foreground hover:bg-white/5">
              <Search className="h-4 w-4" />
            </a>
            <button className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-silver hover:text-foreground hover:bg-white/5 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-electric animate-pulse-glow" />
            </button>
            <Link to="/auth" className="hidden sm:grid h-9 w-9 place-items-center rounded-lg text-silver hover:text-foreground hover:bg-white/5">
              <User className="h-4 w-4" />
            </Link>
            <a
              href="/#rfq"
              className="ml-1 hidden md:inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-electric to-electric-glow px-4 py-2 text-sm font-semibold text-navy-deep hover:shadow-[0_0_30px_rgba(96,165,250,0.5)] transition-shadow"
            >
              Request Quote
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden grid h-9 w-9 place-items-center rounded-lg text-silver hover:bg-white/5"
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
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="lg:hidden mt-2 glass-strong rounded-2xl p-4"
            >
              <nav className="grid gap-1">
                {NAV.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-2.5 text-sm text-silver hover:bg-white/5 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
                <Link
                  to="/vendor"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-silver hover:bg-white/5 hover:text-foreground"
                >
                  Vendor Portal
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-silver hover:bg-white/5 hover:text-foreground"
                >
                  Sign in
                </Link>
                <a
                  href="/#rfq"
                  onClick={() => setOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-electric to-electric-glow px-4 py-2.5 text-sm font-semibold text-navy-deep"
                >
                  Request Quote
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
