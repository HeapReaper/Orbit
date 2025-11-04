import { ZodError } from "zod";
import { useNotification } from "@/app/context/NotificationContext";

export function useHandleZodErrors() {
  const { notify } = useNotification();

  return (error: ZodError): Record<string, string> => {
    const fieldErrors = error.flatten().fieldErrors;
    const formatted: Record<string, string> = {};

    Object.entries(fieldErrors).forEach(([key, value]) => {
      const messages = value as string[] | undefined;
      if (messages && messages.length > 0) {
        formatted[key] = messages[0];
        notify("Validation error", messages[0], "error");
      }
    });

    return formatted;
  };
}