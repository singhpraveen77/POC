import { z } from "zod";

export const createColumnSchema = z.object({
  name: z.string().min(1, "Column name is required"),
  boardId: z.string().uuid("Invalid board ID")
});

export const updateColumnSchema = z.object({
  name: z.string().min(1, "Column name is required").optional(),
  position: z.number().int().min(0).optional()
});
