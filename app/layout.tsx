import type { Metadata } from "next";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { PlayModeBody } from "@/components/play-mode-body";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Guess Everything – Play & Guess Games",
    template: "%s | Guess Everything",
  },
  description:
    "Play hundreds of guessing games across 19 categories. Earn XP, unlock achievements, maintain daily streaks, and learn something new with every answer.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Guess Everything",
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
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased">
        <PlayModeBody playMode={false} />
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
