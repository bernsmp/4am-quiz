import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://4am-quiz.vercel.app'),
  title: "AEO Strategist | Discover Your Marketing Blind Spots",
  description: "Find out where you're losing deals. Take our 60-second quiz to reveal the gap between your perception and reality in SEO & AEO performance.",
  keywords: ["AEO", "SEO", "marketing strategy", "answer engine optimization", "marketing blind spots", "Socially Square"],
  authors: [{ name: "Socially Square", url: "https://sociallysquare.com" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://4am-quiz.vercel.app",
    siteName: "AEO Strategist",
    title: "AEO Strategist | Discover Your Marketing Blind Spots",
    description: "Find out where you're losing deals. Take our 60-second quiz to reveal the gap between your perception and reality in SEO & AEO performance.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Socially Square - Right Angles for Marketing Success",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AEO Strategist | Discover Your Marketing Blind Spots",
    description: "Find out where you're losing deals. Take our 60-second quiz to reveal the gap between your perception and reality in SEO & AEO performance.",
    images: ["/og-image.png"],
    creator: "@sociallysquare",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
