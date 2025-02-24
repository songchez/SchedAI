"use client";
import { useEffect, useState } from "react";

export default function NeumorphicClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
        <div className="absolute -bottom-10">{time.toTimeString()}</div>
      </div>
    </div>
  );
}
