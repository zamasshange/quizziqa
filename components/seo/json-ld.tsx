import {
  SITE_NAME,
  SITE_DESCRIPTION,
  getSiteUrl,
  absoluteUrl,
} from "@/lib/seo/site";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        alternateName: ["Quizzical Quiz Games", "quizzical.site"],
        url: getSiteUrl(),
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: getSiteUrl(),
        logo: absoluteUrl("/icons/icon-512.png"),
        description: SITE_DESCRIPTION,
        sameAs: [getSiteUrl()],
      }}
    />
  );
}

export function GameJsonLd({
  name,
  description,
  slug,
  category,
}: {
  name: string;
  description: string;
  slug: string;
  category?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Game",
        name,
        description,
        url: absoluteUrl(`/play/${slug}`),
        genre: category ?? "Quiz",
        gamePlatform: "Web Browser",
        applicationCategory: "Game",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: getSiteUrl(),
        },
        isAccessibleForFree: true,
        inLanguage: "en",
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; path: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}
