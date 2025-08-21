import { useEffect, useRef, useState } from "react";
import StreamingAvatar, { AvatarQuality, StreamingEvents, STTProvider } from "@heygen/streaming-avatar";
import type { QuestAiType } from "@/shared/types/ai/ai.type";
import { generateQuestsFromAI } from "@/modules/canvas/generate-quests-from-ai";

/**
 * HeyGen interactive avatar that listens to user's voice and generates quests
 * using the existing AI quest generation utilities.
 */
export const HeygenQuestAvatar = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState("initialisation en cours...");
  const [quests, setQuests] = useState<QuestAiType[]>([]);

  useEffect(() => {
    const startAvatar = async () => {
      const token = import.meta.env.VITE_HEYGEN_TOKEN as string | undefined;
      const avatarName = import.meta.env.VITE_HEYGEN_AVATAR as string | undefined;
      const voiceId = import.meta.env.VITE_HEYGEN_VOICE as string | undefined;

      if (!token || !avatarName) {
        setStatus("Token HeyGen ou avatar manquant");
        return;
      }

      const client = new StreamingAvatar({ token });
      let buffer = "";

      client.on(StreamingEvents.STREAM_READY, () => {
        setStatus("Prêt");
        if (videoRef.current && client.mediaStream) {
          videoRef.current.srcObject = client.mediaStream;
        }
      });

      client.on(StreamingEvents.USER_TALKING_MESSAGE, (e) => {
        buffer += e.message;
      });

      client.on(StreamingEvents.USER_END_MESSAGE, async () => {
        const instruction = buffer.trim();
        buffer = "";
        if (instruction) {
          const newQuests = await generateQuestsFromAI({
            instruction,
            aiProvider: "openai",
            existingQuests: [],
            format: {},
          });
          setQuests(newQuests);
        }
      });

      await client.createStartAvatar({
        avatarName,
        quality: AvatarQuality.Medium,
        voice: voiceId ? { voiceId } : undefined,
        sttSettings: { provider: STTProvider.DEEPGRAM },
      });

      await client.startVoiceChat({ isInputAudioMuted: false });
    };

    startAvatar();
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video ref={videoRef} autoPlay playsInline className="w-64 h-64 rounded-lg bg-black" />
      <p className="text-white text-sm">{status}</p>
      {quests.length > 0 && (
        <div className="w-full max-w-md text-left text-white">
          <h3 className="text-lg font-semibold mb-2">Quêtes générées</h3>
          <ul className="space-y-2">
            {quests.map((q, idx) => (
              <li key={idx} className="p-2 rounded bg-slate-800">
                <h4 className="font-medium">{q.title}</h4>
                <p className="text-sm">{q.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HeygenQuestAvatar;
