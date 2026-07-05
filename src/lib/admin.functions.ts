import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Admin access required");
}

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const [rfqs, quotes, vendors] = await Promise.all([
      context.supabase.from("rfqs").select("id, status, created_at, part_number"),
      context.supabase.from("quotes").select("id, status, price, currency"),
      context.supabase.from("vendor_profiles").select("user_id, company_name, contact_name, country, created_at"),
    ]);
    const rfqRows = rfqs.data ?? [];
    const quoteRows = quotes.data ?? [];
    const vendorRows = vendors.data ?? [];

    const rfqStatus: Record<string, number> = {};
    for (const r of rfqRows) rfqStatus[r.status] = (rfqStatus[r.status] ?? 0) + 1;

    const quoteStatus: Record<string, number> = { submitted: 0, accepted: 0, won: 0, rejected: 0 };
    let wonValue = 0;
    for (const q of quoteRows) {
      quoteStatus[q.status] = (quoteStatus[q.status] ?? 0) + 1;
      if (q.status === "won") wonValue += Number(q.price) || 0;
    }

    const topParts: Record<string, number> = {};
    for (const r of rfqRows) topParts[r.part_number] = (topParts[r.part_number] ?? 0) + 1;
    const top = Object.entries(topParts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    const now = Date.now();
    const last7 = rfqRows.filter((r) => now - new Date(r.created_at).getTime() < 7 * 86400000).length;

    return {
      totals: { rfqs: rfqRows.length, quotes: quoteRows.length, vendors: vendorRows.length, wonValue, last7 },
      rfqStatus,
      quoteStatus,
      topParts: top,
      vendors: vendorRows.slice(0, 8),
    };
  });

export const listAllRfqs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data, error } = await context.supabase
      .from("rfqs")
      .select("id, lead_id, part_number, part_name, aircraft, manufacturer, quantity, condition, buyer_name, buyer_email, buyer_company, notes, status, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listRfqQuotes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ rfq_id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: rows, error } = await context.supabase
      .from("quotes")
      .select("id, price, currency, lead_time, stock_qty, shipping, warranty, certificate, status, vendor_id, created_at, vendor_profiles:vendor_id(company_name, contact_name)")
      .eq("rfq_id", data.rfq_id)
      .order("price", { ascending: true });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const UpdateRfqStatus = z.object({
  id: z.string().uuid(),
  status: z.enum(["open", "contacted", "quoted", "won", "lost"]),
});

export const updateRfqStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpdateRfqStatus.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("rfqs").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const UpdateQuoteStatus = z.object({
  id: z.string().uuid(),
  status: z.enum(["submitted", "accepted", "won", "rejected"]),
});

export const updateQuoteStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => UpdateQuoteStatus.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("quotes").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: !!data, userId: context.userId };
  });
