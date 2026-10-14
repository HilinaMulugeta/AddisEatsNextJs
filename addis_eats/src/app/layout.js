import "./globals.css";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { SiteFrame } from "./SiteFrame";
import { getServerEnv } from "@/lib/env";

const geistSans = localFont({
  src: "./fonts/Geist-Latin.woff2",
  display: "optional",
  variable: "--font-geist-sans",
});

export const metadata = {
  metadataBase: new URL(getServerEnv().SITE_URL),
  title: {
    default: "Addis Eats | Ethiopian food delivery in Addis Ababa",
    template: "%s | Addis Eats",
  },
  description:
    "Explore Ethiopian favorites from Doro Wot to Kitfo, create your account, and follow your Addis Eats order.",
  openGraph: {
    type: "website",
    locale: "en_ET",
    siteName: "Addis Eats",
    title: "Addis Eats | Ethiopian food delivery in Addis Ababa",
    description:
      "Explore Ethiopian favorites from Doro Wot to Kitfo, create your account, and follow your Addis Eats order.",
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
      "Explore Ethiopian favorites from Doro Wot to Kitfo, create your account, and follow your Addis Eats order.",
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
