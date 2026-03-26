import z from 'zod';

export const CreateEventSchema = z.object({
    name: z.string().min(1, "Event name is required"),
    description: z.string().optional(),
    date: z.string().refine((date) => !Number.isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    location: z.string().optional(),
    status: z.enum(["scheduled", "ongoing", "completed"]).optional(),
    agenda: z.array(z.string()).optional(),
});

export const RevokeEventSchema = z.object({
    eventId: z.string().min(1, "Event ID is required"),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type RevokeEventInput = z.infer<typeof RevokeEventSchema>;