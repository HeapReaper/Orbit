import { z } from "zod";

export const birthdaySettingsSchema = z.object({
  guildId: z.string().min(1, "Guild ID is required"),
  channel: z.string().min(1, "Channel is required"),
  message: z.string().min(1, "Message is required").max(254, "Max 254 characters"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  enabled: z.boolean(),
});