import type { Metadata } from "next";
import "./globals.css";
import { DICTIONARY } from "@/backend/entity";

export const metadata: Metadata = {
  title: DICTIONARY.WEBSITE_TITLE,
  description: DICTIONARY.WEBSITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" rel="stylesheet" />

      </head>
      <body className="bg-white font-mono">{children}</body>
    </html>
  );
}
