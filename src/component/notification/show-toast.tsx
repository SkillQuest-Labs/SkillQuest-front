import { toast } from "sonner";

type ToastStatus = "normal" | "action" | "success" | "info" | "warning" | "error" | "loading" | "default";

type ToastOptions = {
  title: string;
  description: string;
  status?: ToastStatus;
  duration?: number;
};

export const showQuestCreatedToast = ({ title, description, status, duration }: ToastOptions) => {
  if (status === "success") {
    toast.success(title, {
      description: description,
      icon: "🎉",
      duration: duration,
      style: {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "rgba(34, 197, 94, 0.3)",
        color: "#15803d",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(34, 197, 94, 0.15)",
        backdropFilter: "blur(8px)",
      },
    });
  }
};
