import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listOpenRfqs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("rfqs")
      .select("id, lead_id, part_number, part_name, aircraft, manufacturer, quantity, condition, buyer_company, created_at, status")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listMyQuotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("quotes")
      .select("id, rfq_id, price, currency, lead_time, stock_qty, shipping, warranty, certificate, created_at, rfqs(lead_id, part_number, part_name)")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const QuoteInput = z.object({
  rfq_id: z.string().uuid(),
  price: z.coerce.number().positive().max(99999999),
  currency: z.string().trim().min(1).max(6).default("USD"),
  lead_time: z.string().trim().min(1).max(60),
  stock_qty: z.coerce.number().int().min(0).max(999999),
  shipping: z.string().trim().max(120).optional().default(""),
  warranty: z.string().trim().max(120).optional().default(""),
  certificate: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

export const submitQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => QuoteInput.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("quotes").insert({
      rfq_id: data.rfq_id,
      vendor_id: context.userId,
      price: data.price,
      currency: data.currency,
      lead_time: data.lead_time,
      stock_qty: data.stock_qty,
      shipping: data.shipping || null,
      warranty: data.warranty || null,
      certificate: data.certificate || null,
      notes: data.notes || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
