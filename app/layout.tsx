import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { PipelineBootstrap } from "@/components/providers/pipeline-bootstrap";
import { PlayModeBody } from "@/components/play-mode-body";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://quizzical.site";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Quizzical – Play & Guess Games",
    template: "%s | Quizzical",
  },
  description:
    "Play hundreds of guessing games across 19 categories. Earn XP, unlock achievements, maintain daily streaks, and learn something new with every answer.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Quizzical",
  },
};

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
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/icons/favicon-32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>
            <PlayModeBody playMode={false} />
            {children}
          </QueryProvider>
          <ServiceWorkerRegister />
          <PipelineBootstrap />
        </AuthProvider>
      </body>
    </html>
  );
}
