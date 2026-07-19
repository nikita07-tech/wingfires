import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

function stripBearerIfOpaque(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(init?.headers);
    if ((key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

export function supabaseForCaller(ctx: ToolContext): SupabaseClient {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const token = ctx.getToken();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      fetch: stripBearerIfOpaque(key),
    },
  });
}
