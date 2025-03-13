// app/api/chat/utils.ts

/** 날짜/시간을 한국어 포맷으로 변환해주는 함수 */
export function formatToKoreanDateTime(
  dateString: string | null | undefined
): string {
  if (!dateString) {
    throw new Error("dateString이 null이거나 undefined입니다.");
  }

  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: dateString.includes("T") ? "numeric" : undefined,
    minute: dateString.includes("T") ? "numeric" : undefined,
    hour12: false,
  });

  const formatted = formatter.format(date);
  return dateString.includes("T")
    ? formatted.replace(":", "시 ") + "분"
    : formatted;
}

export function extractPlainToolResult(toolResult: {
  toolCallId: string;
  toolName: string;
  args: object;
  result: object;
}): object {
  return {
    type: "tool-invocation",
    toolInvocation: {
      state: "result",
      step: 0,
      toolCallId: toolResult.toolCallId,
      toolName: toolResult.toolName,
      args: toolResult.args,
      result: toolResult.result,
    },
  };
}
