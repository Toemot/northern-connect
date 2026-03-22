import { createBrowserClient } from "@supabase/ssr";

// Note: We don't pass a Database generic here because our hand-written types
// lack the Relationships field Supabase needs to infer join results.
// All query results are cast explicitly at the call site.
// To get auto-generated types later: npx supabase gen types typescript --project-id eafzmqbynbanavdcwuah
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
