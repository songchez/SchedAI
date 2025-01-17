import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarList,
  getCalendarEvents,
  addEventToCalendar,
  updateEventInCalendar,
  deleteEventFromCalendar,
  searchEvents,
} from "@/lib/googleClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const calendarId = searchParams.get("calendarId");
  const query = searchParams.get("query");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    if (query) {
      const events = await searchEvents(userId, calendarId!, query);
      return NextResponse.json(events);
    }

    const calendars = calendarId
      ? await getCalendarEvents(userId, calendarId)
      : await getCalendarList(userId);
    return NextResponse.json(calendars);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId, calendarId, eventDetails } = await req.json();

  if (!userId || !calendarId || !eventDetails) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const newEvent = await addEventToCalendar(userId, calendarId, eventDetails);
    return NextResponse.json(newEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { userId, calendarId, eventId, eventDetails } = await req.json();

  if (!userId || !calendarId || !eventId || !eventDetails) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const updatedEvent = await updateEventInCalendar(
      userId,
      calendarId,
      eventId,
      eventDetails
    );
    return NextResponse.json(updatedEvent);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { userId, calendarId, eventId } = await req.json();

  if (!userId || !calendarId || !eventId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await deleteEventFromCalendar(userId, calendarId, eventId);
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
