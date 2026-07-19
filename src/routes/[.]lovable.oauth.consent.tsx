import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/site/BrandLogo";

type OAuthResult = {
  data: {
    client?: { name?: string; client_id?: string } | null;
    redirect_url?: string;
    redirect_to?: string;
  } | null;
  error: { message: string } | null;
};

type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
  approveAuthorization: (id: string) => Promise<OAuthResult>;
  denyAuthorization: (id: string) => Promise<OAuthResult>;
};

function oauth(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } as never });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate } as never);
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Authorization error</h1>
        <p className="text-muted-foreground">{String((error as Error)?.message ?? error)}</p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-background">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <BrandLogo />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-2">
          Connect {clientName} to Wing Fires
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-8">
          {clientName} will be able to use Wing Fires tools as you — list RFQs,
          submit quotes, and access your vendor data under your account.
        </p>
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 py-3 rounded-lg border border-white/15 hover:bg-white/5 transition disabled:opacity-50"
          >
            Deny
          </button>
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {busy ? "Working…" : "Approve"}
          </button>
        </div>
      </div>
    </main>
  );
}
