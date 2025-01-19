import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarList,
  getCalendarEvents,
  addEventToCalendar,
  updateEventInCalendar,
  deleteEventFromCalendar,
  searchEvents,
} from "@/lib/googleClient";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const calendarId = searchParams.get("calendarId");
  const query = searchParams.get("query");
  const session = await auth();
  const userId = session?.user.id;

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { calendarId, eventDetails } = await req.json();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId || !calendarId || !eventDetails) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const newEvent = await addEventToCalendar(userId, calendarId, eventDetails);
    return NextResponse.json(newEvent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { calendarId, eventId, eventDetails } = await req.json();
  const session = await auth();
  const userId = session?.user.id;

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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { calendarId, eventId } = await req.json();
  const session = await auth();
  const userId = session?.user.id;

  if (!userId || !calendarId || !eventId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    await deleteEventFromCalendar(userId, calendarId, eventId);
    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
