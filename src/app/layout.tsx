import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SONUS One — Hear Everything. Real 3D.",
  description:
    "SONUS One premium headphones presented in real-time 3D. Drag to rotate, scroll to explore, watch it come apart, pick your finish.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-cream font-body antialiased">{children}</body>
    </html>
  );
}
