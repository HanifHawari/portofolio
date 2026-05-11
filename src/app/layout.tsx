import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider } from "@/lib/ThemeContext";

export const metadata: Metadata = {
  title: "Muhammad Hanif Hawari | Web Developer",
  description:
    "Professional portfolio of Muhammad Hanif Hawari — Full-Stack Web Developer specializing in modern web technologies, React, Next.js, and creative digital experiences.",
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
      "Professional portfolio of Muhammad Hanif Hawari — Full-Stack Web Developer",
    type: "website",
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
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
