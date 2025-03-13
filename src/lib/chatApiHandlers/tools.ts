// app/api/chat/tools.ts
import { z } from "zod";
import { auth } from "@/auth";
import {
  addEventToCalendar,
  addTaskToList,
  deleteEventFromCalendar,
  deleteTaskFromList,
  getCalendarEvents,
  getTasksFromList,
  updateEventInCalendar,
  updateTaskInList,
} from "@/lib/googleClient";

/**
 * 2. 특정 캘린더의 이벤트 조회
 */
export const getCalendarEventsTool = {
  description: "Get user events at google calendar",
  parameters: z.object({
    calendarId: z.string(),
    timeMin: z.string().describe("start date in ISO 8601 format"),
    timeMax: z.string().describe("end date in ISO 8601 format"),
    maxResults: z.number().describe("최대 이벤트 개수"),
    message: z
      .string()
      .optional()
      .describe(
        "표시할 메시지, 물어볼 내용이 있다면 질문, 추가설명이 필요하다면 설명"
      ),
  }),
  execute: async ({
    calendarId,
    timeMin,
    timeMax,
    maxResults,
    message,
  }: {
    calendarId: string;
    timeMin: string;
    timeMax: string;
    maxResults: number;
    message?: string;
  }) => {
    const session = await auth();
    const userId = session?.user.id;

    try {
      const events = await getCalendarEvents(
        userId,
        calendarId,
        timeMin,
        timeMax,
        maxResults
      );

      return { events, message };
    } catch (error) {
      console.error("Calendar events fetch error:", error);
      throw error;
    }
  },
};

/**
 * 3. 일정 추가
 */
export const addEventToCalendarTool = {
  description: "add new event on google calendar",
  parameters: z.object({
    calendarId: z.string(),
    eventDetails: z.object({
      summary: z.string(),
      location: z.string().optional(),
      description: z.string().optional(),
      start: z.object({
        dateTime: z.string(),
        timeZone: z.string().describe("GMT+09:00"),
      }),
      end: z.object({
        dateTime: z.string(),
        timeZone: z.string().describe("GMT+09:00"),
      }),
    }),
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({
    calendarId,
    eventDetails,
    message,
  }: {
    calendarId: string;
    eventDetails: {
      summary: string;
      location?: string;
      description?: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
    };
    message?: string;
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      const newEvent = await addEventToCalendar(
        userId,
        calendarId,
        eventDetails
      );

      // 결과 객체에 message 추가 (있는 경우만)
      return { event: newEvent, message };
    } catch (error) {
      console.error("Event addition error:", error);
      throw error;
    }
  },
};

/**
 * 4. UpdateEventInCalendar
 */
export const updateEventInCalendarTool = {
  description:
    "update(modify) existing event at google calendar. In order to use update, eventId is necessary.",
  parameters: z.object({
    calendarId: z.string(),
    eventId: z
      .string()
      .describe(
        "Find the eventId from past messages. 'result.event.id' is the eventId."
      ),
    eventDetails: z.object({
      summary: z.string().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
      start: z.object({
        dateTime: z.string().optional(),
        timeZone: z.string().optional().describe("GMT+09:00"),
      }),
      end: z.object({
        dateTime: z.string().optional(),
        timeZone: z.string().optional().describe("GMT+09:00"),
      }),
    }),
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({
    calendarId,
    eventId,
    eventDetails,
    message,
  }: {
    calendarId: string;
    eventId: string;
    eventDetails: {
      summary?: string;
      location?: string;
      description?: string;
      start?: { dateTime?: string; timeZone?: string };
      end?: { dateTime?: string; timeZone?: string };
    };
    message?: string;
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      const updatedEvent = await updateEventInCalendar(
        userId,
        calendarId,
        eventId,
        eventDetails
      );

      if (!updatedEvent) {
        throw new Error("캘린더 이벤트를 업데이트하지 못했습니다.");
      }

      return { event: updatedEvent, message };
    } catch (error) {
      console.error("Event update error:", error);
      throw error;
    }
  },
};

/**
 * 5. DeleteEventFromCalendar
 */
export const deleteEventFromCalendarTool = {
  description: "delete existing event at google calendar.",
  parameters: z.object({
    calendarId: z.string(),
    eventId: z
      .string()
      .describe(
        "Find the eventId from past messages. 'result.event.id' is the eventId."
      ),
    eventDetails: z.object({
      summary: z.string().optional(),
      location: z.string().optional(),
      description: z.string().optional(),
      start: z.object({
        dateTime: z.string().optional(),
        timeZone: z.string().optional().describe("GMT+09:00"),
      }),
      end: z.object({
        dateTime: z.string().optional(),
        timeZone: z.string().optional().describe("GMT+09:00"),
      }),
    }),
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({
    calendarId,
    eventId,
    eventDetails,
    message,
  }: {
    calendarId: string;
    eventId: string;
    eventDetails: {
      summary?: string;
      location?: string;
      description?: string;
      start?: { dateTime?: string; timeZone?: string };
      end?: { dateTime?: string; timeZone?: string };
    };
    message?: string;
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      const response = await deleteEventFromCalendar(
        userId,
        calendarId,
        eventId
      );

      if (!response.status) {
        throw new Error("캘린더 이벤트를 삭제하지 못했습니다.");
      }

      // 삭제된 이벤트 정보 반환
      const deletedEvent = {
        id: eventId,
        summary: eventDetails.summary,
        status: "deleted",
        success: true,
      };

      return { event: deletedEvent, message };
    } catch (error) {
      console.error("Event deletion error:", error);
      throw error;
    }
  },
};

/**
 * 6. getTasksFromListTool
 */
export const getTasksFromListTool = {
  description: "Fetch tasks from a Google Task list",
  parameters: z.object({
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({ message }: { message?: string }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      // 작업 리스트 가져오기
      const tasks = await getTasksFromList(userId);

      return { tasks, message };
    } catch (error) {
      console.error("Tasks fetch error:", error);
      throw error;
    }
  },
};

/**
 * 7. addTaskToListTool
 */
export const addTaskToListTool = {
  description: "Add a new task to a Google Task list",
  parameters: z.object({
    title: z.string().describe("The title of the task"),
    due: z
      .string()
      .optional()
      .describe("format => '2025-02-01T00:00:00+09:00'"),
    notes: z.string().optional().describe("Additional notes for the task"),
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({
    title,
    due,
    notes,
    message,
  }: {
    title: string;
    due?: string;
    notes?: string;
    message?: string;
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      const newTask = await addTaskToList(userId, title, due, notes);

      return { task: newTask, message };
    } catch (error) {
      console.error("Task addition error:", error);
      throw error;
    }
  },
};

/**
 * 8. updateTaskInListTool
 */
export const updateTaskInListTool = {
  description: "Update a task in a Google Task List.",
  parameters: z.object({
    taskId: z
      .string()
      .describe(
        "Find the taskId from past messages. 'result.task.id' is the taskId."
      ),
    title: z.string().optional().describe("The new title of the task."),
    dueDate: z
      .string()
      .optional()
      .describe("The new due date. format => '2025-02-01T00:00:00+09:00'"),
    notes: z.string().optional().describe("The new notes for the task."),
    status: z
      .string()
      .optional()
      .describe(
        "The new status of the task. Enum Options: 'needsAction' or 'completed'."
      ),
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({
    taskId,
    title,
    dueDate,
    notes,
    status,
    message,
  }: {
    taskListId?: string;
    taskId: string;
    title?: string;
    dueDate?: string;
    notes?: string;
    status?: "needsAction" | "completed";
    message?: string;
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      // 업데이트 데이터 준비
      const updateData: Record<string, unknown> = {};
      if (title) updateData.title = title;
      if (dueDate) updateData.due = dueDate;
      if (notes) updateData.notes = notes;
      if (status) updateData.status = status;

      if (Object.keys(updateData).length === 0) {
        throw new Error("업데이트할 내용이 없습니다.");
      }

      const updatedTask = await updateTaskInList(userId, taskId, updateData);

      return { task: updatedTask, message };
    } catch (error) {
      console.error("Task update error:", error);
      throw error;
    }
  },
};

/**
 * 9. deleteTaskFromListTool
 */
export const deleteTaskFromListTool = {
  description: "Delete a task from a Google Task list.",
  parameters: z.object({
    taskId: z
      .string()
      .describe(
        "Find the taskId from past messages. 'result.task.id' is the taskId."
      ),
    title: z.string().describe("The title of the task to delete."),
    message: z.string().optional().describe("표시할 메시지"),
  }),
  execute: async ({
    taskId,
    title,
    message,
  }: {
    taskId: string;
    title: string;
    message?: string;
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;

      if (!taskId) {
        throw new Error("작업 ID가 제공되지 않았습니다.");
      }

      // 작업 삭제
      await deleteTaskFromList(userId, taskId);

      // 삭제된 작업 정보 반환
      const deletedTask = {
        id: taskId,
        title,
        status: "deleted",
        success: true,
      };

      return { task: deletedTask, message };
    } catch (error) {
      console.error("Task deletion error:", error);
      throw error;
    }
  },
};

// /**
//  * 10. askForConfirmation
//  */
// export const askForConfirmationTool = {
//   description: "Ask the user for confirmation",
//   parameters: z.object({
//     message: z
//       .string()
//       .describe("The confirmation message to show to the user"),
//     yesLabel: z.string().optional().describe("Label for the Yes button"),
//     noLabel: z.string().optional().describe("Label for the No button"),
//   }),
//   execute: async ({
//     message,
//     yesLabel,
//     noLabel,
//   }: {
//     message: string;
//     yesLabel?: string;
//     noLabel?: string;
//   }) => {
//     // 확인 요청은 항상 message가 필요함
//     return {
//       message,
//       yesLabel: yesLabel || "예",
//       noLabel: noLabel || "아니오",
//       waiting: true,
//     };
//   },
// };
