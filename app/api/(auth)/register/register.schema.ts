import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    dept: z.string().min(1, "Department is required").default("IOT"),
});

export type RegisterInput = z.infer<typeof registerSchema>;