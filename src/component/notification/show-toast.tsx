import { toast } from "sonner";

type ToastStatus = "success" | "info" | "warning" | "error" | "loading" | "default";

type ToastOptions = {
  title: string;
  description?: string;
  status?: ToastStatus | null;
  duration?: number;
};

export const showToast = ({ title, description, status = null, duration }: ToastOptions) => {
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
    return;
  }

  if (status === "error") {
    toast.error(title, {
      description: description,
      icon: "⚠️",
      duration: duration,
      style: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.3)",
        color: "#b91c1c",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(239, 68, 68, 0.15)",
        backdropFilter: "blur(8px)",
      },
    });
    return;
  }

  if (status === "warning") {
    toast.warning(title, {
      description: description,
      icon: "⚠️",
      duration: duration,
      style: {
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        borderColor: "rgba(245, 158, 11, 0.3)",
        color: "#d97706",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
        backdropFilter: "blur(8px)",
      },
    });
    return;
  }

  if (status === "info") {
    toast.info(title, {
      description: description,
      icon: "ℹ️",
      duration: duration,
      style: {
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "rgba(59, 130, 246, 0.3)",
        color: "#1d4ed8",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
        backdropFilter: "blur(8px)",
      },
    });
    return;
  }

  // Default case (when status is null or undefined)
  toast(title, {
    description: description,
    duration: duration,
    style: {
      backgroundColor: "rgba(51, 65, 85, 0.1)",
      borderColor: "rgba(51, 65, 85, 0.3)",
      color: "#334155",
      borderWidth: "2px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(51, 65, 85, 0.15)",
      backdropFilter: "blur(8px)",
    },
  });
};
