"use client";
import { useEffect, useState, useRef } from "react";

export default function NeumorphicClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => setTime(new Date());
    const now = new Date();
    const msToNextSecond = 1000 - now.getMilliseconds();

    const timeout = setTimeout(() => {
      updateTime();
      intervalRef.current = setInterval(updateTime, 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 서버와의 HTML 불일치를 방지하기 위해 클라이언트에서만 렌더링
  if (!mounted) return null;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <div className="flex h-full justify-center items-center">
      <div className="relative md:w-64 md:h-64 w-40 h-40 bg-transparent rounded-full shadow-neumorphism dark:dark-shadow-neumorphism flex justify-center items-center">
        {/* 시계 중심 원 */}
        <div className="absolute w-3 h-3 bg-gray-800 dark:bg-gray-200 rounded-full z-10" />

        {/* 시침 */}
        <div
          className="absolute w-2 md:h-12 h-8 rounded-full bg-primary-500 dark:bg-primary-300"
          style={{ transform: `rotate(${hourAngle}deg) translateY(-50%)` }}
        />

        {/* 분침 */}
        <div
          className="absolute w-1 md:h-20 h-14 rounded-full bg-gray-800 dark:bg-gray-200"
          style={{ transform: `rotate(${minuteAngle}deg) translateY(-50%)` }}
        />

        {/* 초침 */}
        <div
          className="absolute w-[2px] md:h-24 h-16 rounded-full bg-[#1D201F] dark:bg-[#ea580c]"
          style={{ transform: `rotate(${secondAngle}deg) translateY(-50%)` }}
        />

        {/* 12, 3, 6, 9 시각 표시 */}
        <div className="absolute w-1 h-4 bg-[#1D201F] dark:bg-[#ea580c] top-[10%] left-1/2 -translate-x-1/2 rounded-full" />
        <div className="absolute w-4 h-1 bg-[#1D201F] dark:bg-[#ea580c] right-[10%] top-1/2 -translate-y-1/2 rounded-full" />
        <div className="absolute w-1 h-4 bg-[#1D201F] dark:bg-[#ea580c] bottom-[10%] left-1/2 -translate-x-1/2 rounded-full" />
        <div className="absolute w-4 h-1 bg-[#1D201F] dark:bg-[#ea580c] left-[10%] top-1/2 -translate-y-1/2 rounded-full" />
      </div>
    </div>
  );
}
