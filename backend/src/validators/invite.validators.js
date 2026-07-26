import { z } from "zod";

export const sendInviteSchema = z.object({
  invitedUserId: z.string().min(1, "Invited user ID is required"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"])
});
