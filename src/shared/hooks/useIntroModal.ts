import { useEffect, useMemo, useState } from "react";

/**
 * Affiche une intro une seule fois par utilisateur (persistée en localStorage).
 * - version : permet de “reset” l’intro si le texte change (v2, v3, …)
 */
export function useIntroModal(userId?: string, version = "v1") {
  const storageKey = useMemo(() => (userId ? `sq:intro_seen:${version}:${userId}` : null), [userId, version]);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    const seen = localStorage.getItem(storageKey);
    if (!seen) setOpen(true);
  }, [storageKey]);

  const close = (dontShowAgain = true) => {
    setOpen(false);
    if (dontShowAgain && storageKey) localStorage.setItem(storageKey, "1");
  };

  const reopen = () => setOpen(true);

  return { open, close, reopen };
}
