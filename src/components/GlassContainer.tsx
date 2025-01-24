import { Card } from "@heroui/react";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassContainer({
  children,
  className = "",
}: GlassContainerProps) {
  return (
    <Card
      isBlurred
      className={`dark:bg-black/10 bg-primary-100/10 backdrop-blur-sm rounded-lg shadow-md p-4 ${className}`}
    >
      {children}
    </Card>
  );
}
