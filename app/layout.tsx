import type { Metadata } from "next";
import { Merriweather, Geist_Mono } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Turkish Lesson Script Generator",
  description: "Turn your notes into professional lesson scripts",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Turkish Lesson Script Generator",
    description: "Generate engaging teacher scripts from notes",
    siteName: "Turkish Lesson Bot",
    locale: "en_US",
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
        className={`${merriweather.variable} ${geistMono.variable} font-serif antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
