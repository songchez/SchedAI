import { NextResponse } from "next/server";
import { createOAuthClient, listCalendarEvents } from "@/lib/googleClient";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const auth = await createOAuthClient();
    auth.setCredentials({ access_token: token });

    const events = await listCalendarEvents(auth);

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
