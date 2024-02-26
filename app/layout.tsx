import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FHE Playground",
  description: "You can demo add/mul while encrypting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white font-mono">{children}</body>
    </html>
  );
}
