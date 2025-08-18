import type { ResolvedResource, ResourceIntention } from "../../types/ai/ai.type";

const API_KEYS = {
  YOUTUBE: import.meta.env.VITE_YOUTUBE_API_KEY,
  GOOGLE_SEARCH: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY,
  GOOGLE_SEARCH_ENGINE_ID: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID,
};

export async function resolveResource(intention: ResourceIntention): Promise<ResolvedResource | null> {
  try {
    switch (intention.type) {
      case "video":
        return await resolveVideo(intention);
      case "documentation":
        return await resolveDocumentation(intention);
      case "article":
        return await resolveArticle(intention);
      case "course":
        return await resolveCourse(intention);
      case "forum":
        return await resolveForum(intention);
      default:
        return await resolveGeneric(intention);
    }
  } catch {
    throw new Error("Erreur lors de la résolution de ressource");
  }
}

export async function resolveMultipleResources(intentions: ResourceIntention[]): Promise<ResolvedResource[]> {
  const promises = intentions.map((intention) => resolveResource(intention));
  const results = await Promise.allSettled(promises);

  return results
    .filter(
      (result): result is PromiseFulfilledResult<ResolvedResource> =>
        result.status === "fulfilled" && result.value !== null,
    )
    .map((result) => result.value);
}

async function resolveVideo(intention: ResourceIntention): Promise<ResolvedResource | null> {
  if (intention.preferred_domains.includes("youtube.com")) {
    return await searchYouTube(intention);
  }

  return await searchGeneral(intention);
}

async function resolveDocumentation(intention: ResourceIntention): Promise<ResolvedResource | null> {
  const docDomains = intention.preferred_domains.filter(
    (domain) => domain.includes(".org") || domain.includes(".dev") || domain.includes("docs."),
  );

  if (docDomains.length > 0) {
    return await searchInDomains(intention, docDomains);
  }

  return await searchGeneral(intention);
}

async function resolveArticle(intention: ResourceIntention): Promise<ResolvedResource | null> {
  return await searchGeneral(intention);
}

async function resolveCourse(intention: ResourceIntention): Promise<ResolvedResource | null> {
  return await searchInDomains(intention, intention.preferred_domains);
}

async function resolveForum(intention: ResourceIntention): Promise<ResolvedResource | null> {
  return await searchInDomains(intention, intention.preferred_domains);
}

async function resolveGeneric(intention: ResourceIntention): Promise<ResolvedResource | null> {
  return await searchGeneral(intention);
}

async function searchYouTube(intention: ResourceIntention): Promise<ResolvedResource | null> {
  if (!API_KEYS.YOUTUBE) {
    console.warn("YouTube API key not configured");
    return await searchGeneral(intention);
  }

  try {
    const searchQuery = buildSearchQuery(intention);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=5&key=${API_KEYS.YOUTUBE}`,
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      return {
        title: video.snippet.title,
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
        type: "video",
        isValid: true,
        score: calculateScore(video.snippet, intention),
        domain: "youtube.com",
      };
    }
  } catch (error) {
    console.error("Erreur YouTube API:", error);
  }

  return null;
}

async function searchGeneral(intention: ResourceIntention): Promise<ResolvedResource | null> {
  if (!API_KEYS.GOOGLE_SEARCH || !API_KEYS.GOOGLE_SEARCH_ENGINE_ID) {
    console.warn("Google Search API not configured");
    return getFallbackResource(intention);
  }

  try {
    const searchQuery = buildSearchQuery(intention);
    const siteFilter = intention.preferred_domains.length > 0 ? ` site:${intention.preferred_domains[0]}` : "";

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${API_KEYS.GOOGLE_SEARCH}&cx=${API_KEYS.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery + siteFilter)}&num=5`,
    );

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const result = data.items[0];
      const isValid = await validateUrl(result.link);

      return {
        title: result.title,
        url: result.link,
        type: intention.type,
        isValid,
        score: calculateScore(result, intention),
        domain: new URL(result.link).hostname,
      };
    }
  } catch (error) {
    console.error("Erreur Google Search API:", error);
  }

  return getFallbackResource(intention);
}

async function searchInDomains(intention: ResourceIntention, domains: string[]): Promise<ResolvedResource | null> {
  for (const domain of domains) {
    const result = await searchGeneral({ ...intention, preferred_domains: [domain] });

    if (result && result.isValid) {
      return result;
    }
  }

  return await searchGeneral(intention);
}

function buildSearchQuery(intention: ResourceIntention): string {
  const keywords = intention.must_include_keywords.join(" ");
  const query = intention.query;
  return `${query} ${keywords}`.trim();
}

function calculateScore(result: any, intention: ResourceIntention): number {
  let score = 50;

  const text = (result.title + " " + (result.snippet || "")).toLowerCase();
  const foundKeywords = intention.must_include_keywords.filter((keyword) => text.includes(keyword.toLowerCase()));

  score += (foundKeywords.length / intention.must_include_keywords.length) * 30;

  if (result.link && intention.preferred_domains.some((domain) => result.link.includes(domain))) {
    score += 20;
  }

  return Math.min(100, Math.max(0, score));
}

async function validateUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    return response.ok || response.type === "opaque";
  } catch {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

function getFallbackResource(intention: ResourceIntention): ResolvedResource {
  const fallbackUrls: Record<string, string> = {
    video: "https://www.youtube.com",
    documentation: "https://developer.mozilla.org",
    article: "https://medium.com",
    course: "https://www.coursera.org",
    forum: "https://stackoverflow.com",
    tool: "https://github.com",
  };

  const url = intention.preferred_domains[0]
    ? `https://${intention.preferred_domains[0]}`
    : fallbackUrls[intention.type] || "https://www.google.com";

  return {
    title: `Recherche: ${intention.query}`,
    url,
    type: intention.type,
    isValid: true,
    score: 30,
    domain: new URL(url).hostname,
  };
}
