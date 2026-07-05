import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { X, Send, CheckCircle2, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { submitRfq } from "@/lib/rfq.functions";

export type RfqPrefill = Partial<{
  part_number: string;
  part_name: string;
  manufacturer: string;
  aircraft: string;
  condition: string;
  quantity: number;
}>;

type Props = {
  open: boolean;
  onClose: () => void;
  prefill?: RfqPrefill;
};

export function RfqDialog({ open, onClose, prefill }: Props) {
  const submit = useServerFn(submitRfq);
  const [form, setForm] = useState({
    part_number: "", part_name: "", manufacturer: "", aircraft: "",
    condition: "New", quantity: "1",
    buyer_name: "", buyer_email: "", buyer_company: "", notes: "",
  });
  const [busy, setBusy] = useState(false);
  const [lead, setLead] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLead(null);
    setForm((f) => ({
      ...f,
      part_number: prefill?.part_number ?? "",
      part_name: prefill?.part_name ?? "",
      manufacturer: prefill?.manufacturer ?? "",
      aircraft: prefill?.aircraft ?? "",
      condition: prefill?.condition ?? "New",
      quantity: String(prefill?.quantity ?? 1),
    }));
  }, [open, prefill]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.part_number.trim()) return toast.error("Part number is required");
    if (!form.buyer_email.trim()) return toast.error("Your email is required so vendors can respond");
    setBusy(true);
    try {
      const res = await submit({ data: { ...form, quantity: Number(form.quantity) || 1 } });
      setLead(res.leadId);
      toast.success(`RFQ received — ${res.leadId}`);
    } catch (err) {
      toast.error((err as Error).message ?? "Could not submit RFQ");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur grid place-items-center px-3 py-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="glass-strong rounded-2xl w-full max-w-2xl p-5 sm:p-7 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-electric to-electric-glow">
                <Zap className="h-4 w-4 text-navy-deep" />
              </span>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-electric">Request for Quote</div>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  {prefill?.part_number ? `Quote ${prefill.part_number}` : "Submit an RFQ"}
                </h3>
              </div>
            </div>

            {lead ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center"
              >
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-300" />
                <div className="mt-3 text-lg font-semibold">RFQ delivered</div>
                <p className="mt-1 text-sm text-silver">
                  Your Lead ID is{" "}
                  <span className="font-mono font-semibold text-emerald-200">{lead}</span>.
                  Verified vendors are being notified now.
                </p>
                <button
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 py-2.5 text-sm font-semibold text-navy-deep"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="mt-5 grid gap-2.5 sm:grid-cols-2">
                <F label="Part Number *" v={form.part_number} on={(v) => setForm({ ...form, part_number: v })} />
                <F label="Part Name" v={form.part_name} on={(v) => setForm({ ...form, part_name: v })} />
                <F label="Manufacturer" v={form.manufacturer} on={(v) => setForm({ ...form, manufacturer: v })} />
                <F label="Aircraft" v={form.aircraft} on={(v) => setForm({ ...form, aircraft: v })} />
                <F label="Condition" v={form.condition} on={(v) => setForm({ ...form, condition: v })} />
                <F label="Quantity" v={form.quantity} on={(v) => setForm({ ...form, quantity: v })} type="number" />
                <div className="sm:col-span-2 h-px bg-white/5 my-1" />
                <F label="Your Name" v={form.buyer_name} on={(v) => setForm({ ...form, buyer_name: v })} />
                <F label="Your Email *" v={form.buyer_email} on={(v) => setForm({ ...form, buyer_email: v })} type="email" />
                <F label="Company" v={form.buyer_company} on={(v) => setForm({ ...form, buyer_company: v })} full />
                <div className="sm:col-span-2">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">Notes</span>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    placeholder="AOG timing, delivery preferences…"
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm focus:outline-none focus:border-electric"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="sm:col-span-2 mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-electric to-electric-glow px-5 py-3 text-sm font-semibold text-navy-deep disabled:opacity-60"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {busy ? "Submitting…" : "Submit RFQ"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function F({
  label, v, on, type = "text", full,
}: { label: string; v: string; on: (s: string) => void; type?: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="block font-mono text-[10px] uppercase tracking-widest text-silver-dim mb-1 px-1">{label}</span>
      <input
        type={type}
        value={v}
        onChange={(e) => on(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5 text-sm focus:outline-none focus:border-electric focus:bg-white/10"
      />
    </label>
  );
}
