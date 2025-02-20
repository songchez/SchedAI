// src/components/ChatBot/ChatMessageList.tsx
"use client";
import { Card, Spinner } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

import { useEffect, useRef } from "react";
import { tasks_v1 } from "googleapis";
import { Message, ToolInvocation } from "@ai-sdk/ui-utils";
import { formatToKoreanDateTime } from "@/lib/chatApiHandlers/utils";

/**
 * ToolInvocationRenderer - 특정 ToolInvocation을 렌더링
 */
function ToolInvocationRenderer({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  const { toolName, toolCallId, args, state } = toolInvocation;

  // "result" 상태가 아니면(= partial-call / call), 아직 결과를 못 받은 상태라 가정
  // => Spinner 표시
  // "result" 상태일 때만 toolInvocation.result가 존재
  const isResultState = state === "result";

  // 1) 일정(캘린더) 추가/수정/삭제, 태스크 추가/수정/삭제
  if (
    [
      "addEventToCalendarTool",
      "updateEventInCalendarTool",
      "deleteEventFromCalendarTool",
      "addTaskToListTool",
      "updateTaskInListTool",
      "deleteTaskFromListTool",
    ].includes(toolName)
  ) {
    return (
      <div key={toolCallId} className="flex flex-col gap-2">
        {args.message}
        <div className="flex gap-2">
          {isResultState ? (
            // state==="result"인 경우에만 존재
            <p className="whitespace-pre-line">
              {toolInvocation.result /* (type: unknown) */}
            </p>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }

  // 2) 캘린더 이벤트 조회
  if (toolName === "getCalendarEventsTool") {
    return (
      <div key={toolCallId} className="flex flex-col gap-2">
        {args.message}
        <div className="flex gap-2">
          {isResultState ? (
            (() => {
              // toolInvocation.result가 문자열인지 / 객체인지 체크
              if (typeof toolInvocation.result === "string") {
                return (
                  <span className="text-red-500">{toolInvocation.result}</span>
                );
              }

              // 그렇지 않다면, Record 형태라고 가정
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
                      <span
                        style={{ display: "none" }}
                        data-event-id={evt.id}
                      />
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
                  이벤트 목록:
                  <div className="mt-2">{formattedEvents}</div>
                </div>
              );
            })()
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }

  // 3) Task 조회
  if (toolName === "getTasksFromListTool") {
    return (
      <div key={toolCallId} className="flex flex-col gap-2">
        {args.message}
        <div className="flex gap-2">
          {isResultState ? (
            (() => {
              const tasks = toolInvocation.result as tasks_v1.Schema$Task[];
              if (!tasks || tasks.length === 0) {
                return (
                  <span className="text-red-500">
                    작업 리스트가 비어 있습니다.
                  </span>
                );
              }
              return (
                <div>
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
                        {/* 숨겨진 taskId */}
                        <span
                          style={{ display: "none" }}
                          data-task-id={task.id}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }

  // 4) 매칭되지 않는 toolName일 경우 (혹은 미래 확장)
  return (
    <div key={toolCallId} className="text-sm italic text-gray-400">
      Unknown tool invocation: {toolName}
    </div>
  );
}

/**
 * MessageCard - 단일 메시지(내용 + ToolInvocation)를 렌더링
 */
function MessageCard({ message }: { message: Message }) {
  return (
    <Card
      key={message.id}
      className={`p-4 ${
        message.role === "user"
          ? "self-end shadow-none bg-opacity-50"
          : "bg-transparent shadow-none self-start"
      }`}
    >
      {/* 메시지 텍스트 (Markdown) */}
      <div className="whitespace-pre-wrap">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {message.content}
        </ReactMarkdown>
      </div>

      {/* Tool Invocation(툴 호출) 렌더링 */}
      {message.toolInvocations?.map((toolInvocation) => (
        <ToolInvocationRenderer
          key={toolInvocation.toolCallId}
          toolInvocation={toolInvocation}
        />
      ))}
    </Card>
  );
}

/**
 * ChatMessageList - 채팅 메시지를 표시하는 리스트 컴포넌트
 *
 * @param messages - 현재까지의 메시지 목록
 * @param isLoading - AI 응답 생성 중인지 여부
 */
export default function ChatMessageList({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // 새로운 메시지가 추가될 때, 스크롤을 끝으로 이동
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-6">
      {messages.map((msg) => (
        <MessageCard key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <span className="p-4 bg-transparent shadow-none self-start animate-pulse text-gray-500">
          생각중...
        </span>
      )}

      {/* 스크롤 위치 이동용 ref */}
      <div ref={messageEndRef} />
    </div>
  );
}
