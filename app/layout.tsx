import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { Web3Providers } from "@/components/web3/Web3Providers";

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Meki Adventure",
  description: "A retro Web3 adventure game with optional collectible rewards.",
  openGraph: {
    title: "Meki Adventure",
    description: "A retro Web3 adventure game with optional collectible rewards.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${vt323.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="theme-nintendo min-h-full flex flex-col">
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}
