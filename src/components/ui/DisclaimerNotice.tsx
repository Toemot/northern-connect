'use client';

import { useState, useEffect } from 'react';

/**
 * Responsible Use Notice — shown once per session on first visit.
 * Also rendered as a persistent footer strip on every page via layout.tsx.
 */
export function DisclaimerModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('nc_disclaimer_v1');
    if (!seen) setVisible(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem('nc_disclaimer_v1', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4"
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2
          id="disclaimer-title"
          className="text-base font-semibold text-gray-900 mb-3"
        >
          Search Responsibly
        </h2>

        <p className="text-sm text-gray-700 mb-3">
          Northern Connect provides community information for <strong>general reference
          only</strong>. Details — including hours, addresses, and availability — may
          change without notice. Always verify directly with the organization before
          visiting or making decisions.
        </p>

        <p className="text-sm text-gray-700 mb-3">
          This platform does not provide legal, medical, financial, housing, or safety
          advice. Information is a starting point, not a final answer.
        </p>

        <p className="text-sm text-gray-700 mb-5">
          <strong>You are responsible for any action taken based on information found
          here.</strong> Northern Connect takes reasonable care with accuracy but
          cannot guarantee it. Use your judgment.
        </p>

        <button
          onClick={dismiss}
          className="w-full bg-blue-700 hover:bg-blue-800 focus:outline-none
                     focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
        >
          I understand — continue
        </button>
      </div>
    </div>
  );
}

/**
 * Persistent one-line footer strip shown on every page.
 */
export function DisclaimerStrip() {
  return (
    <div className="w-full bg-gray-100 border-t border-gray-200 px-4 py-2 text-center">
      <p className="text-xs text-gray-500">
        Northern Connect provides community information for reference only. Verify
        all details with organizations directly. Users are responsible for their
        own decisions.{' '}
        <a href="/terms" className="underline hover:text-gray-700">
          Terms of Use
        </a>
      </p>
    </div>
  );
}
