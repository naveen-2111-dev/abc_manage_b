import { NextRequest, NextResponse } from "next/server";
import { EventService } from "./event.service";

const validStatuses = ["scheduled", "ongoing", "completed"] as const;

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();
        const eventService = new EventService();
        const result = await eventService.createEvent(payload);

        return NextResponse.json({ message: "Event created successfully", event: result });
    } catch (error) {
        return NextResponse.json(
            { error: `Event creation failed: ${error instanceof Error ? error.message : "Unknown error"}` },
            { status: 400 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const payload = await request.json();
        const eventService = new EventService();
        const result = await eventService.revokeEvent(payload);

        return NextResponse.json({ message: "Event revoked successfully", result });
    } catch (error) {
        return NextResponse.json(
            { error: `Event revoke failed: ${error instanceof Error ? error.message : "Unknown error"}` },
            { status: 400 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const eventService = new EventService();
        const { searchParams } = new URL(request.url);

        const eventId = searchParams.get("eventId");
        const status = searchParams.get("status");

        if (eventId) {
            const event = await eventService.getEventById(eventId);

            if (!event) {
                return NextResponse.json({ error: "Event not found" }, { status: 404 });
            }

            return NextResponse.json(event);
        }

        if (status) {
            if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
                return NextResponse.json(
                    { error: "Invalid status. Allowed values: scheduled, ongoing, completed" },
                    { status: 400 }
                );
            }

            const groupedEvents = await eventService.getEventsByStatus(
                status as (typeof validStatuses)[number]
            );
            return NextResponse.json(groupedEvents);
        }

        const events = await eventService.getAllEvents();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json(
            { error: `Failed to fetch events: ${error instanceof Error ? error.message : "Unknown error"}` },
            { status: 500 }
        );
    }
}
