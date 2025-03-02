// app/api/chat/tools.ts
import { z } from "zod";
import { auth } from "@/auth";
import { formatToKoreanDateTime } from "./utils";
import {
  addEventToCalendar,
  addTaskToList,
  deleteEventFromCalendar,
  deleteTaskFromList,
  getCalendarEvents,
  getTasksFromList,
  updateEventInCalendar,
  updateTaskInList,
  // getCalendarList,
} from "@/lib/googleClient";

/**
 * 주의사항: zod스키마를 선언할때, object에 직접 optional을 붙이면 null Error 발생.
 * enum type넣으면 오류남. 아마 이것도
 */

// # CALENDAR TOOLS

/**
 * 1. 캘린더 목록 가져오기 : 캘린더 목록을 가져오면 너무 단계가 많아져서 캘린더ID를 시작전에 프롬프트로 줌으로써 일단 해결.(캘린더가 많은사람이 별로 없을거라는 가정.)
 */
// export const getCalendarsListTool = {
//   description: `Get the user calendars`,
//   parameters: z.object({}),
//   execute: async () => {
//     const session = await auth();
//     const userId = session?.user.id;
//     const calendars = await getCalendarList(userId);

//     if (!calendars?.length) {
//       return "등록된 캘린더가 없습니다.";
//     }

//     const calendarText = calendars.map((calendar) => calendar.id).join(", ");
//     return `현재 캘린더 목록: ${calendarText}.
// 원하시는 캘린더 ID를 알려주세요 (예: ${calendars[0].id}).`;
//   },
// };

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
  }),
  execute: async ({
    calendarId,
    timeMin,
    timeMax,
    maxResults,
  }: {
    calendarId: string;
    timeMin: string;
    timeMax: string;
    maxResults: number;
  }) => {
    const session = await auth();
    const userId = session?.user.id;

    const events = await getCalendarEvents(
      userId,
      calendarId,
      timeMin,
      timeMax,
      maxResults
    );
    if (!events.length) {
      return "일정이 없습니다.";
    }

    return events;
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
  }),
  execute: async ({
    calendarId,
    eventDetails,
  }: {
    calendarId: string;
    eventDetails: {
      summary: string;
      location?: string;
      description?: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
    };
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;
      console.log(userId, calendarId, eventDetails);

      const newEvent = await addEventToCalendar(
        userId,
        calendarId,
        eventDetails
      );

      console.log("새로운 이벤트 추가:", newEvent);
      return newEvent;
    } catch (error) {
      if (error instanceof Error) {
        return `이벤트 추가함수에서 오류발생: ${error}`;
      }
    }
  },
};

/**
 * 4. UpdateEventInCalendar
 */
export const updateEventInCalendarTool = {
  description:
    "update existing event at google calendar. In order to use update, eventId is necessary. if you dont know the eventId have to update, use getCalendarEventsTool(get eventIds). And ask user 'Which one would you like to update?'.don't tell the eventId to user.",
  parameters: z.object({
    calendarId: z.string(),
    eventId: z.string(),
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
  }),
  execute: async ({
    calendarId,
    eventId,
    eventDetails,
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
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;
      console.log(userId, calendarId, eventId, eventDetails);

      const updatedEvent = await updateEventInCalendar(
        userId,
        calendarId,
        eventId,
        eventDetails
      );
      if (!updatedEvent) {
        throw new Error("캘린더 이벤트를 업데이트하지 못했습니다.");
      }
      console.log("이벤트 업데이트 완료:", updatedEvent);
      return `"${updatedEvent.summary}" 일정이 업데이트되었습니다!
      시작: ${formatToKoreanDateTime(updatedEvent.start?.dateTime)}
      종료: ${formatToKoreanDateTime(updatedEvent.end?.dateTime)}`;
    } catch (error) {
      if (error instanceof Error) {
        return `이벤트 업데이트 함수에서 오류 발생: ${error}`;
      }
    }
  },
};

/**
 * 5. DeleteEventFromCalendar : 이벤트 삭제
 */

export const deleteEventFromCalendarTool = {
  description:
    "delete existing event at google calendar. if you dont know the event have to delete, use getCalendarEventsTool(get eventIds). And ask user 'Which one would you like to delete?'. don't tell the eventId to user.",
  parameters: z.object({
    calendarId: z.string(),
    eventId: z.string(),
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
  }),
  execute: async ({
    calendarId,
    eventId,
    eventDetails,
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
  }) => {
    try {
      const session = await auth();
      const userId = session?.user.id;
      console.log(
        "deleteEventInCalendarTool 사용",
        userId,
        calendarId,
        eventId
      );

      const response = await deleteEventFromCalendar(
        userId,
        calendarId,
        eventId
      );
      if (!response.status) {
        throw new Error("캘린더 이벤트를 삭제하지 못했습니다.");
      }
      console.log("이벤트 삭제 완료:");
      return `"${eventDetails.summary}" 일정이 삭제되었습니다.`;
    } catch (error) {
      if (error instanceof Error) {
        return `이벤트 삭제 함수에서 오류 발생: ${error}`;
      }
    }
  },
};

// # TASK TOOLS

/**
 * 6. getTasksFromListTool : task불러오기
 */

export const getTasksFromListTool = {
  description: "Fetch tasks from a Google Task list",
  parameters: z.object({}),
  execute: async () => {
    try {
      // 사용자 인증 세션 및 ID 가져오기
      const session = await auth();
      const userId = session?.user.id;

      // 작업 리스트 가져오기
      const tasks = await getTasksFromList(userId);

      return tasks;
    } catch (error) {
      if (error instanceof Error) {
        return `작업을 가져오는 중 오류가 발생했습니다: ${error.message}`;
      }
      return "작업을 가져오는 중 알 수 없는 오류가 발생했습니다.";
    }
  },
};

/**
 * 7. getTasksFromListTool : new task 추가
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
  }),
  execute: async ({
    title,
    due,
    notes,
  }: {
    title: string;
    due?: string;
    notes?: string;
  }) => {
    try {
      // 사용자 인증 세션 및 ID 가져오기
      const session = await auth();
      const userId = session?.user.id;

      // 작업 추가
      const newTask = await addTaskToList(userId, title, due, notes);

      console.log(newTask);

      return `작업이 성공적으로 추가되었습니다:
      - 제목: ${newTask.title}
      - ${
        newTask.due
          ? `마감일: ${new Date(newTask.due).toLocaleString()}`
          : "마감일 없음"
      }
      - ${newTask.notes ? `메모: ${newTask.notes}` : "메모 없음"}`;
    } catch (error) {
      if (error instanceof Error) {
        return `작업을 추가하는 중 오류가 발생했습니다: ${error.message}`;
      }
      return "작업을 추가하는 중 알 수 없는 오류가 발생했습니다.";
    }
  },
};

/**
 * 8. updateTaskInListTool : task수정
 */

export const updateTaskInListTool = {
  description:
    "Update a task in a Google Task List. If you dont know the taskId have to update, use getTasksFromListTool(get taskIds). And ask user 'Which one would you like to update?'. don't tell the taskId to user.",
  parameters: z.object({
    taskId: z.string().describe("The ID of the task to update."),
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
  }),
  execute: async ({
    taskId,
    title,
    dueDate,
    notes,
    status,
  }: {
    taskListId: string;
    taskId: string;
    title?: string;
    dueDate?: string;
    notes?: string;
    status?: "needsAction" | "completed";
  }) => {
    try {
      // 사용자 인증 세션 및 ID 가져오기
      const session = await auth();
      const userId = session?.user.id;

      // 업데이트 데이터 준비
      const updateData: Record<string, unknown> = {};
      if (title) updateData.title = title;
      if (dueDate) updateData.due = dueDate;
      if (notes) updateData.notes = notes;
      if (status) updateData.status = status;

      if (Object.keys(updateData).length === 0) {
        return "업데이트할 내용이 없습니다.";
      }

      // 작업 업데이트
      const updatedTask = await updateTaskInList(userId, taskId, updateData);

      return `작업이 성공적으로 업데이트되었습니다:
      - 제목: ${updatedTask.title || "변경 없음"}
      - ${
        updatedTask.due
          ? `마감일: ${new Date(updatedTask.due).toLocaleString()}`
          : "마감일 없음"
      }
      - ${updatedTask.notes ? `메모: ${updatedTask.notes}` : "메모 없음"}
      - 상태: ${updatedTask.status === "completed" ? "완료됨" : "진행 중"}`;
    } catch (error) {
      if (error instanceof Error) {
        return `작업을 업데이트하는 중 오류가 발생했습니다: ${error.message}`;
      }
      return "작업을 업데이트하는 중 알 수 없는 오류가 발생했습니다.";
    }
  },
};

/**
 * 9. deleteTaskFromListTool : task삭제
 */

export const deleteTaskFromListTool = {
  description:
    "Delete a task from a Google Task list. If you dont know the taskId have to delete, use getTasksFromListTool(get taskIds). And ask user 'Which one would you like to delete?'.don't tell the taskId to user.",
  parameters: z.object({
    taskId: z.string().describe("The ID of the task to delete."),
    title: z.string().describe("The title of the task to delete."),
  }),
  execute: async ({ taskId, title }: { taskId: string; title: string }) => {
    try {
      // 사용자 인증 세션 및 ID 가져오기
      const session = await auth();
      const userId = session?.user.id;

      if (!taskId) {
        return "작업 ID가 제공되지 않았습니다.";
      }

      // 작업 삭제
      await deleteTaskFromList(userId, taskId);

      return `"${title}"가 성공적으로 삭제되었습니다.`;
    } catch (error) {
      if (error instanceof Error) {
        return `작업을 삭제하는 중 오류가 발생했습니다: ${error.message}`;
      }
      return "작업을 삭제하는 중 알 수 없는 오류가 발생했습니다.";
    }
  },
};

// export const clearCompletedTasksTool = {
//   description: "완료된 할 일을 정리 (미구현).",
//   parameters: z.object({}),
//   execute: async () => {
//     return "이 기능은 아직 구현되지 않았습니다.";
//   },
// };
