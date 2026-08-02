import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { LanguageProvider } from "@/lib/KonteksBahasa";
import { ThemeProvider } from "@/lib/KonteksTema";

import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.portfoliohanief.web.id"), // Domain website 
  title: "Muhammad Hanif Hawari | Web Developer",
  description:
    "Professional portfolio of Muhammad Hanif Hawari — Frontend Engineer specializing in modern web technologies, React, Next.js, and creative digital experiences.",
  keywords: [
    "web developer",
    "portfolio",
    "Muhammad Hanif Hawari",
    "Next.js",
    "React",
    "TypeScript",
  ],
  authors: [{ name: "Muhammad Hanif Hawari" }],
  openGraph: {
    title: "Muhammad Hanif Hawari | Web Developer",
    description:
      "Professional portfolio of Muhammad Hanif Hawari — Frontend Engineer specializing in modern web technologies.",
    url: "https://www.portfoliohanief.web.id",
    type: "website",
    images: [
      {
        url: "/icon.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammad Hanif Hawari",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Hanif Hawari | Web Developer",
    description:
      "Professional portfolio of Muhammad Hanif Hawari — Frontend Engineer specializing in modern web technologies.",
    images: ["/icon.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
      >
        <ThemeProvider>
          <LanguageProvider>
            <div className="relative w-full min-h-screen overflow-x-hidden">
              {children}
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
