import { EventModel } from "./event.model";
import { CreateEventInput, CreateEventSchema, RevokeEventSchema } from "./event.schema";
import { z } from "zod";

type RevokeEventInput = z.infer<typeof RevokeEventSchema>;

export class EventService {
    async createEvent(eventData: CreateEventInput) {
        const event_model = new EventModel();

        const validate = await CreateEventSchema.safeParseAsync(eventData);

        if (!validate.success) {
            throw new Error("Invalid event data");
        }

        const res = await event_model.createEvent(validate.data);
        return res;
    }

    async revokeEvent(revokeData: RevokeEventInput) {
        const event_model = new EventModel();

        const validate = await RevokeEventSchema.safeParseAsync(revokeData);

        if (!validate.success) {
            throw new Error("Invalid revoke event data");
        }

        const res = await event_model.revokeEvent(validate.data);
        return res;
    }

    async getAllEvents() {
        const event_model = new EventModel();
        const res = await event_model.getAllEvents();
        return res;
    }

    async getEventsByStatus(status: "scheduled" | "ongoing" | "completed") {
        const event_model = new EventModel();
        const res = await event_model.getEventsByStatus(status);
        return res;
    }

    async getEventById(eventId: string) {
        const event_model = new EventModel();
        const res = await event_model.getEventById(eventId);
        return res;
    }
}