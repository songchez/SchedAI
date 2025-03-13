import { ToolInvocation } from "ai";
import { Divider, Spinner } from "@heroui/react";
import { formatToKoreanDateTime } from "@/lib/chatApiHandlers/utils";

// 인터페이스 정의
interface CalendarEvent {
  id: string;
  summary?: string;
  start?: { dateTime?: string };
  end?: { dateTime?: string };
  location?: string;
  description?: string;
  status?: string;
}

interface CalendarEventAndMessage {
  event: CalendarEvent;
  message?: string; // 메시지가 optional이 맞음
}

interface Task {
  id: string;
  title?: string;
  due?: string;
  notes?: string;
  status?: string;
  success?: boolean;
}

interface TaskAndMessage {
  task: Task;
  message?: string; // 메시지가 optional이 맞음
}

interface EventsAndMessage {
  events: CalendarEvent[];
  message?: string; // 메시지가 optional이 맞음
}

interface TasksAndMessage {
  tasks: Task[];
  message?: string; // 메시지가 optional이 맞음
}

/**
 * ToolInvocationRenderer
 * - 도구 호출(toolName)에 따라 서로 다른 UI 표시
 * - partial-call, call, result 등 상태(state)에 따라 구분
 */
export default function ToolInvocationRenderer({
  toolInvocation,
}: // addToolResult,
{
  toolInvocation: ToolInvocation;
  // addToolResult: (args: { toolCallId: string; result: string }) => void;
}) {
  // 도구별 상태 처리
  switch (toolInvocation.toolName) {
    /**
     * 달력 이벤트 추가
     */
    case "addEventToCalendarTool":
      switch (toolInvocation.state) {
        case "call":
          // 로딩 상태 - 기본 메시지 사용 (message는 result에서만 사용)
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                {`"${toolInvocation.args.eventDetails?.summary}" 일정을 추가하는 중...`}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // 타입 가드를 추가하여 안전하게 처리
          const addResult = toolInvocation.result as CalendarEventAndMessage;

          if (!addResult || !addResult.event) {
            return (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">
                  <span className="mr-2">⚠️</span>
                  이벤트 추가 처리 중 오류가 발생했습니다.
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              {/* 이벤트 ID (화면에 표시되지 않지만 데이터로 저장) */}

              <p className="font-medium text-green-700 dark:text-green-300">
                <span className="mr-2">✅</span>
                {`"${addResult.event.summary}" 일정이 추가되었습니다!`}
              </p>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                <p>{`시작: ${formatToKoreanDateTime(
                  addResult.event.start?.dateTime
                )}`}</p>
                <p>{`종료: ${formatToKoreanDateTime(
                  addResult.event.end?.dateTime
                )}`}</p>
                {addResult.event.location && (
                  <p>{`장소: ${addResult.event.location}`}</p>
                )}
                {addResult.message && (
                  <p className="mt-2">{addResult.message}</p>
                )}
              </div>
            </div>
          );
      }
      break;

    /**
     * 이벤트 업데이트
     */
    case "updateEventInCalendarTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                {`"${
                  toolInvocation.args.eventDetails?.summary || "일정"
                }" 업데이트 중...`}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // 타입 가드를 추가하여 안전하게 처리
          const updateResult = toolInvocation.result as CalendarEventAndMessage;

          if (!updateResult || !updateResult.event) {
            return (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">
                  <span className="mr-2">⚠️</span>
                  이벤트 업데이트 처리 중 오류가 발생했습니다.
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              <p className="font-medium text-blue-700 dark:text-blue-300">
                <span className="mr-2">🔄</span>
                {`"${updateResult.event.summary}" 일정이 업데이트되었습니다!`}
              </p>
              <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                <p>{`시작: ${formatToKoreanDateTime(
                  updateResult.event.start?.dateTime
                )}`}</p>
                <p>{`종료: ${formatToKoreanDateTime(
                  updateResult.event.end?.dateTime
                )}`}</p>
                {updateResult.event.location && (
                  <p>{`장소: ${updateResult.event.location}`}</p>
                )}
                {updateResult.message && (
                  <p className="mt-2">{updateResult.message}</p>
                )}
              </div>
            </div>
          );
      }
      break;

    /**
     * 이벤트 삭제
     */
    case "deleteEventFromCalendarTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                {`"${
                  toolInvocation.args.eventDetails?.summary || "일정"
                }" 삭제 중...`}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // 타입 가드를 추가하여 안전하게 처리
          const deleteResult = toolInvocation.result as CalendarEventAndMessage;

          if (!deleteResult || !deleteResult.event) {
            return (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">
                  <span className="mr-2">⚠️</span>
                  이벤트 삭제 처리 중 오류가 발생했습니다.
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <p className="font-medium text-red-700 dark:text-red-300">
                <span className="mr-2">🗑️</span>
                {`"${deleteResult.event.summary}" 일정이 삭제되었습니다.`}
              </p>
              {deleteResult.message && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {deleteResult.message}
                </p>
              )}
            </div>
          );
      }
      break;

    /**
     * 태스크 추가
     */
    case "addTaskToListTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                {`"${toolInvocation.args.title}" 작업을 추가하는 중...`}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // 타입 가드를 추가하여 안전하게 처리
          const addTaskResult = toolInvocation.result as TaskAndMessage;

          if (!addTaskResult || !addTaskResult.task) {
            return (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">
                  <span className="mr-2">⚠️</span>
                  작업 추가 처리 중 오류가 발생했습니다.
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
              {/* 작업 ID (화면에 표시되지 않지만 데이터로 저장) */}
              <div
                data-task-id={addTaskResult.task.id}
                style={{ display: "none" }}
              >
                taskId:{addTaskResult.task.id}
              </div>

              <p className="font-medium text-green-700 dark:text-green-300">
                <span className="mr-2">✅</span>
                {`"${addTaskResult.task.title}" 작업이 추가되었습니다!`}
              </p>
              <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                {addTaskResult.task.due && (
                  <p>{`마감일: ${new Date(
                    addTaskResult.task.due
                  ).toLocaleString("ko-KR")}`}</p>
                )}
                {addTaskResult.task.notes && (
                  <p>{`메모: ${addTaskResult.task.notes}`}</p>
                )}
                <p>{`상태: ${
                  addTaskResult.task.status === "completed" ? "완료" : "진행 중"
                }`}</p>
                {addTaskResult.message && (
                  <p className="mt-2">{addTaskResult.message}</p>
                )}
              </div>
            </div>
          );
      }
      break;

    /**
     * 태스크 업데이트
     */
    case "updateTaskInListTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                {`"${toolInvocation.args.title || "작업"}" 업데이트 중...`}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // 타입 가드를 추가하여 안전하게 처리
          const updateTaskResult = toolInvocation.result as TaskAndMessage;

          if (!updateTaskResult || !updateTaskResult.task) {
            return (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">
                  <span className="mr-2">⚠️</span>
                  작업 업데이트 처리 중 오류가 발생했습니다.
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
              {/* 작업 ID (화면에 표시되지 않지만 데이터로 저장) */}
              <div
                data-task-id={updateTaskResult.task.id}
                style={{ display: "none" }}
              >
                taskId:{updateTaskResult.task.id}
              </div>

              <p className="font-medium text-blue-700 dark:text-blue-300">
                <span className="mr-2">🔄</span>
                {`"${updateTaskResult.task.title}" 작업이 업데이트되었습니다!`}
              </p>
              <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                {updateTaskResult.task.due && (
                  <p>{`마감일: ${new Date(
                    updateTaskResult.task.due
                  ).toLocaleString("ko-KR")}`}</p>
                )}
                {updateTaskResult.task.notes && (
                  <p>{`메모: ${updateTaskResult.task.notes}`}</p>
                )}
                <p>{`상태: ${
                  updateTaskResult.task.status === "completed"
                    ? "완료"
                    : "진행 중"
                }`}</p>
                {updateTaskResult.message && (
                  <p className="mt-2">{updateTaskResult.message}</p>
                )}
              </div>
            </div>
          );
      }
      break;

    /**
     * 태스크 삭제
     */
    case "deleteTaskFromListTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">
                {`"${toolInvocation.args.title}" 작업을 삭제하는 중...`}
              </p>
              <Spinner />
            </div>
          );
        case "result":
          // 타입 가드를 추가하여 안전하게 처리
          const deleteTaskResult = toolInvocation.result as TaskAndMessage;

          if (!deleteTaskResult || !deleteTaskResult.task) {
            return (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                <p className="font-medium text-red-700 dark:text-red-300">
                  <span className="mr-2">⚠️</span>
                  작업 삭제 처리 중 오류가 발생했습니다.
                </p>
              </div>
            );
          }

          return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              {/* 작업 ID (화면에 표시되지 않지만 데이터로 저장) */}
              <div
                data-task-id={deleteTaskResult.task.id}
                style={{ display: "none" }}
              >
                taskId:{deleteTaskResult.task.id}
              </div>

              <p className="font-medium text-red-700 dark:text-red-300">
                <span className="mr-2">🗑️</span>
                {`"${deleteTaskResult.task.title}" 작업이 삭제되었습니다.`}
              </p>
              {deleteTaskResult.message && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {deleteTaskResult.message}
                </p>
              )}
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
              <p className="italic">{"일정을 조회하는 중입니다..."}</p>
              <Spinner />
            </div>
          );
        case "result":
          // 데이터 구조 안전하게 처리
          let events: CalendarEvent[] = [];
          let eventMessage: string | undefined;

          // 응답 구조 확인 및 처리
          const eventsResponse = toolInvocation.result as EventsAndMessage;
          if (eventsResponse) {
            if (Array.isArray(eventsResponse)) {
              // 배열로 반환된 경우 (이전 버전 호환)
              events = eventsResponse;
            } else if (eventsResponse.events) {
              // { events, message } 형태로 반환된 경우
              events = eventsResponse.events;
              eventMessage = eventsResponse.message;
            }
          }

          if (events.length === 0) {
            return (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  <span className="mr-2">📅</span>
                  {eventMessage || "해당 기간에 일정이 없습니다."}
                </p>
              </div>
            );
          }

          // 이벤트를 시작 날짜(ko-KR 형식의 문자열)로 그룹화
          const groupedEvents: Record<string, CalendarEvent[]> = events.reduce(
            (acc: Record<string, CalendarEvent[]>, event: CalendarEvent) => {
              if (!event.start?.dateTime) return acc;

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
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <p className="font-medium text-indigo-700 dark:text-indigo-300 mb-4">
                <span className="mr-2">📅</span>
                {eventMessage || "일정 조회 결과"}
              </p>

              <div className="text-sm">
                {Object.keys(groupedEvents)
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .map((date: string) => (
                    <div key={date} className="mb-4">
                      <h3 className="font-bold text-indigo-800 dark:text-indigo-200 mb-2">
                        {date}
                      </h3>
                      <div className="space-y-3">
                        {groupedEvents[date].map((event: CalendarEvent) => (
                          <div
                            key={event.id}
                            className="pl-3 border-l-2 border-indigo-300 dark:border-indigo-600"
                          >
                            <div className="text-indigo-600 dark:text-indigo-300">
                              ⏱️{" "}
                              {event.start?.dateTime &&
                                formatToKoreanDateTime(
                                  event.start.dateTime
                                ).slice(16, 50)}{" "}
                              ~{" "}
                              {event.end?.dateTime &&
                                formatToKoreanDateTime(
                                  event.end.dateTime
                                ).slice(16, 50)}
                            </div>
                            {event.summary && (
                              <div className="font-medium text-indigo-500 dark:text-indigo-300">
                                ✨ {event.summary}
                              </div>
                            )}
                            {event.location && (
                              <div className="text-indigo-600 dark:text-indigo-400">
                                🏛️ {event.location}
                              </div>
                            )}
                            {event.description && (
                              <div className="text-indigo-600 dark:text-indigo-400">
                                🔖 {event.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <Divider className="my-2" />
                    </div>
                  ))}
              </div>
            </div>
          );
      }
      break;

    /**
     * Task 조회
     */
    case "getTasksFromListTool":
      switch (toolInvocation.state) {
        case "partial-call":
        case "call":
          return (
            <div className="flex flex-col gap-2">
              <p className="italic">{"작업 목록을 조회하는 중입니다..."}</p>
              <Spinner />
            </div>
          );
        case "result":
          // 데이터 구조 안전하게 처리
          let tasks: Task[] = [];
          let taskMessage: string | undefined;

          // 응답 구조 확인 및 처리
          const tasksResponse = toolInvocation.result as TasksAndMessage;
          if (tasksResponse) {
            if (Array.isArray(tasksResponse)) {
              // 배열로 반환된 경우 (이전 버전 호환)
              tasks = tasksResponse;
            } else if (tasksResponse.tasks) {
              // { tasks, message } 형태로 반환된 경우
              tasks = tasksResponse.tasks;
              taskMessage = tasksResponse.message;
            }
          }

          if (tasks.length === 0) {
            return (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  <span className="mr-2">📝</span>
                  {taskMessage || "작업 목록이 비어 있습니다."}
                </p>
              </div>
            );
          }

          // 진행 중인 작업과 완료된 작업으로 분류
          const activeTasks = tasks.filter(
            (task) => task.status !== "completed"
          );
          const completedTasks = tasks.filter(
            (task) => task.status === "completed"
          );

          return (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-800">
              <p className="font-medium text-amber-700 dark:text-amber-300 mb-4">
                <span className="mr-2">📝</span>
                {taskMessage || "작업 목록 조회 결과"}
              </p>

              {activeTasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-md font-bold text-amber-800 dark:text-amber-200 mb-2">
                    진행 중인 작업
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {activeTasks.map((task) => (
                      <li
                        key={task.id}
                        className="text-amber-700 dark:text-amber-300"
                      >
                        {/* 작업 ID (화면에 표시되지 않지만 데이터로 저장) */}
                        <div data-task-id={task.id}>taskId:{task.id}</div>

                        <span className="font-medium">
                          {task.title || "제목 없음"}
                        </span>
                        {task.due && (
                          <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                            (마감: {new Date(task.due).toLocaleString("ko-KR")})
                          </span>
                        )}
                        {task.notes && (
                          <div className="text-sm text-amber-600 dark:text-amber-400 ml-2">
                            {task.notes}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {completedTasks.length > 0 && (
                <div>
                  <h3 className="text-md font-bold text-amber-800 dark:text-amber-200 mb-2">
                    완료된 작업
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    {completedTasks.map((task) => (
                      <li
                        key={task.id}
                        className="text-amber-500 dark:text-amber-400 line-through"
                      >
                        {/* 작업 ID (화면에 표시되지 않지만 데이터로 저장) */}
                        <div data-task-id={task.id}>taskId:{task.id}</div>

                        <span>{task.title || "제목 없음"}</span>
                        {task.due && (
                          <span className="ml-2 text-xs">
                            (마감: {new Date(task.due).toLocaleString("ko-KR")})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
          알 수 없는 도구 호출: {toolInvocation.toolName}
        </div>
      );
  }

  // 기본 fallback
  return (
    <div className="text-sm italic text-gray-400">
      [처리되지 않은 상태] {toolInvocation.toolName}
    </div>
  );
}
