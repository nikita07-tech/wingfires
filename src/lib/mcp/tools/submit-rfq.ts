import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForCaller } from "../supabase";

export default defineTool({
  name: "submit_rfq",
  title: "Submit RFQ",
  description: "Create a new Wing Fires Request For Quote (RFQ) as the signed-in user. Returns the generated Lead ID.",
  inputSchema: {
    part_number: z.string().min(1).max(120).describe("Part number."),
    part_name: z.string().max(200).default("").describe("Human-readable part name."),
    aircraft: z.string().max(120).default("").describe("Aircraft type, e.g. 'A320neo'."),
    manufacturer: z.string().max(120).default("").describe("OEM/manufacturer."),
    quantity: z.number().int().min(1).default(1).describe("Quantity required."),
    condition: z.string().max(30).default("NE").describe("NE / NS / OH / SV / AR."),
    buyer_company: z.string().min(1).max(200).describe("Buyer company name."),
    buyer_name: z.string().max(200).default("").describe("Contact person."),
    buyer_email: z.string().email().describe("Contact email."),
    notes: z.string().max(2000).default("").describe("Additional notes."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForCaller(ctx);
    const now = new Date();
    const yy = String(now.getUTCFullYear()).slice(-2);
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    const lead_id = `WF-${yy}${mm}${dd}-${rand}`;

    const { data, error } = await supabase.from("rfqs").insert({
      lead_id,
      part_number: input.part_number,
      part_name: input.part_name || null,
      aircraft: input.aircraft || null,
      manufacturer: input.manufacturer || null,
      quantity: input.quantity,
      condition: input.condition || null,
      buyer_company: input.buyer_company,
      buyer_name: input.buyer_name || null,
      buyer_email: input.buyer_email,
      notes: input.notes || null,
      status: "open",
    }).select("id, lead_id, created_at").maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `RFQ created with Lead ID ${data?.lead_id}` }],
      structuredContent: { rfq: data },
    };
  },
});
