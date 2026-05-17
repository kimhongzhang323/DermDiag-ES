import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/TopBar";

export const metadata: Metadata = {
  title: "DermDiag ES — Preliminary Dermatology Triage",
  description: "A rule-based dermatology triage expert system with forward chaining and certainty factors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopBar />
        <main className="max-w-content mx-auto px-5 sm:px-8 pt-14 pb-24">{children}</main>
        <footer className="max-w-content mx-auto px-5 sm:px-8 mt-24 py-8 border-t border-line font-mono text-[11px] text-ink-3 tracking-[0.06em] flex justify-between items-center gap-6 flex-wrap">
          <span>DERMDIAG · ES PROTOTYPE · v0.2</span>
          <span>WIA2001 · GROUP OCC 10 · SEM 2 · 2025/2026</span>
        </footer>
      </body>
    </html>
  );
}
