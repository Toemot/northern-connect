import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Northern Connect — Prince George",
  description:
    "Find services and community activities in Prince George and Northern BC.",
  // noindex until Phase 3 gates pass and public launch is approved
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans antialiased">
        {/* Skip navigation link — WCAG 2.1 AA */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-brand-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
