import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

const PHONE = "919149950141"; // +91 91499 50141
const DEFAULT_MSG =
  "Hi Wing Fires 👋 I'm interested in aircraft parts / RFQ. Could you please assist me?";

const QUICK: { label: string; msg: string }[] = [
  { label: "Request a Quote (RFQ)", msg: "Hi Wing Fires, I'd like to request a quote for an aircraft part. Part number: ___, Aircraft: ___, Qty: ___." },
  { label: "AOG — Urgent Support", msg: "🚨 AOG Support needed. Aircraft: ___, Part: ___, Location: ___. Please respond ASAP." },
  { label: "Become a Vendor", msg: "Hello, I'd like to onboard as a verified vendor on Wing Fires. Company: ___, Capabilities: ___." },
  { label: "General Enquiry", msg: DEFAULT_MSG },
];

function waLink(msg: string) {
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
}

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="w-[86vw] max-w-sm rounded-2xl glass-strong overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]"
          >
            <div className="bg-gradient-to-br from-[#25D366] to-[#128C7E] px-4 py-3.5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/20 backdrop-blur">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-sm text-white">Wing Fires Support</div>
                <div className="text-[11px] text-white/85 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse-glow" />
                  Typically replies in minutes
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
              <div className="rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm text-silver">
                Hi there 👋 How can we help you today? Pick a topic or start a chat.
              </div>
              {QUICK.map((q, i) => (
                <motion.a
                  key={q.label}
                  href={waLink(q.msg)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-[#25D366]/15 hover:border-[#25D366]/40 px-3.5 py-2.5 text-sm transition"
                >
                  <span className="text-silver group-hover:text-foreground">{q.label}</span>
                  <Send className="h-3.5 w-3.5 text-[#25D366] opacity-0 group-hover:opacity-100 transition -rotate-12" />
                </motion.a>
              ))}
              <a
                href={waLink(DEFAULT_MSG)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[#25D366] to-[#128C7E] px-4 py-3 text-sm font-semibold text-white shadow-lg"
              >
                <MessageCircle className="h-4 w-4" /> Start WhatsApp Chat
              </a>
              <div className="pt-1 text-center text-[11px] text-silver-dim font-mono">
                +91 91499 50141
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-[0_10px_30px_-5px_rgba(37,211,102,0.6)]"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping" />
        <span className="absolute -top-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-navy-deep">1</span>
        {open ? <X className="h-6 w-6 relative" /> : <MessageCircle className="h-7 w-7 relative" />}
      </motion.button>
    </div>
  );
}
