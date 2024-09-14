import { z } from "zod";

export const userFormValidation = z.object({
  name: z
    .string()
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name must be less then 50 characters"),
  email: z.string().email("Invalid Email Address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});
