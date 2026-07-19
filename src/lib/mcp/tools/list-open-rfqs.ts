import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForCaller } from "../supabase";

export default defineTool({
  name: "list_open_rfqs",
  title: "List open RFQs",
  description: "List currently open Wing Fires RFQs (aircraft parts requests) that vendors can quote on. Returns buyer_company and part details; buyer PII is excluded by RLS.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(25).describe("Max RFQs to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForCaller(ctx);
    const { data, error } = await supabase
      .from("rfqs")
      .select("id, lead_id, part_number, part_name, aircraft, manufacturer, quantity, condition, buyer_company, created_at, status")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { rfqs: data ?? [] },
    };
  },
});
