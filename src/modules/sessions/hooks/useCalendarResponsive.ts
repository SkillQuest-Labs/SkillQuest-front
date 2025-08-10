import { useEffect, useState } from "react";

const computeResponsiveView = () => {
  const w = window.innerWidth;
  if (w < 768) return "timeGridDay";
  if (w < 1024) return "timeGridWeek";
  return "dayGridMonth";
};

export function useCalendarResponsive() {
  const [initialView, setInitialView] = useState<string>(computeResponsiveView());

  useEffect(() => {
    const onResize = () => setInitialView(computeResponsiveView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return initialView;
}
