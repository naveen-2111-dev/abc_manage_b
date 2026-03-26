import clientPromise from "./mongo_client";

export enum Collection {
    USER = "users",
    EVENTS = "events",
    RSVPS = "rsvps",
    EVENT_FEEDBACK = "event_feedback"
}

async function connect() {
    try {
        const client = await clientPromise;
        console.log("MongoDB connected");
        const db = client.db("abc_club");

        return db;
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}

export async function getCollection(collectionName: Collection) {
    const db = await connect();
    console.log(db)
    return db.collection(collectionName);
}