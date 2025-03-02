"use client";

import { UIMessage } from "@ai-sdk/ui-utils";
import { ToolInvocation } from "ai";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import { Card, Spinner } from "@heroui/react";
import { tasks_v1 } from "googleapis";
import { formatToKoreanDateTime } from "@/lib/chatApiHandlers/utils";
import { useEffect, useRef } from "react";

/**
 * ToolInvocationRenderer
 * - 도구 호출(toolName)에 따라 서로 다른 UI 표시
 * - partial-call, call, result 등 상태(state)에 따라 구분
 */
function ToolInvocationRenderer({
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

          // Record<string, { id, summary, start }[]> 형태라고 가정
          const groupedEvents = toolInvocation.result as Record<
            string,
            { id: string; summary: string; start?: { dateTime?: string } }[]
          >;

          const formattedEvents = Object.entries(groupedEvents).map(
            ([date, evts]) => {
              const dateHeader = formatToKoreanDateTime(date);
              const lines = evts.map((evt) => (
                <div key={evt.id} className="flex items-center">
                  <span>
                    {`- ${formatToKoreanDateTime(evt.start?.dateTime || "")
                      .split(" ")
                      .slice(-2)
                      .join(" ")} : ${evt.summary}`}
                  </span>
                  {/* 숨겨진 ID */}
                  <span style={{ display: "none" }} data-event-id={evt.id} />
                </div>
              ));
              return (
                <div key={date}>
                  <h3>{dateHeader}</h3>
                  <div className="ml-4">{lines}</div>
                </div>
              );
            }
          );

          return (
            <div className="whitespace-pre-line">
              <p className="font-semibold">{toolInvocation.args.message}</p>
              이벤트 목록:
              <div className="mt-2">{formattedEvents}</div>
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

/**
 * ChatMessageList
 * - 메시지 목록을 렌더링하며, 메시지는 message.parts 배열 내 text/tool-invocation으로 구성
 */
export default function ChatMessageList({
  messages,
  isLoading,
  addToolResult,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  addToolResult: (args: { toolCallId: string; result: string }) => void;
}) {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-6">
      {messages.map((message) =>
        message.parts.map((part, idx) => {
          switch (part.type) {
            case "text":
              return (
                <Card
                  key={`${message.id}-text-${idx}`}
                  className={`p-4 ${
                    message.role === "user"
                      ? "self-end shadow-none bg-opacity-50"
                      : "bg-transparent shadow-none self-start"
                  }`}
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {part.text || ""}
                  </ReactMarkdown>
                </Card>
              );
            case "tool-invocation":
              if (!part.toolInvocation) return null;
              return (
                <ToolInvocationRenderer
                  key={part.toolInvocation.toolCallId}
                  toolInvocation={part.toolInvocation}
                  addToolResult={addToolResult}
                />
              );
          }
        })
      )}

      {isLoading && (
        <span className="p-4 bg-transparent self-start animate-pulse text-gray-500">
          생각중...
        </span>
      )}

      {/* 스크롤 하단 ref */}
      <div ref={messageEndRef} />
    </div>
  );
}
