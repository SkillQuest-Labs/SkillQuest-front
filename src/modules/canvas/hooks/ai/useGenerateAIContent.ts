import { useResourceResolver } from "@/shared/hooks/useResourceResolver";
import type { QuestAiType } from "@/shared/types/ai/ai.type";
import { generateQuestsFromAI } from "../../generate-quests-from-ai";
import { getAiContext } from "../../getAiContext";
import { isValidResourceIntention } from "@/shared/utils/resource-types";

export const useGenerateAIContent = () => {
  const debugLogger = (window as any).debugLogger;

  const { resolveResources, isResolving, error } = useResourceResolver();

  const generate = async (): Promise<QuestAiType[]> => {
    const startTime = Date.now();
    debugLogger.info("🎯 Début du processus de génération de quêtes IA");

    const context = getAiContext();
    if (!context.instruction.trim()) {
      debugLogger.warn("⚠️ Instruction vide, abandon de la génération", { context });
      return [];
    }

    // Retry logic with progressive delay
    const maxRetries = 3;
    let lastError: Error | null = null;
    let totalResourcesResolved = 0;
    let totalValidResources = 0;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        debugLogger.info(`🔄 Tentative ${attempt}/${maxRetries} de génération`);

    const rawQuests = await generateQuestsFromAI(context);

        if (rawQuests.length > 0) {
          debugLogger.info(`✅ Génération réussie à la tentative ${attempt}`, {
            questsGenerated: rawQuests.length,
            attempt,
            questTitles: rawQuests.map((q) => q.title),
          });

    const questsWithResolvedResources = await Promise.all(
      rawQuests.map(async (quest) => {
        if (quest.resources && quest.resources.length > 0) {
          // Validate that the resources are indeed ResourceIntention
          const validResources = quest.resources.filter(isValidResourceIntention);

                if (validResources.length > 0) {
                  totalValidResources += validResources.length;
                  const resolvedResources = await resolveResources(validResources);
                  totalResourcesResolved += resolvedResources.length;

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

          const endTime = Date.now();
          const duration = endTime - startTime;

          debugLogger.info("🎉 Génération terminée avec succès", {
            totalQuests: questsWithResolvedResources.length,
            totalResourcesFound: totalValidResources,
            totalResourcesResolved,
            duration: `${duration}ms`,
            attempts: attempt,
            averageTimePerQuest: `${Math.round(duration / questsWithResolvedResources.length)}ms`,
          });

          return questsWithResolvedResources;
        } else {
          debugLogger.warn(`⚠️ Tentative ${attempt} a retourné des résultats vides`);
          if (attempt < maxRetries) {
            const delay = attempt * 1000; // Progressive delay: 1s, 2s, 3s
            debugLogger.info(`⏳ Attente de ${delay}ms avant nouvelle tentative`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        debugLogger.error(`❌ Échec de la tentative ${attempt}`, {
          error: lastError.message,
          stack: lastError.stack,
          attempt,
          context: {
            provider: context.aiProvider,
            instructionLength: context.instruction.length,
          },
        });

        if (attempt < maxRetries) {
          const delay = attempt * 1000; // Progressive delay: 1s, 2s, 3s
          debugLogger.info(`⏳ Attente de ${delay}ms avant nouvelle tentative`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    debugLogger.error(`💥 Échec de toutes les ${maxRetries} tentatives`, {
      lastError: lastError?.message,
      totalDuration: `${duration}ms`,
      context: {
        hasInstruction: !!context.instruction,
        provider: context.aiProvider,
        instructionLength: context.instruction.length,
      },
      statistics: {
        totalAttempts: maxRetries,
        averageTimePerAttempt: `${Math.round(duration / maxRetries)}ms`,
      },
    });

    return [];
  };

  return { generate, isResolving, error };
};