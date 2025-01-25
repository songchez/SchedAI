/** 날짜/시간을 한국어 포맷으로 변환해주는 함수 */
export function formatToKoreanDateTime(
  dateString: string | null | undefined
): string {
  if (!dateString) {
    throw new Error("dateString이 null이거나 undefined입니다.");
  }

  // 날짜 객체 생성
  const date = new Date(dateString);

  // UTC 시간 기준으로 변환
  if (isNaN(date.getTime())) {
    throw new Error("유효하지 않은 날짜 형식입니다.");
  }

  // 한국 표준시(KST)로 변환
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  // 포맷터 설정
  const formatter = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: dateString.includes("T") ? "numeric" : undefined,
    minute: dateString.includes("T") ? "numeric" : undefined,
    hour12: false,
  });

  const formatted = formatter.format(kstDate);
  return dateString.includes("T")
    ? formatted.replace(":", "시 ") + "분"
    : formatted;
}
