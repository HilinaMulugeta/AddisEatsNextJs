import "./globals.css";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { SiteFrame } from "./SiteFrame";
import { getServerEnv } from "@/lib/env";

const geistSans = localFont({
  src: "./fonts/Geist-Latin.woff2",
  display: "swap",
  variable: "--font-geist-sans",
});

export const metadata = {
  metadataBase: new URL(getServerEnv().SITE_URL),
  title: {
    default: "Addis Eats | Ethiopian food delivery in Addis Ababa",
    template: "%s | Addis Eats",
  },
  description:
    "Order authentic Ethiopian favorites, from Doro Wot to Kitfo, with fast delivery across Addis Ababa.",
  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Addis Eats",
    title: "Addis Eats | Ethiopian food delivery in Addis Ababa",
    description:
      "Order authentic Ethiopian favorites, from Doro Wot to Kitfo, with fast delivery across Addis Ababa.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Addis Eats Ethiopian food delivery in Addis Ababa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Addis Eats | Ethiopian food delivery in Addis Ababa",
    description:
      "Order authentic Ethiopian favorites, from Doro Wot to Kitfo, with fast delivery across Addis Ababa.",
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased`}>
        <Providers>
          <SiteFrame>{children}</SiteFrame>
        </Providers>
      </body>
    </html>
  );
}
