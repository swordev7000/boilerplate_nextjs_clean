import { Providers } from "@/providers/Providers";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useTranslations } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Boilerplate Next.js Clean",
  description: "A boilerplate for Next.js with a clean architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header>
            <nav>{t("Layout.title_nav")}</nav>
          </header>
          {children}
          <footer>
            <p>&copy; {t("Layout.copyright")}</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
