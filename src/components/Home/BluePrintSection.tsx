import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { motion, useCycle } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// 메시지 객체의 타입 정의
interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const chatMessages: ChatMessage[] = [
  {
    role: "user",
    content: "",
  },
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
    content: `구글 캘린더에 일정추가를 도와드릴까요? 
회의 내용과 참석자에 대한부분도 
말씀해주시면 적용해드리겠습니다.`,
  },
  {
    role: "user",
    content: `회의 내용은 3분기 비즈니스 전략회의 이고, 
참석자는 기획부서 임원진이야.`,
  },
  {
    role: "ai",
    content: `구글 캘린더에 일정 추가가 완료되었습니다.`,
  },
  {
    role: "user",
    content: `다음주 24일~26일 휴일 프랑스파리 여행 계획 짜줘`,
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
  // useCycle에 제네릭 타입을 적용하여 ChatMessage 객체 순환
  const [currentMessage, cycleMessage] = useCycle<ChatMessage>(...chatMessages);
  const [displayText, setDisplayText] = useState<string>("");
  // 채팅 기록은 누적되지 않고, 매 반복 시 초기화(첫 메시지부터 시작)
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  // 채팅 기록 영역에 스크롤 제어를 위한 ref
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 현재 메시지를 전체 텍스트로 바로 표시
    setDisplayText(currentMessage.content);

    // 3초 후 현재 메시지를 채팅 기록에 추가하고, 다음 메시지로 전환
    const timer = setTimeout(() => {
      // 만약 현재 메시지가 배열의 첫 번째 메시지라면 채팅 기록을 초기화
      if (currentMessage === chatMessages[0]) {
        setChatLog([]);
      } else {
        setChatLog((prev) => [...prev, currentMessage]);
      }
      cycleMessage();
      setDisplayText("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentMessage, cycleMessage]);

  // 채팅 기록(chatLog) 또는 진행 중인 메시지(displayText)가 변경될 때마다 스크롤을 하단으로 이동
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog, displayText]);

  return (
    <motion.div className="w-[500px] flex justify-center items-center dark:text-primary-300 text-primary-500">
      <div className="p-6 rounded-2xl w-full backdrop-blur-lg bg-opacity-20 h-[500px] flex flex-col">
        {/* 채팅 기록 영역 – 스크롤은 가능하지만 스크롤바는 숨김 */}
        <div
          className="flex-1 overflow-y-auto space-y-2 hide-scrollbar"
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
                className={`p-4 rounded-2xl max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-blue-500/10 dark:bg-blue-300/10"
                    : "bg-gray-100/30 dark:bg-gray-800/30"
                }`}
              >
                <pre className="whitespace-pre-wrap">{msg.content}</pre>
              </div>
            </div>
          ))}
          {/* 진행 중인 현재 메시지에만 애니메이션 적용 */}
          {displayText && (
            <motion.div
              key="currentMessage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                currentMessage.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-4 rounded-2xl max-w-[80%] ${
                  currentMessage.role === "user"
                    ? "bg-blue-500/10 dark:bg-blue-300/10"
                    : "bg-gray-100/30 dark:bg-gray-800/30"
                }`}
              >
                <pre className="whitespace-pre-wrap">{displayText}</pre>
              </div>
            </motion.div>
          )}
        </div>

        {/* 하단 가짜 입력창 */}
        <div className="mt-3 flex items-center bg-white/20 dark:bg-gray-800/20 rounded-2xl p-2">
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
    </motion.div>
  );
}
