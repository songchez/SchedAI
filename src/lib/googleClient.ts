import { google } from "googleapis";

export async function addEventToCalendar(auth, eventDetails) {
  const calendar = google.calendar({ version: "v3", auth });
  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: eventDetails,
  });
  return response.data;
}
