'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ApproveRejectButtons({
  orgId,
  adminKey,
}: {
  orgId: string;
  adminKey: string;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function act(status: 'approved' | 'rejected' | 'flagged') {
    setLoading(status);
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orgId, status, key: adminKey }),
    });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2 shrink-0">
      <button
        onClick={() => act('approved')}
        disabled={loading !== null}
        className="rounded-lg bg-green-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        {loading === 'approved' ? '…' : '✓ Approve'}
      </button>
      <button
        onClick={() => act('rejected')}
        disabled={loading !== null}
        className="rounded-lg bg-red-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
      >
        {loading === 'rejected' ? '…' : '✗ Reject'}
      </button>
      <button
        onClick={() => act('flagged')}
        disabled={loading !== null}
        className="rounded-lg bg-yellow-400 px-4 py-1.5 text-xs font-semibold text-gray-900 hover:bg-yellow-500 disabled:opacity-50"
      >
        {loading === 'flagged' ? '…' : '⚑ Flag'}
      </button>
    </div>
  );
}
