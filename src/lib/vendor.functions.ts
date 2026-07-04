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
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listMyQuotes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("quotes")
      .select("id, rfq_id, price, currency, lead_time, stock_qty, shipping, warranty, certificate, notes, status, created_at, updated_at, rfqs(lead_id, part_number, part_name)")
      .order("updated_at", { ascending: false })
      .limit(200);
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

const QuoteUpdate = QuoteInput.extend({ id: z.string().uuid() });

export const updateQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => QuoteUpdate.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("quotes")
      .update({
        price: data.price,
        currency: data.currency,
        lead_time: data.lead_time,
        stock_qty: data.stock_qty,
        shipping: data.shipping || null,
        warranty: data.warranty || null,
        certificate: data.certificate || null,
        notes: data.notes || null,
        status: "submitted",
      })
      .eq("id", data.id)
      .eq("vendor_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const vendorAnalytics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [{ count: openRfqs }, { data: myQuotes }] = await Promise.all([
      context.supabase.from("rfqs").select("id", { count: "exact", head: true }).eq("status", "open"),
      context.supabase.from("quotes").select("status, price, currency"),
    ]);
    const counts = { submitted: 0, accepted: 0, won: 0, rejected: 0 } as Record<string, number>;
    let totalValue = 0;
    for (const q of myQuotes ?? []) {
      counts[q.status] = (counts[q.status] ?? 0) + 1;
      if (q.status === "won") totalValue += Number(q.price) || 0;
    }
    return {
      openRfqs: openRfqs ?? 0,
      totalQuotes: myQuotes?.length ?? 0,
      counts,
      wonValue: totalValue,
    };
  });
