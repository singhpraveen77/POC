import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  slug: z.string().min(1, "Workspace slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only")
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").optional(),
  slug: z.string().min(1, "Workspace slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric and hyphens only").optional()
});
