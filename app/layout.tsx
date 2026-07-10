import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { PlayModeBody } from "@/components/play-mode-body";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/seo/json-ld";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { Analytics } from "@vercel/analytics/next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = buildHomeMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#FFFDF4" />
        <meta name="application-name" content="Quizzical" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192" />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>
            <PlayModeBody playMode={false} />
            {children}
          </QueryProvider>
          <ServiceWorkerRegister />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
