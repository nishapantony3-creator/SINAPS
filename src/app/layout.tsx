import type { Metadata, Viewport } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "St. Ignatius Nursery & Primary School | SINAPS Budapadi",
  description: "SINAPS in Budapadi, Erode — Joyful, student-centered CBSE integrated primary education from Pre KG to 5th Standard. Admissions open 2026-2027.",
  keywords: ["SINAPS School", "St Ignatius Budapadi", "Nursery School Erode", "Primary School Anthiyur", "CBSE Budapadi", "Admissions 2026"],
  openGraph: {
    title: "SINAPS — St. Ignatius Nursery & Primary School",
    description: "Joyful, premium education in Budapadi, Erode. Admissions open for Pre KG to 5th Standard.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3B82F6",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
