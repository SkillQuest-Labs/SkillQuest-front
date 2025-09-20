import { useResourceResolver } from "@/shared/hooks/useResourceResolver";
import type { QuestAiType } from "@/shared/types/ai/ai.type";
import { generateQuestsFromAI } from "../../generate-quests-from-ai";
import { getAiContext } from "../../getAiContext";
import { isValidResourceIntention } from "@/shared/utils/resource-types";

export const useGenerateAIContent = () => {
  const { resolveResources, isResolving, error } = useResourceResolver();

  const generate = async (): Promise<QuestAiType[]> => {
    const context = getAiContext();
    if (!context.instruction.trim()) {
      return [];
    }

    // Retry logic with progressive delay
    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const rawQuests = await generateQuestsFromAI(context);

        if (rawQuests.length > 0) {
          const questsWithResolvedResources = await Promise.all(
            rawQuests.map(async (quest) => {
              if (quest.resources && quest.resources.length > 0) {
                // Validate that the resources are indeed ResourceIntention
                const validResources = quest.resources.filter(isValidResourceIntention);

                if (validResources.length > 0) {
                  const resolvedResources = await resolveResources(validResources);

                  // Update the description with the resolved links
                  if (resolvedResources.length > 0) {
                    const resourceLinks = resolvedResources
                      .filter((resource) => resource.isValid && resource.score > 40) // Quality threshold
                      .map((resource) => `- [${resource.title}](${resource.url})`)
                      .join("\n");

                    if (resourceLinks) {
                      quest.description += `\n\n## 📚 Ressources recommandées\n${resourceLinks}`;
                    }
                  }
                }
              }

              return quest;
            }),
          );

          return questsWithResolvedResources;
        } else {
          if (attempt < maxRetries) {
            const delay = attempt * 1000; // Progressive delay: 1s, 2s, 3s

            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }
      } catch {
        if (attempt < maxRetries) {
          const delay = attempt * 1000; // Progressive delay: 1s, 2s, 3s

          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    return [];
  };

  return { generate, isResolving, error };
};
