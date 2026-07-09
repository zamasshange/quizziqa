import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Search Quiz Games – Find Any Game on Quizzical",
  description:
    "Search all Quizzical guessing games, categories, and collections. Find guess the celebrity, flag, movie, president, and more.",
  path: "/search",
  keywords: ["search quiz games", "find trivia games", "quizzical search"],
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
