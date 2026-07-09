import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Daily Quiz Challenge – Play Today's Game",
  description:
    "Play today's daily quiz challenge on Quizzical. A new guessing game every day — maintain your streak, earn bonus XP, and compete with players worldwide.",
  path: "/daily",
  keywords: [
    "daily quiz",
    "daily challenge",
    "daily trivia",
    "quiz of the day",
    "quizzical daily",
  ],
});

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
