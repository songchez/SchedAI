import { NextResponse } from "next/server";
import {
  getCalendarList,
  getCalendarEvents,
  addEventToCalendar,
} from "@/lib/googleClient";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("accessToken");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token missing" },
      { status: 400 }
    );
  }

  try {
    const calendars = await getCalendarList(accessToken);
    return NextResponse.json({ success: true, calendars });
  } catch (error) {
    console.error("Error fetching calendars:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { calendarId, eventDetails, accessToken } = await req.json();

  if (!calendarId || !eventDetails || !accessToken) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const event = await addEventToCalendar(
      calendarId,
      eventDetails,
      accessToken
    );
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Error adding event:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
