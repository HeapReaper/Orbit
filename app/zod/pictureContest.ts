import { z } from "zod";

export const pictureContestItemSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Contest name is required"),
  contestChannel: z.string().min(1, "Contest channel is required"),
  announceChannel: z.string().min(1, "Announcement channel is required"),
  voteEmoji: z.string().min(1, "Vote emoji is required"),
  voteType: z.enum(["highest", "fixed"]),
  requiredVotes: z.number().nullable().optional(),
  schedule: z.enum(["start_month", "end_month", "weekly"]),
  enabled: z.boolean(),
});

export const pictureContestBodySchema = z.object({
  guildId: z.string().min(1, "guildId is required"),
  contests: z.array(pictureContestItemSchema),
});