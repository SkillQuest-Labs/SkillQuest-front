import type { ResolvedResource, ResourceIntention } from "../../types/ai/ai.type";

export class ResourceResolver {
  private static readonly API_KEYS = {
    YOUTUBE: import.meta.env.VITE_YOUTUBE_API_KEY,
    GOOGLE_SEARCH: import.meta.env.VITE_GOOGLE_SEARCH_API_KEY,
    GOOGLE_SEARCH_ENGINE_ID: import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID,
  };

  /**
   * Résout une intention de ressource en URL valide
   */
  static async resolveResource(intention: ResourceIntention): Promise<ResolvedResource | null> {
    try {
      switch (intention.type) {
        case "video":
          return await this.resolveVideo(intention);
        case "documentation":
          return await this.resolveDocumentation(intention);
        case "article":
          return await this.resolveArticle(intention);
        case "course":
          return await this.resolveCourse(intention);
        case "forum":
          return await this.resolveForum(intention);
        default:
          return await this.resolveGeneric(intention);
      }
    } catch {
      throw new Error("Erreur lors de la résolution de ressource");
    }
  }

  /**
   * Résout plusieurs intentions en parallèle
   */
  static async resolveMultipleResources(intentions: ResourceIntention[]): Promise<ResolvedResource[]> {
    const promises = intentions.map((intention) => this.resolveResource(intention));
    const results = await Promise.allSettled(promises);

    return results
      .filter(
        (result): result is PromiseFulfilledResult<ResolvedResource> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value);
  }

  private static async resolveVideo(intention: ResourceIntention): Promise<ResolvedResource | null> {
    // Priorité à YouTube si dans les domaines préférés
    if (intention.preferred_domains.includes("youtube.com")) {
      return await this.searchYouTube(intention);
    }

    // Fallback sur recherche générale
    return await this.searchGeneral(intention);
  }

  private static async resolveDocumentation(intention: ResourceIntention): Promise<ResolvedResource | null> {
    // Recherche sur les domaines de documentation préférés
    const docDomains = intention.preferred_domains.filter(
      (domain) => domain.includes(".org") || domain.includes(".dev") || domain.includes("docs."),
    );

    if (docDomains.length > 0) {
      return await this.searchInDomains(intention, docDomains);
    }

    return await this.searchGeneral(intention);
  }

  private static async resolveArticle(intention: ResourceIntention): Promise<ResolvedResource | null> {
    return await this.searchGeneral(intention);
  }

  private static async resolveCourse(intention: ResourceIntention): Promise<ResolvedResource | null> {
    return await this.searchInDomains(intention, intention.preferred_domains);
  }

  private static async resolveForum(intention: ResourceIntention): Promise<ResolvedResource | null> {
    return await this.searchInDomains(intention, intention.preferred_domains);
  }

  private static async resolveGeneric(intention: ResourceIntention): Promise<ResolvedResource | null> {
    return await this.searchGeneral(intention);
  }

  private static async searchYouTube(intention: ResourceIntention): Promise<ResolvedResource | null> {
    if (!this.API_KEYS.YOUTUBE) {
      console.warn("YouTube API key not configured");
      return await this.searchGeneral(intention);
    }

    try {
      const searchQuery = this.buildSearchQuery(intention);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=5&key=${this.API_KEYS.YOUTUBE}`,
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
          score: this.calculateScore(video.snippet, intention),
          domain: "youtube.com",
        };
      }
    } catch (error) {
      console.error("Erreur YouTube API:", error);
    }

    return null;
  }

  private static async searchGeneral(intention: ResourceIntention): Promise<ResolvedResource | null> {
    if (!this.API_KEYS.GOOGLE_SEARCH || !this.API_KEYS.GOOGLE_SEARCH_ENGINE_ID) {
      console.warn("Google Search API not configured");
      return this.getFallbackResource(intention);
    }

    try {
      const searchQuery = this.buildSearchQuery(intention);
      const siteFilter = intention.preferred_domains.length > 0 ? ` site:${intention.preferred_domains[0]}` : "";

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${this.API_KEYS.GOOGLE_SEARCH}&cx=${this.API_KEYS.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery + siteFilter)}&num=5`,
      );

      if (!response.ok) {
        throw new Error(`Google Search API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const result = data.items[0];
        const isValid = await this.validateUrl(result.link);

        return {
          title: result.title,
          url: result.link,
          type: intention.type,
          isValid,
          score: this.calculateScore(result, intention),
          domain: new URL(result.link).hostname,
        };
      }
    } catch (error) {
      console.error("Erreur Google Search API:", error);
    }

    return this.getFallbackResource(intention);
  }

  private static async searchInDomains(
    intention: ResourceIntention,
    domains: string[],
  ): Promise<ResolvedResource | null> {
    for (const domain of domains) {
      const result = await this.searchGeneral({
        ...intention,
        preferred_domains: [domain],
      });

      if (result && result.isValid) {
        return result;
      }
    }

    return await this.searchGeneral(intention);
  }

  private static buildSearchQuery(intention: ResourceIntention): string {
    const keywords = intention.must_include_keywords.join(" ");
    const query = intention.query;
    return `${query} ${keywords}`.trim();
  }

  private static calculateScore(result: any, intention: ResourceIntention): number {
    let score = 50; // Score de base

    // Vérifier la présence des mots-clés obligatoires
    const text = (result.title + " " + (result.snippet || "")).toLowerCase();
    const foundKeywords = intention.must_include_keywords.filter((keyword) => text.includes(keyword.toLowerCase()));

    score += (foundKeywords.length / intention.must_include_keywords.length) * 30;

    // Bonus pour le domaine préféré
    if (result.link && intention.preferred_domains.some((domain) => result.link.includes(domain))) {
      score += 20;
    }

    return Math.min(100, Math.max(0, score));
  }

  private static async validateUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
      return response.ok || response.type === "opaque"; // no-cors renvoie opaque pour les requêtes cross-origin
    } catch {
      // Fallback : on considère l'URL comme valide si elle est bien formée
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
  }

  private static getFallbackResource(intention: ResourceIntention): ResolvedResource {
    // Ressource de fallback basée sur le type et les domaines préférés
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
      score: 30, // Score faible pour indiquer que c'est un fallback
      domain: new URL(url).hostname,
    };
  }
}
