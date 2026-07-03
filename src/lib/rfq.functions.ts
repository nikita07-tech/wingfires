import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RfqInput = z.object({
  part_number: z.string().trim().min(1).max(64),
  part_name: z.string().trim().max(120).optional().default(""),
  aircraft: z.string().trim().max(80).optional().default(""),
  manufacturer: z.string().trim().max(80).optional().default(""),
  quantity: z.coerce.number().int().min(1).max(9999).default(1),
  condition: z.string().trim().max(40).optional().default("New"),
  buyer_name: z.string().trim().max(120).optional().default(""),
  buyer_email: z.string().trim().email().max(200).optional().or(z.literal("")).default(""),
  buyer_company: z.string().trim().max(160).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

function makeLeadId() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `WF-${y}${m}${d}-${rand}`;
}

async function pushToGoogleSheet(row: (string | number)[]) {
  const sheetId = process.env.RFQ_SHEET_ID;
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gKey = process.env.GOOGLE_SHEETS_API_KEY;
  if (!sheetId || !lovableKey || !gKey) {
    console.warn("[rfq] Google Sheets not configured, skipping");
    return { skipped: true };
  }
  const range = "Sheet1!A1";
  const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": gKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [row] }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[rfq] Sheets append failed", res.status, body);
    return { skipped: false, ok: false, status: res.status };
  }
  return { skipped: false, ok: true };
}

export const submitRfq = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RfqInput.parse(data))
  .handler(async ({ data }) => {
    const leadId = makeLeadId();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("rfqs").insert({
      lead_id: leadId,
      part_number: data.part_number,
      part_name: data.part_name || null,
      aircraft: data.aircraft || null,
      manufacturer: data.manufacturer || null,
      quantity: data.quantity,
      condition: data.condition || null,
      buyer_name: data.buyer_name || null,
      buyer_email: data.buyer_email || null,
      buyer_company: data.buyer_company || null,
      notes: data.notes || null,
    });
    if (error) {
      console.error("[rfq] insert failed", error);
      throw new Error("Could not save RFQ");
    }

    // Fire-and-forget log to Google Sheets
    const created = new Date().toISOString();
    const sheetResult = await pushToGoogleSheet([
      leadId,
      created,
      data.part_number,
      data.part_name,
      data.manufacturer,
      data.aircraft,
      data.quantity,
      data.condition,
      data.buyer_name,
      data.buyer_email,
      data.buyer_company,
      data.notes,
      "open",
    ]);

    return { leadId, sheet: sheetResult };
  });
