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
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo size={40} showText={true} subtitle="Aircraft Parts Supplier" />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-medium text-white/80 transition hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBell(!bell)}
              className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              onClick={() => setOpen(true)}
              className="rounded-xl p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-slate-950 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <BrandLogo size={36} showText={true} subtitle="Aircraft Parts Supplier" />
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-xl p-2 text-white/80 hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-4">
                {NAV.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="text-base font-medium text-white/80 transition hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <RfqDialog open={rfqOpen} onOpenChange={setRfqOpen} />
    </>
  );
}
