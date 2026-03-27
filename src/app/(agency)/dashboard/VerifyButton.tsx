"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function VerifyButton({ listingId }: { listingId: string }) {
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);

  async function handleVerify() {
    setVerifying(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await supabase
      .from("listing")
      .update({
        last_verified_at: new Date().toISOString(),
        verified_by: user?.email ?? "agency",
      })
      .eq("id", listingId);

    setVerifying(false);
    setDone(true);
    // Refresh page to show updated date
    window.location.reload();
  }

  if (done) {
    return <span className="mr-3 text-xs text-green-600">✓ Verified</span>;
  }

  return (
    <button
      onClick={handleVerify}
      disabled={verifying}
      className="mr-3 text-xs text-green-700 hover:text-green-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded disabled:opacity-50"
    >
      {verifying ? "…" : "Verify"}
    </button>
  );
}
