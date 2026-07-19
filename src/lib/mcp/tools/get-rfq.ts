import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForCaller } from "../supabase";

export default defineTool({
  name: "get_rfq",
  title: "Get RFQ details",
  description: "Fetch the full public details of a single Wing Fires RFQ by its UUID.",
  inputSchema: {
    rfq_id: z.string().uuid().describe("The RFQ UUID."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ rfq_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForCaller(ctx);
    const { data, error } = await supabase
      .from("rfqs")
      .select("id, lead_id, part_number, part_name, aircraft, manufacturer, quantity, condition, buyer_company, notes, created_at, status")
      .eq("id", rfq_id)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "RFQ not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { rfq: data },
    };
  },
});
