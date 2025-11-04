import { z } from "zod";

export const botSettingsSchema = z.object({
  guildId: z.string().min(1, "Guild ID is required"),
  nickname: z.string().min(1, "Nickname cannot be empty").max(15, "Nickname too long"),
  language: z.enum(["en", "nl"]).refine(val => !!val, {message: "Language is required",}),
  updatesChannel: z.string().optional().nullable(),
  timezone: z.string().min(1, "Timezone is required"),
  primaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid primary color"),
  secondaryColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid secondary color"),
});