import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listOpenRfqsTool from "./tools/list-open-rfqs";
import getRfqTool from "./tools/get-rfq";
import listMyQuotesTool from "./tools/list-my-quotes";
import submitQuoteTool from "./tools/submit-quote";
import submitRfqTool from "./tools/submit-rfq";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "wing-fires-mcp",
  title: "Wing Fires MCP",
  version: "0.1.0",
  instructions:
    "Wing Fires is a B2B aircraft parts marketplace. Use these tools to list open RFQs, fetch RFQ details, review your submitted quotes, submit new quotes as the signed-in vendor, or create a new buyer RFQ. All actions run as the authenticated user under RLS.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listOpenRfqsTool, getRfqTool, listMyQuotesTool, submitQuoteTool, submitRfqTool],
});
