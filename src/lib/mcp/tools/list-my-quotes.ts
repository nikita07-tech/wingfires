import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForCaller } from "../supabase";

export default defineTool({
  name: "list_my_quotes",
  title: "List my quotes",
  description: "List the signed-in vendor's own quotes across all RFQs, newest first, with status (submitted/accepted/won/rejected).",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(25).describe("Max quotes to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForCaller(ctx);
    const { data, error } = await supabase
      .from("quotes")
      .select("id, rfq_id, price, currency, lead_time, stock_qty, shipping, warranty, certificate, notes, status, created_at, updated_at, rfqs(lead_id, part_number, part_name)")
      .order("updated_at", { ascending: false })
      .limit(limit);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { quotes: data ?? [] },
    };
  },
});
