import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/site";
import { getAllGameSlugs } from "@/lib/games/registry";
import { categories } from "@/lib/data/categories";
import { collections } from "@/lib/data/collections";

/** Regenerate on each request so production never serves a localhost sitemap from a bad build. */
export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/games"), lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/categories"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/collections"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/daily"), lastModified: now, changeFrequency: "daily", priority: 0.85 },
    { url: absoluteUrl("/search"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/leaderboards"), lastModified: now, changeFrequency: "daily", priority: 0.6 },
  ];

  const gameRoutes: MetadataRoute.Sitemap = getAllGameSlugs().map((slug) => ({
    url: absoluteUrl(`/play/${slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: absoluteUrl(`/categories/${cat.slug}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const collectionRoutes: MetadataRoute.Sitemap = collections.map((col) => ({
    url: absoluteUrl(`/collections/${col.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...gameRoutes, ...categoryRoutes, ...collectionRoutes];
}
