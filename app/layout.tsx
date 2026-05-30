import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="" />
        <title>DNAForge</title>
        <meta
          name="description"
          content="Compose, mutate, and fuse onchain DNA sequences on Base."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
