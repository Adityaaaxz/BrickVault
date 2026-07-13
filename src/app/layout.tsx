import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrickVault — Premium LEGO Store | Build Your Dreams",
  description:
    "Discover the world's most iconic LEGO sets. From Technic supercars to Star Wars legends — every brick tells a story. Shop premium LEGO sets at BrickVault.",
  keywords: ["LEGO", "LEGO sets", "building blocks", "Technic", "Star Wars LEGO", "premium toys"],
  openGraph: {
    title: "BrickVault — Premium LEGO Store",
    description: "Discover the world's most iconic LEGO sets. Build your dreams brick by brick.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-lego-dark text-lego-white">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
