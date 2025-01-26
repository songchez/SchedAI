import { Card, Spinner } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Message, ToolInvocation } from "@ai-sdk/ui-utils";
import { useEffect, useRef } from "react";
import { formatToKoreanDateTime } from "@/lib/chatApiHandlers/utils";
import { tasks_v1 } from "googleapis";

/**
 * ToolInvocationRenderer - 특정 ToolInvocation을 렌더링하는 컴포넌트
 */

function ToolInvocationRenderer({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  // 특정 toolName에 따라 동작 분리

  if (
    [
      "addEventToCalendarTool",
      "updateEventInCalendarTool",
      "deleteEventFromCalendarTool",
      "addTaskToListTool",
      "updateTaskInListTool",
      "deleteTaskFromListTool",
    ].includes(toolInvocation.toolName)
  ) {
    return (
      <div key={toolInvocation.toolCallId} className="flex flex-col gap-2">
        {toolInvocation.args.message}

        <div className="flex gap-2">
          {"result" in toolInvocation ? (
            <p className="whitespace-pre-line">{toolInvocation.result}</p>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  } else if (["getCalendarEventsTool"].includes(toolInvocation.toolName)) {
    return (
      <div key={toolInvocation.toolCallId} className="flex flex-col gap-2">
        {toolInvocation.args.message}

        <div className="flex gap-2">
          {"result" in toolInvocation ? (
            (() => {
              // 타입 선언 및 안전성 검사
              const groupedEvents = toolInvocation.result as Record<
                string,
                { id: string; summary: string; start?: { dateTime?: string } }[]
              >;

              // groupedEvents가 문자열인지 확인
              if (typeof groupedEvents === "string") {
                return (
                  <span className="text-red-500">{`${groupedEvents}`}</span>
                );
              } else {
                // groupedEvents가 올바른 객체인 경우 처리
                const formattedEvents = Object.entries(groupedEvents).map(
                  ([date, evts]) => {
                    const dateHeader = formatToKoreanDateTime(date);

                    const lines = evts.map((evt) => (
                      <div key={evt.id} className="flex items-center">
                        <span>
                          {`- ${formatToKoreanDateTime(
                            evt.start?.dateTime || ""
                          )
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
                    {`이벤트 목록:`}
                    <div className="mt-2">{formattedEvents}</div>
                  </div>
                );
              }
            })()
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  } else if (["getTasksFromListTool"].includes(toolInvocation.toolName)) {
    return (
      <div key={toolInvocation.toolCallId} className="flex flex-col gap-2">
        {toolInvocation.args.message}

        <div className="flex gap-2">
          {"result" in toolInvocation ? (
            (() => {
              // 타입 선언 및 안전성 검사
              const tasks = toolInvocation.result as tasks_v1.Schema$Task[];

              // 아무것도 없을 때
              if (tasks.length === 0) {
                return (
                  <span className="text-red-500">
                    작업 리스트가 비어 있습니다.
                  </span>
                );
              } else {
                // tasks 렌더링
                return (
                  <div>
                    <h3 className="text-lg font-bold">작업 리스트:</h3>
                    <ul className="list-disc ml-6">
                      {tasks.map((task) => (
                        <li key={task.id} className="mb-2">
                          <span>
                            {task.title || "제목 없음"}{" "}
                            {task.due
                              ? `(Due: ${new Date(task.due).toLocaleString()})`
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
              }
            })()
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}

/**
 * ChatMessageList - 채팅 메시지를 표시하는 리스트 컴포넌트
 */

export default function ChatMessageList({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  // 새로운 메시지가 추가될 때 스크롤
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-6 mb-28">
      {messages.map((m) => (
        <Card
          key={m.id}
          className={`p-4 ${
            m.role === "user"
              ? "self-end shadow-none bg-opacity-50"
              : "bg-transparent shadow-none self-start"
          }`}
        >
          <div className="whitespace-pre-wrap">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {m.content}
            </ReactMarkdown>
          </div>

          {m.toolInvocations?.map((toolInvocation) => (
            <ToolInvocationRenderer
              key={toolInvocation.toolCallId}
              toolInvocation={toolInvocation}
            />
          ))}
        </Card>
      ))}
      {isLoading && (
        <span className="p-4 bg-transparent shadow-none self-start animate-pulse text-gray-500">
          생각중...
        </span>
      )}

      {/* 스크롤을 끝으로 이동시키는 요소 */}
      <div ref={messageEndRef} />
    </div>
  );
}
