import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

/**
 * Creates a Google Calendar client for the authenticated user.
 * Fetches the access token from the database.
 * @param userId The ID of the user.
 * @returns Google Calendar client instance.
 */
export async function createGoogleCalendarClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("No access token available");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: account.access_token });

  return google.calendar({ version: "v3", auth });
}

/**
 * Fetches the list of calendars accessible by the authenticated user.
 * @param userId The ID of the user.
 * @returns List of calendars.
 */
export async function getCalendarList(userId: string) {
  const calendarClient = await createGoogleCalendarClient(userId);
  const response = await calendarClient.calendarList.list();
  return response.data.items || [];
}

/**
 * Fetches events from a specific calendar.
 * @param userId The ID of the user.
 * @param calendarId The ID of the calendar.
 * @returns List of events.
 */
export async function getCalendarEvents(userId: string, calendarId: string) {
  const calendarClient = await createGoogleCalendarClient(userId);
  const response = await calendarClient.events.list({
    calendarId,
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items || [];
}

/**
 * Adds a new event to a specific calendar.
 * @param userId The ID of the user.
 * @param calendarId The ID of the calendar.
 * @param eventDetails The event details to be added.
 * @returns The newly created event.
 */
export async function addEventToCalendar(
  userId: string,
  calendarId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventDetails: any
) {
  const calendarClient = await createGoogleCalendarClient(userId);
  const response = await calendarClient.events.insert({
    calendarId,
    requestBody: eventDetails,
  });

  return response.data;
}

/**
 * Updates an event in a specific calendar.
 * @param userId The ID of the user.
 * @param calendarId The ID of the calendar.
 * @param eventId The ID of the event to update.
 * @param eventDetails The updated event details.
 * @returns The updated event.
 */
export async function updateEventInCalendar(
  userId: string,
  calendarId: string,
  eventId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventDetails: any
) {
  const calendarClient = await createGoogleCalendarClient(userId);
  const response = await calendarClient.events.update({
    calendarId,
    eventId,
    requestBody: eventDetails,
  });

  return response.data;
}

/**
 * Deletes an event from a specific calendar.
 * @param userId The ID of the user.
 * @param calendarId The ID of the calendar.
 * @param eventId The ID of the event to delete.
 */
export async function deleteEventFromCalendar(
  userId: string,
  calendarId: string,
  eventId: string
) {
  const calendarClient = await createGoogleCalendarClient(userId);
  await calendarClient.events.delete({
    calendarId,
    eventId,
  });
}

/**
 * Fetches tasks from the user's default task list.
 * @param userId The ID of the user.
 * @returns List of tasks.
 */
export async function getTasksFromList(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("No access token available");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: account.access_token });

  const tasksClient = google.tasks({ version: "v1", auth });
  const response = await tasksClient.tasks.list({
    tasklist: "@default",
  });

  return response.data.items || [];
}

/**
 * Adds a task to the user's default task list.
 * @param userId The ID of the user.
 * @param title The task title.
 * @param dueDate The due date of the task (optional).
 * @returns The newly created task.
 */
export async function addTaskToList(
  userId: string,
  title: string,
  dueDate?: string
) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("No access token available");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: account.access_token });

  const tasksClient = google.tasks({ version: "v1", auth });
  const response = await tasksClient.tasks.insert({
    tasklist: "@default",
    requestBody: {
      title,
      due: dueDate || undefined,
    },
  });

  return response.data;
}

/**
 * Deletes a task from the user's default task list.
 * @param userId The ID of the user.
 * @param taskId The ID of the task to delete.
 */
export async function deleteTaskFromList(userId: string, taskId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("No access token available");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: account.access_token });

  const tasksClient = google.tasks({ version: "v1", auth });
  await tasksClient.tasks.delete({
    tasklist: "@default",
    task: taskId,
  });
}

/**
 * Searches events in a specific calendar.
 * @param userId The ID of the user.
 * @param calendarId The ID of the calendar.
 * @param query Search term to look for in event titles or descriptions.
 * @returns List of matching events.
 */
export async function searchEvents(
  userId: string,
  calendarId: string,
  query: string
) {
  const calendarClient = await createGoogleCalendarClient(userId);
  const response = await calendarClient.events.list({
    calendarId,
    q: query,
    timeMin: new Date().toISOString(),
  });
  return response.data.items || [];
}

// /**
//  * Sends notifications for upcoming events within the next hour.
//  * @param userId The ID of the user.
//  * @param calendarId The ID of the calendar.
//  */
// export async function notifyUserForUpcomingEvents(
//   userId: string,
//   calendarId: string
// ) {
//   const events = await getCalendarEvents(userId, calendarId);
//   const now = new Date();
//   const upcomingEvents = events.filter((event) => {
//     const startTime = new Date(event.start?.dateTime || event.start?.date);
//     return startTime > now && startTime < new Date(now.getTime() + 3600000);
//   });

//   if (upcomingEvents.length > 0) {
//     console.log(
//       `User ${userId} has ${upcomingEvents.length} upcoming events within the next hour.`
//     );
//     // Additional logic for sending notifications (e.g., email, push notification)
//   }
// }
