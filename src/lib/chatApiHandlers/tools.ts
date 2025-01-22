// app/api/chat/tools.ts
import { z } from "zod";
import { auth } from "@/auth";
import { formatToKoreanDateTime } from "./utils";
import {
  addEventToCalendar,
  getCalendarEvents,
  getCalendarList,
} from "@/lib/googleClient";

/**
 * 1. 캘린더 목록 가져오기
 */
export const getCalendarsListTool = {
  description: `유저의 캘린더 목록을 가져옵니다. 이 ID로 다른 캘린더 관련 작업이 가능합니다.`,
  parameters: z.object({}),
  execute: async () => {
    const session = await auth();
    const userId = session?.user.id;
    const calendars = await getCalendarList(userId);

    if (!calendars?.length) {
      return "등록된 캘린더가 없습니다.";
    }

    const calendarText = calendars.map((calendar) => calendar.id).join(", ");
    return `현재 캘린더 목록: ${calendarText}.
원하시는 캘린더 ID를 알려주세요 (예: ${calendars[0].id}).`;
  },
};

/**
 * 2. 특정 캘린더의 이벤트 조회
 */
export const getCalendarEventsTool = {
  description: "특정 calendarId에서 일정 목록을 가져옵니다.",
  parameters: z.object({
    calendarId: z.string(),
    timeMin: z.string().describe("ISO 문자열 (검색 시작 시점)"),
    timeMax: z.string().describe("ISO 문자열 (검색 종료 시점)"),
    maxResults: z.number().default(5).describe("최대 이벤트 개수"),
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
    // 날짜별로 그룹화
    const groupedEvents = events.reduce<
      Record<string, { summary: string; start?: { dateTime?: string } }[]>
    >((acc, event) => {
      const dateTime = event.start?.dateTime;
      if (!dateTime) return acc;
      const date = new Date(dateTime).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push({
        summary: event.summary || "",
        start: {
          dateTime: event.start?.dateTime || undefined,
        },
      });
      return acc;
    }, {});

    // 결과 문자열 생성
    const formattedEvents = Object.entries(groupedEvents)
      .map(([date, evts]) => {
        const dateHeader = formatToKoreanDateTime(date);
        const lines = evts
          .map(
            (evt) =>
              `  - ${formatToKoreanDateTime(evt.start?.dateTime)
                .split(" ")
                .slice(-2)
                .join(" ")} : ${evt.summary}`
          )
          .join("\n");
        return `${dateHeader}:\n${lines}`;
      })
      .join("\n\n");

    return `이벤트 목록:\n\n${formattedEvents}`;
  },
};

/**
 * 3. 일정 추가
 */
export const addEventToCalendarTool = {
  description: "특정 calendarId에 새 일정을 추가합니다.",
  parameters: z.object({
    calendarId: z.string(),
    eventDetails: z.object({
      summary: z.string(),
      location: z.string().optional(),
      description: z.string().optional(),
      start: z.object({
        dateTime: z.string().describe("예: 2023-01-01T09:00:00"),
      }),
      end: z.object({
        dateTime: z.string().describe("예: 2023-01-01T10:00:00"),
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
      start: { dateTime: string };
      end: { dateTime: string };
    };
  }) => {
    const session = await auth();
    const userId = session?.user.id;

    const newEvent = await addEventToCalendar(userId, calendarId, eventDetails);
    return (
      `"${newEvent.summary}" 일정이 추가되었습니다!\n` +
      `시작: ${formatToKoreanDateTime(newEvent.start?.dateTime)}\n` +
      `종료: ${formatToKoreanDateTime(newEvent.end?.dateTime)}`
    );
  },
};

/**
 * 4. Placeholder Tools (미구현)
 */
export const updateEventInCalendarTool = {
  description: "캘린더 이벤트를 업데이트 (미구현).",
  parameters: z.object({}),
  execute: async () => {
    return "이 기능은 아직 구현되지 않았습니다.";
  },
};

export const deleteEventFromCalendarTool = {
  description: "캘린더 이벤트를 삭제 (미구현).",
  parameters: z.object({}),
  execute: async () => {
    return "이 기능은 아직 구현되지 않았습니다.";
  },
};

export const addTaskToListTool = {
  description: "할 일을 추가 (미구현).",
  parameters: z.object({}),
  execute: async () => {
    return "이 기능은 아직 구현되지 않았습니다.";
  },
};

export const updateTaskInListTool = {
  description: "할 일을 업데이트 (미구현).",
  parameters: z.object({}),
  execute: async () => {
    return "이 기능은 아직 구현되지 않았습니다.";
  },
};

export const deleteTaskFromListTool = {
  description: "할 일을 삭제 (미구현).",
  parameters: z.object({}),
  execute: async () => {
    return "이 기능은 아직 구현되지 않았습니다.";
  },
};

export const clearCompletedTasksTool = {
  description: "완료된 할 일을 정리 (미구현).",
  parameters: z.object({}),
  execute: async () => {
    return "이 기능은 아직 구현되지 않았습니다.";
  },
};
