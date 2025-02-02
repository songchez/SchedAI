"use client";

import { Card, CardBody } from "@heroui/react";

interface RecommendationListProps {
  recommendations: string[];
  onSelect: (recommendation: string) => void;
}

export function RecommendationList({
  recommendations,
  onSelect,
}: RecommendationListProps) {
  return (
    <div className="flex gap-4 flex-wrap justify-center mb-36">
      {recommendations.map((recommendation) => (
        <Card
          key={recommendation}
          isPressable
          onPress={() => onSelect(recommendation)}
          className="px-4 py-2 text-sm rounded-lg shadow-md transition-all hover:scale-105"
        >
          <CardBody>{recommendation}</CardBody>
        </Card>
      ))}
    </div>
  );
}
