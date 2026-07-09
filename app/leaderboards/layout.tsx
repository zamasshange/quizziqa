import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Leaderboards – Top Quiz Players",
  description:
    "See the top Quizzical players on global and weekly leaderboards. Compete in free guessing games and climb the ranks.",
  path: "/leaderboards",
  keywords: ["quiz leaderboard", "trivia rankings", "quizzical leaderboard"],
});

export default function LeaderboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
