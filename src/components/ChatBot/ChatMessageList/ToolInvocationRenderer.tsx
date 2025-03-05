import { ToolInvocation } from "ai";
import { Divider, Spinner } from "@heroui/react";
import { tasks_v1 } from "googleapis";
import { formatToKoreanDateTime } from "@/lib/chatApiHandlers/utils";

/**
 * ToolInvocationRenderer
 * - 도구 호출(toolName)에 따라 서로 다른 UI 표시
 * - partial-call, call, result 등 상태(state)에 따라 구분
 */
export default function ToolInvocationRenderer({
  toolInvocation,
  addToolResult,
}: {
  toolInvocation: ToolInvocation;
  addToolResult: (args: { toolCallId: string; result: string }) => void;
}) {
  // 편의를 위해 상태를 세 가지로 나눔: partial-call, call, result
  // partial-call은 스트리밍이나 추가 정보 수집 등 중간 상태, call은 API 호출을 진행 중, result가 최종 결과
  switch (toolInvocation.toolName) {
    /**
     * 달력 이벤트 추가/수정/삭제, 태스크 추가/수정/삭제
     */
    case "addEventToCalendarTool":
      switch (toolInvocation.state) {
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                [이벤트를 추가하는 중...] {toolInvocation.args.message}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // result가 문자열인지 객체인지 판별
          if (typeof toolInvocation.result === "string") {
            return (
              <span className="text-red-500">
                {toolInvocation.result || "오류가 발생했습니다."}
              </span>
            );
          }
          const newEvent = toolInvocation.result as {
            id: string;
            summary: string;
            start?: { dateTime?: string };
            end?: { dateTime?: string };
          };

          return (
            <div>
              <p>{`"${newEvent.summary}" 일정이 추가되었습니다!`}</p>
              <p>{`시작: ${formatToKoreanDateTime(
                newEvent.start?.dateTime
              )}`}</p>
              <p>{`종료: ${formatToKoreanDateTime(newEvent.end?.dateTime)}`}</p>
            </div>
          );
      }
    case "updateEventInCalendarTool":
    case "deleteEventFromCalendarTool":
    case "addTaskToListTool":
    case "updateTaskInListTool":
    case "deleteTaskFromListTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">[진행 중] {toolInvocation.args.message}</p>
              <Spinner />
            </div>
          );
        case "result":
          return (
            <div className="flex flex-col gap-2">
              <p className="font-semibold">{toolInvocation.args.message}</p>
              <p className="whitespace-pre-line">{toolInvocation.result}</p>
            </div>
          );
      }
      break;

    /**
     * 캘린더 이벤트 조회
     */
    case "getCalendarEventsTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                [이벤트 조회 중] {toolInvocation.args.message}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // result가 문자열인지 객체인지 판별
          if (typeof toolInvocation.result === "string") {
            return (
              <span className="text-red-500">
                {toolInvocation.result || "오류가 발생했습니다."}
              </span>
            );
          }
          interface CalendarEvent {
            id: string;
            start: { dateTime: string };
            end: { dateTime: string };
            location?: string;
            summary?: string;
            description?: string;
          }

          const renderEventsByDate = (
            toolInvocationResult: CalendarEvent[]
          ): JSX.Element => {
            // 이벤트를 시작 날짜(ko-KR 형식의 문자열)로 그룹화
            const groupedEvents: Record<string, CalendarEvent[]> =
              toolInvocationResult.reduce(
                (
                  acc: Record<string, CalendarEvent[]>,
                  event: CalendarEvent
                ) => {
                  const dateKey: string = formatToKoreanDateTime(
                    event.start.dateTime
                  ).slice(0, 16);
                  if (!acc[dateKey]) {
                    acc[dateKey] = [];
                  }
                  acc[dateKey].push(event);
                  return acc;
                },
                {}
              );

            return (
              <>
                <div>
                  이번주(
                  {formatToKoreanDateTime(toolInvocation.args.timeMin).slice(
                    0,
                    16
                  )}
                  ~
                  {formatToKoreanDateTime(toolInvocation.args.timeMax).slice(
                    0,
                    16
                  )}
                  )의 스케줄을 보여드리겠습니다.
                </div>
                {Object.keys(groupedEvents)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .map((date: string) => (
                    <div key={date} className="flex flex-col gap-3">
                      <h3 className="font-bold">{date}</h3>
                      {groupedEvents[date].map((event: CalendarEvent) => (
                        <div key={event.id}>
                          <div>
                            ⏱️{" "}
                            {formatToKoreanDateTime(event.start.dateTime).slice(
                              16,
                              50
                            )}{" "}
                            ~{" "}
                            {formatToKoreanDateTime(event.end.dateTime).slice(
                              16,
                              50
                            )}
                          </div>
                          {event.summary && (
                            <div className="text-purple-500">
                              ✨ {event.summary}
                            </div>
                          )}
                          {event.location && (
                            <div>🏛️ 장소: {event.location}</div>
                          )}
                          {event.description && (
                            <div>🔖 설명: {event.description}</div>
                          )}
                        </div>
                      ))}
                      <Divider />
                    </div>
                  ))}
              </>
            );
          };

          return renderEventsByDate(toolInvocation.result);
      }

    /**
     * Task 조회
     */
    case "getTasksFromListTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                [작업 목록 조회 중] {toolInvocation.args.message}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          const tasks = toolInvocation.result as tasks_v1.Schema$Task[];
          if (!tasks || tasks.length === 0) {
            return (
              <span className="text-red-500">작업 리스트가 비어 있습니다.</span>
            );
          }
          return (
            <div>
              <p className="font-semibold">{toolInvocation.args.message}</p>
              <h3 className="text-lg font-bold">작업 리스트:</h3>
              <ul className="list-disc ml-6">
                {tasks.map((task) => (
                  <li key={task.id} className="mb-2">
                    <span>
                      {task.title || "제목 없음"}
                      {task.due
                        ? ` (Due: ${new Date(task.due).toLocaleString()})`
                        : ""}
                    </span>
                    <span style={{ display: "none" }} data-task-id={task.id} />
                  </li>
                ))}
              </ul>
            </div>
          );
      }
      break;

    /**
     * 예시: askForConfirmation
     */
    case "askForConfirmation":
      switch (toolInvocation.state) {
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p>{toolInvocation.args.message}</p>
              <div className="flex gap-2">
                <button
                  className="p-2 bg-blue-500 text-white rounded"
                  onClick={() =>
                    addToolResult({
                      toolCallId: toolInvocation.toolCallId,
                      result: "Yes, confirmed.",
                    })
                  }
                >
                  Yes
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded"
                  onClick={() =>
                    addToolResult({
                      toolCallId: toolInvocation.toolCallId,
                      result: "No, denied",
                    })
                  }
                >
                  No
                </button>
              </div>
            </div>
          );
        case "result":
          return (
            <div className="flex flex-col gap-2">
              <p className="font-semibold">사용자 응답:</p>
              <p>{toolInvocation.result}</p>
            </div>
          );
      }
      break;

    /**
     * 기타 / 매칭되지 않는 toolName
     */
    default:
      return (
        <div className="text-sm italic text-gray-400">
          Unknown tool invocation: {toolInvocation.toolName}
        </div>
      );
  }

  // 기본 fallback
  return (
    <div className="text-sm italic text-gray-400">
      [Unhandled state] {toolInvocation.toolName}
    </div>
  );
}
