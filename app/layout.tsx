import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { ThemeInit } from "@/components/theme-init";
import { Attribution } from "@/components/attribution";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blog.wabog.com"),
  title: {
    default: "Blog de Wabog — Gestión legal inteligente",
    template: "%s · Blog de Wabog",
  },
  description:
    "Guías y novedades sobre la Rama Judicial de Colombia, radicados, vigilancia procesal y automatización legal con la IA de Wabog.",
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Blog de Wabog",
    locale: "es_CO",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "48x48" }],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body>
        <ThemeInit />
        <Header />
        <main className="site-main">{children}</main>
        <Footer />
        <Analytics />
        <Attribution />
      </body>
    </html>
  );
}
