import { Card } from "@nextui-org/react";

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
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-lg p-6 ${className}`}
    >
      {children}
    </Card>
  );
}