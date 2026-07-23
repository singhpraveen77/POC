import { z } from "zod";

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),

    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username cannot exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Only letters, numbers and underscore are allowed"
      )
      .optional(),

    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.username !== undefined ||
      data.email !== undefined,
    {
      message: "At least one field is required",
    }
  );