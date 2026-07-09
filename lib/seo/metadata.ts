import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TAGLINE,
  OG_IMAGE_PATH,
  SITE_URL,
  absoluteUrl,
} from "@/lib/seo/site";

interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  ogType?: "website" | "article";
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [...SITE_KEYWORDS],
  noIndex = false,
  ogType = "website",
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: ogType,
      locale: "en_US",
      images: [
        {
          url: OG_IMAGE_PATH,
          width: 512,
          height: 512,
          alt: `${SITE_NAME} – ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE_PATH],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export function buildHomeMetadata(): Metadata {
  return {
    ...buildPageMetadata({
      title: `${SITE_NAME} – ${SITE_TAGLINE}`,
      description: SITE_DESCRIPTION,
      path: "/",
      keywords: [...SITE_KEYWORDS],
    }),
    title: {
      default: `${SITE_NAME} – ${SITE_TAGLINE}`,
      template: `%s | ${SITE_NAME}`,
    },
  };
}

export function buildGameMetadata(
  slug: string,
  title: string,
  description: string,
  keywords: string[]
): Metadata {
  const seoTitle = `${title} – Free Online Quiz Game`;
  const seoDescription = `Play ${title} free on Quizzical. ${description} Earn XP, compete on leaderboards, and learn with every answer. No download — play instantly in your browser.`;

  return buildPageMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/play/${slug}`,
    keywords,
  });
}

export function buildCategoryMetadata(
  slug: string,
  name: string,
  description: string,
  keywords: string[]
): Metadata {
  return buildPageMetadata({
    title: `${name} Quiz Games – Free Online Trivia`,
    description: `Play free ${name.toLowerCase()} quiz and guessing games on Quizzical. ${description} Picture quizzes, daily challenges, and XP rewards.`,
    path: `/categories/${slug}`,
    keywords,
  });
}
