import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import type { calendar_v3, tasks_v1 } from "googleapis";

/* ------------------------------------------------------------------
 * 1. 공통 함수: Google OAuth2 Client 생성
 *    - userId 로 DB에서 access token 을 조회해, 인증 객체를 생성합니다.
 * ------------------------------------------------------------------ */
async function getGoogleAuthClient(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });

  if (!account || !account.access_token) {
    throw new Error("No access token available");
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: account.access_token });

  return auth;
}

/* ------------------------------------------------------------------
 * 2. 캘린더/태스크 클라이언트 생성 함수
 * ------------------------------------------------------------------ */
async function createGoogleCalendarClient(
  userId: string
): Promise<calendar_v3.Calendar> {
  const auth = await getGoogleAuthClient(userId);
  return google.calendar({ version: "v3", auth });
}

async function createGoogleTasksClient(
  userId: string
): Promise<tasks_v1.Tasks> {
  const auth = await getGoogleAuthClient(userId);
  return google.tasks({ version: "v1", auth });
}

/* ------------------------------------------------------------------
 * 3. 캘린더 관련 함수
 * ------------------------------------------------------------------ */

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
export async function getCalendarEvents(
  userId: string,
  calendarId: string,
  timeMin: string,
  timeMax: string,
  maxResults: number
) {
  const calendarClient = await createGoogleCalendarClient(userId);
  const response = await calendarClient.events.list({
    calendarId,
    // timeMin(Start)부터 timeMax(End)까지의 이벤트
    timeMin: timeMin,
    timeMax: timeMax,
    maxResults: maxResults,
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
  eventDetails: {
    summary: string;
    location?: string;
    description?: string;
    start: { date: string };
    end: { date: string };
  }
) {
  const calendarClient = await createGoogleCalendarClient(userId);

  const requestBody = {
    summary: eventDetails.summary,
    location: eventDetails.location || "",
    description: eventDetails.description || "",
    start: eventDetails.start,
    end: eventDetails.end,
  };

  const response = await calendarClient.events.insert({
    calendarId,
    requestBody,
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
// 필요한 타입에 따라 수정 가능합니다. (예: Partial<calendar_v3.Schema$Event>)
export async function updateEventInCalendar(
  userId: string,
  calendarId: string,
  eventId: string,
  eventDetails: Record<string, unknown>
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

/* ------------------------------------------------------------------
 * 4. 태스크 관련 함수
 * ------------------------------------------------------------------ */

/**
 * Fetches tasks from a specified task list.
 * @param userId The ID of the user.
 * @param taskListId The ID of the task list (default: "@default").
 * @param options Query parameters for filtering tasks (optional).
 * @returns List of tasks.
 */
export async function getTasksFromList(
  userId: string,
  taskListId = "@default"
) {
  const tasksClient = await createGoogleTasksClient(userId);
  const response = await tasksClient.tasks.list({
    tasklist: taskListId,
  });
  return response.data.items || [];
}

/**
 * Adds a task to a specified task list.
 * @param userId The ID of the user.
 * @param taskListId The ID of the task list (default: "@default").
 * @param title The task title.
 * @param dueDate The due date of the task (optional).
 * @param notes Additional notes for the task (optional).
 * @returns The newly created task.
 */
export async function addTaskToList(
  userId: string,
  title: string,
  dueDate?: string,
  notes?: string,
  taskListId = "@default"
) {
  const tasksClient = await createGoogleTasksClient(userId);
  const response = await tasksClient.tasks.insert({
    tasklist: taskListId,
    requestBody: {
      title,
      due: dueDate || undefined,
      notes: notes || undefined,
    },
  });
  return response.data;
}

/**
 * Deletes a task from a specified task list.
 * @param userId The ID of the user.
 * @param taskId The ID of the task to delete.
 * @param taskListId The ID of the task list (default: "@default").
 */
export async function deleteTaskFromList(
  userId: string,
  taskId: string,
  taskListId = "@default"
) {
  const tasksClient = await createGoogleTasksClient(userId);
  await tasksClient.tasks.delete({
    tasklist: taskListId,
    task: taskId,
  });
}

/**
 * Updates a task in a specified task list.
 * @param userId The ID of the user.
 * @param taskId The ID of the task to update.
 * @param updates The fields to update in the task.
 * @param taskListId The ID of the task list (default: "@default").
 * @returns The updated task.
 */
export async function updateTaskInList(
  userId: string,
  taskId: string,
  updates: {
    title?: string;
    due?: string;
    notes?: string;
    status?: "needsAction" | "completed";
  },
  taskListId = "@default"
) {
  const tasksClient = await createGoogleTasksClient(userId);
  const response = await tasksClient.tasks.patch({
    tasklist: taskListId,
    task: taskId,
    requestBody: updates,
  });
  return response.data;
}

/**
 * Clears all completed tasks from a specified task list.
 * @param userId The ID of the user.
 * @param taskListId The ID of the task list (default: "@default").
 */
export async function clearCompletedTasks(
  userId: string,
  taskListId = "@default"
) {
  const tasksClient = await createGoogleTasksClient(userId);
  await tasksClient.tasks.clear({
    tasklist: taskListId,
  });
}

/**
 * Moves a task to a new position in a specified task list.
 * @param userId The ID of the user.
 * @param taskId The ID of the task to move.
 * @param taskListId The ID of the task list (default: "@default").
 * @param parentId The ID of the new parent task (optional).
 * @param previousId The ID of the task's new previous sibling (optional).
 * @returns The moved task.
 */
export async function moveTaskInList(
  userId: string,
  taskId: string,
  taskListId = "@default",
  parentId?: string,
  previousId?: string
) {
  const tasksClient = await createGoogleTasksClient(userId);
  const response = await tasksClient.tasks.move({
    tasklist: taskListId,
    task: taskId,
    parent: parentId || undefined,
    previous: previousId || undefined,
  });
  return response.data;
}
