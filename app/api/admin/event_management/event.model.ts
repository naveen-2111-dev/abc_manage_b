import { Collection, getCollection } from "@/helper/db/get_collection";
import { CreateEventInput, RevokeEventInput } from "./event.schema";
import { ObjectId } from "mongodb";

export class EventModel {
    async createEvent(input: CreateEventInput) {
        const collection = await getCollection(Collection.EVENTS);

        const res = await collection.insertOne(input);
        return res;
    }

    async revokeEvent(input: RevokeEventInput) {
        const collection = await getCollection(Collection.EVENTS);

        const res = await collection.deleteOne({ _id: new ObjectId(input.eventId) });
        return res;
    }

    async getAllEvents() {
        const collection = await getCollection(Collection.EVENTS);
        const res = await collection.find({}).toArray();
        return res;
    }

    async getEventsByStatus(status: "scheduled" | "ongoing" | "completed") {
        const collection = await getCollection(Collection.EVENTS);
        const res = await collection.aggregate([
            {
                $match: {
                    status: status
                }
            },
            {
                $group: {
                    _id: "$status",
                    events: { $push: "$$ROOT" },
                },
            },
        ]).toArray();
        return res;
    }

    async getEventById(eventId: string) {
        const collection = await getCollection(Collection.EVENTS);
        const res = await collection.findOne({ _id: new ObjectId(eventId) });
        return res;
    }
}