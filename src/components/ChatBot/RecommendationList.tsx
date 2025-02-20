// src/components/ChatBot/RecommendationList.tsx
"use client";

import { Card, CardBody } from "@heroui/react";
import { useEffect, useState } from "react";

interface RecommendationListProps {
  onSelect: (recommendation: string) => void;
}

export function RecommendationList({ onSelect }: RecommendationListProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    // 대화 시작 전 보여줄 추천 문구 (랜덤 3개 선택)
    const allRecommendations = [
      `📆 이번 주 스케줄 브리핑해줘`,
      `🌈 오늘 하루를 계획해줘`,
      `🧐 이번 주 스케줄 보여줘`,
      `🚗 주말에 갈 여행지를 추천해줘.`,
      `🏃🏻‍♀️ 운동 일정을 추가해줘.`,
      `💁🏻 어떤 도움을 줄 수 있어?`,
      `💍 기념일을 추가하려고 해`,
      `👍 저번달 스케줄을 분석해줘`,
    ];

    const randomItems = allRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendations(randomItems);
  }, []);

  return (
    <div className="pb-5">
      <div className="flex gap-4 flex-wrap justify-center items-center mb-10">
        {recommendations.map((recommendation) => (
          <Card
            key={recommendation}
            isPressable
            onPress={() => onSelect(recommendation)}
            className="px-4 py-2 text-sm text-clip rounded-lg shadow-md transition-all hover:scale-105 max-w-44"
          >
            <CardBody>{recommendation}</CardBody>
          </Card>
        ))}
      </div>
      {/* 시작 문구 */}
      <div className="flex justify-center">
        <span className="md:text-2xl text-xl text-primary-500 dark:text-white">
          무엇을 도와드릴까요?
        </span>
      </div>
    </div>
  );
}
