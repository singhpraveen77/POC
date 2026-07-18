import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  description: z.string().optional(),
  workspaceId: z.string().uuid("Invalid workspace ID")
});

export const updateBoardSchema = z.object({
  name: z.string().min(1, "Board name is required").optional(),
  description: z.string().optional(),
  position: z.number().int().min(0).optional()
});
