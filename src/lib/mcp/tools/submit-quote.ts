import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForCaller } from "../supabase";

export default defineTool({
  name: "submit_quote",
  title: "Submit quote",
  description: "Submit a new vendor quote for a Wing Fires RFQ. The quote is created for the signed-in vendor.",
  inputSchema: {
    rfq_id: z.string().uuid().describe("Target RFQ UUID."),
    price: z.number().positive().describe("Unit price."),
    currency: z.string().min(1).max(6).default("USD").describe("ISO currency code."),
    lead_time: z.string().min(1).max(60).describe("Lead time, e.g. '2 weeks', 'AOG ex-stock'."),
    stock_qty: z.number().int().min(0).describe("Available quantity in stock."),
    shipping: z.string().max(120).default("").describe("Shipping terms/notes."),
    warranty: z.string().max(120).default("").describe("Warranty terms."),
    certificate: z.string().max(120).default("").describe("Certification (e.g. 8130-3, EASA Form 1)."),
    notes: z.string().max(2000).default("").describe("Additional notes."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForCaller(ctx);
    const { data, error } = await supabase.from("quotes").insert({
      rfq_id: input.rfq_id,
      vendor_id: ctx.getUserId(),
      price: input.price,
      currency: input.currency,
      lead_time: input.lead_time,
      stock_qty: input.stock_qty,
      shipping: input.shipping || null,
      warranty: input.warranty || null,
      certificate: input.certificate || null,
      notes: input.notes || null,
    }).select("id, rfq_id, status, created_at").maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Quote submitted: ${JSON.stringify(data)}` }],
      structuredContent: { quote: data },
    };
  },
});
