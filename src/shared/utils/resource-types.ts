import type { ResourceIntention } from "../types/ai/ai.type";

export const RESOURCE_TYPES = ["documentation", "video", "article", "course", "forum", "podcast"] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

const RESOURCE_TYPE_TRANSLATIONS: Record<ResourceType, string> = {
  documentation: "Documentation officielle",
  video: "Vidéos explicatives",
  article: "Articles de blog",
  course: "Cours en ligne",
  forum: "Forums et communautés",
  podcast: "Podcasts",
};

export const translateResourceType = (type: ResourceType): string => {
  return RESOURCE_TYPE_TRANSLATIONS[type] || type;
};

export const getResourceTypesInFrench = (): string[] => {
  return RESOURCE_TYPES.map(translateResourceType);
};

// Utility function to validate a ResourceIntention
export const isValidResourceIntention = (resource: any): resource is ResourceIntention => {
  return (
    resource &&
    typeof resource.type === "string" &&
    ["video", "article", "documentation", "course", "podcast", "forum"].includes(resource.type) &&
    typeof resource.query === "string" &&
    Array.isArray(resource.preferred_domains) &&
    Array.isArray(resource.must_include_keywords) &&
    typeof resource.language === "string" &&
    ["fr", "en"].includes(resource.language) &&
    typeof resource.difficulty_level === "string" &&
    ["beginner", "intermediate", "advanced"].includes(resource.difficulty_level)
  );
};
