import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description: "Play today's daily guessing challenge and maintain your streak.",
};

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
