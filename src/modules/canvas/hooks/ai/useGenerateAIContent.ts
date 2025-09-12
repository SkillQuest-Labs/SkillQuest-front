import { useResourceResolver } from "@/shared/hooks/useResourceResolver";
import type { QuestAiType } from "@/shared/types/ai/ai.type";
import { generateQuestsFromAI } from "../../generate-quests-from-ai";
import { getAiContext } from "../../getAiContext";
import { isValidResourceIntention } from "@/shared/utils/resource-types";

export const useGenerateAIContent = () => {
  const { resolveResources, isResolving, error } = useResourceResolver();

  const generate = async (): Promise<QuestAiType[]> => {
    console.log("🎯 [useGenerateAIContent] Starting quest generation process");

    const context = getAiContext();
    if (!context.instruction.trim()) {
      console.warn("⚠️ [useGenerateAIContent] Empty instruction, aborting generation");
      return [];
    }

    // Retry logic with progressive delay
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 [useGenerateAIContent] Attempt ${attempt}/${maxRetries}`);

        const rawQuests = await generateQuestsFromAI(context);

        if (rawQuests.length > 0) {
          console.log(`✅ [useGenerateAIContent] Success on attempt ${attempt}, got ${rawQuests.length} quests`);

          // Continue with resource resolution...
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
          console.warn(`⚠️ [useGenerateAIContent] Attempt ${attempt} returned empty results`);
          if (attempt < maxRetries) {
            const delay = attempt * 1000; // Progressive delay: 1s, 2s, 3s
            console.log(`⏳ [useGenerateAIContent] Waiting ${delay}ms before retry...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        console.error(`❌ [useGenerateAIContent] Attempt ${attempt} failed:`, {
          error: lastError.message,
          stack: lastError.stack,
        });

        if (attempt < maxRetries) {
          const delay = attempt * 1000; // Progressive delay: 1s, 2s, 3s
          console.log(`⏳ [useGenerateAIContent] Waiting ${delay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    console.error(`💥 [useGenerateAIContent] All ${maxRetries} attempts failed`, {
      lastError: lastError?.message,
      context: {
        hasInstruction: !!context.instruction,
        provider: context.aiProvider,
      },
    });

    return [];
  };

  return { generate, isResolving, error };
};
