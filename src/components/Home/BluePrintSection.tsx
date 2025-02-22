import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

// 메시지 객체의 타입 정의
interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const chatMessages: ChatMessage[] = [
  {
    role: "user",
    content: "SchedAI, 오늘 일정 브리핑해줘.",
  },
  {
    role: "ai",
    content: `오전 10시 마케팅 회의,
오후 12시 바이어와 점심식사, 
오후 3시 테니스 모임이 있습니다.`,
  },
  {
    role: "user",
    content: "내일 오후 3시부터 5시 비즈니스 미팅일정 추가해줘",
  },
  {
    role: "ai",
    content: `구글 캘린더에 일정 추가를 도와드릴까요? 
회의 내용과 참석자에 대한 부분도 
말씀해주시면 적용해드리겠습니다.`,
  },
  {
    role: "user",
    content: `회의 내용은 3분기 비즈니스 전략회의 이고, 
참석자는 기획부서 임원진이야.`,
  },
  {
    role: "ai",
    content: `구글 캘린더에 일정 추가가 완료되었습니다.
    * 비즈니스 미팅 *
    시간: 2월 22일 15시 ~ 17시
    회의내용: 비즈니스 전략 회의
    참석자: 기획부서 임원진
    `,
  },
  {
    role: "user",
    content: `다음주 24일~26일 휴일 프랑스 파리 여행 계획 짜줘`,
  },
  {
    role: "ai",
    content: `프랑스 여행 계획을 세우기 위해, 
여행의 목적, 선호하는 여행 스타일, 기간, 
방문하고 싶은 지역 등을 알아야 
더욱 맞춤형으로 작성할 수 있습니다.

1일차: 파리 도착 및 주요 명소 탐방
오전
샤를 드골 공항 도착 후 숙소 체크인
...`,
  },
];

export default function BluePrintSection() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  // 스트리밍 중인 메시지의 일부 내용을 저장하는 상태
  const [streamedContent, setStreamedContent] = useState("");
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let nextTimer: NodeJS.Timeout | null = null;
    // 모든 메시지가 출력되면 잠시 후 리셋
    if (currentMessageIndex >= chatMessages.length) {
      nextTimer = setTimeout(() => {
        setChatLog([]);
        setCurrentMessageIndex(0);
      }, 3000);
      return () => {
        if (nextTimer) clearTimeout(nextTimer);
      };
    }

    const currentMsg = chatMessages[currentMessageIndex];
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      charIndex++;
      setStreamedContent(currentMsg.content.slice(0, charIndex));
      if (charIndex === currentMsg.content.length) {
        clearInterval(typingInterval);
        // 타이핑 효과가 끝나면 chatLog에 추가
        setChatLog((prev) => [...prev, currentMsg]);
        setStreamedContent("");
        // 메시지 유형에 따라 딜레이 후 다음 메시지 전환
        nextTimer = setTimeout(
          () => {
            setCurrentMessageIndex((prev) => prev + 1);
          },
          currentMsg.role === "ai" ? 1000 : 3000
        );
      }
    }, 50); // 타이핑 속도 (50ms마다 한 글자)

    return () => {
      clearInterval(typingInterval);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, [currentMessageIndex]);

  // 스크롤을 부드럽게 이동
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTo({
        top: chatLogRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatLog, streamedContent]);

  // 현재 스트리밍 중인 메시지의 role을 확인 (존재할 경우)
  const currentStreamingRole =
    currentMessageIndex < chatMessages.length
      ? chatMessages[currentMessageIndex].role
      : null;

  return (
    <section className="flex justify-center">
      <div className="flex md:w-[720px] md:text-base text-sm justify-center items-center dark:text-primary-300 text-primary-500 p-5">
        <div className="p-6 rounded-2xl w-full backdrop-blur-lg bg-opacity-20 h-[500px] flex flex-col">
          {/* 채팅 기록 영역 – 부드러운 스크롤 적용 */}
          <div
            className="flex-1 overflow-y-auto space-y-2 hide-scrollbar scroll-smooth"
            ref={chatLogRef}
          >
            {chatLog.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`mt-5 p-4 rounded-2xl max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary-500/5 dark:bg-primary-300/10"
                      : "bg-orange-500/5 dark:bg-gray-800/30"
                  }`}
                >
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                </div>
              </div>
            ))}
            {/* 스트리밍 중인 메시지 표시 */}
            {streamedContent && currentStreamingRole && (
              <div
                className={`flex ${
                  currentStreamingRole === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`mt-5 p-4 rounded-2xl max-w-[80%] ${
                    currentStreamingRole === "user"
                      ? "bg-primary-500/5 dark:bg-primary-300/10"
                      : "bg-orange-500/5 dark:bg-gray-800/30"
                  }`}
                >
                  <span className="whitespace-pre-wrap">{streamedContent}</span>
                </div>
              </div>
            )}
          </div>

          {/* 하단 입력창 UI */}
          <div className="mt-3 flex items-center bg-white/50 dark:bg-gray-800/20 rounded-2xl p-2">
            <div className="flex-1 px-4 text-gray-500 dark:text-gray-400">
              메시지 입력 중...
            </div>
            <Button
              isIconOnly
              className="bg-transparent dark:text-primary-100 w-11"
            >
              <ArrowUpCircleIcon />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
