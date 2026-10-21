import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "LG Beauty Academy | Luxury Beauty, Delivered to You",
    template: "%s | LG Beauty Academy",
  },
  description:
    "Professional mobile makeup artistry, bridal beauty, hairstyling and makeup education. Your beauty, your comfort, your moment to shine.",
  openGraph: {
    title: "LG Beauty Academy",
    description: "Luxury mobile beauty and makeup education, made personal.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-ZA">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}