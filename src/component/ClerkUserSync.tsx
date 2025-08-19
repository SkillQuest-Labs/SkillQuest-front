import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function ClerkUserSync() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const ClerkUserSync = async () => {
      try {
        await fetch("http://localhost:1338/api/webhooks/clerk", {
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
      } catch (error) {
        console.error("Failed to sync Clerk user:", error);
      }
    };

    ClerkUserSync();
  }, [user]);

  return null;
}
