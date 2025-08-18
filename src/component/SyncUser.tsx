// src/component/SyncUser.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function SyncUser() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    console.log("👤 Utilisateur Clerk détecté :", {
      id: user.id,
      username: user.username,
      email: user.primaryEmailAddress?.emailAddress,
    });

    const syncUser = async () => {
      try {
        const res = await fetch("http://localhost:1338/api/webhooks/clerk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            username: user.username,
            email: user.primaryEmailAddress?.emailAddress,
          }),
        });

        console.log("📡 Statut réponse backend :", res.status);

        const data = await res.json();
        console.log("✅ Réponse backend :", data);
      } catch (error) {
        console.error("❌ Erreur lors de la synchro utilisateur :", error);
      }
    };

    syncUser();
  }, [user]);

  return null; // Pas besoin d'affichage
}
