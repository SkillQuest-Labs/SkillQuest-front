import { useEffect, useState } from "react";
import { computeResponsiveView } from "../utils/session.utils";

export function useCalendarResponsive() {
  const [initialView, setInitialView] = useState<string>(computeResponsiveView());

  useEffect(() => {
    const onResize = () => setInitialView(computeResponsiveView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return initialView;
}
