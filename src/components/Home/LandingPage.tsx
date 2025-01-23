"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import GlassContainer from "../GlassContainer";
import FeatureCard from "./HowItWorksCard";
import HowItWorksCard from "./FeatureCard";
import bakgroundImageNewYork from "@/images/dark_dashboard_background.png";
import Image from "next/image";
import SchedAILogdo from "@/images/SchedAILogo.png";
import Link from "next/link";
import { useEffect } from "react";
import Footer from "./Footer";

export default function LandingPage() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true });

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    let currentSection = 0;
    let isScrolling = false;

    const scrollToSection = (index: number) => {
      isScrolling = true;
      sections[index].scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        isScrolling = false;
      }, 500);
    };

    const handleWheel = (e: { deltaY: number }) => {
      if (isScrolling) return;

      if (e.deltaY > 0 && currentSection < sections.length - 1) {
        currentSection++;
        scrollToSection(currentSection);
      } else if (e.deltaY < 0 && currentSection > 0) {
        currentSection--;
        scrollToSection(currentSection);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative font-sans">
      <div className="fixed top-0 left-0 w-screen h-screen -z-10">
        <Image
          className="w-full h-full object-cover"
          src={bakgroundImageNewYork}
          height={1980}
          width={1080}
          alt="backgroundimage"
          priority
        />
      </div>
      {/* 히어로 섹션 */}
      <section className="h-screen">
        <motion.div
          className="relative h-screen flex items-center justify-center bg-cover bg-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* 배경 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
          <div className="relative text-center text-white rounded-2xl">
            <div className="flex gap-5 items-center">
              <motion.div
                className="drop-shadow-lg"
                initial={{ opacity: 0, rotate: 0 }}
                animate={{ opacity: 1, rotate: 480 }}
                transition={{ duration: 3, ease: "linear" }}
              >
                <Image src={SchedAILogdo} alt="logo" height={100} width={100} />
              </motion.div>
              <motion.h1
                className="text-5xl md:text-7xl font-bold drop-shadow-lg"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1 }}
              >
                SchedAI
              </motion.h1>
            </div>
            <div className="flex flex-col gap-10">
              <motion.div
                className="mt-4 text-lg md:text-xl text-gray-200 opacity-90"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                AI 기반 스케줄링 비서
              </motion.div>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.3 }}
              >
                <Link
                  className="bg-primary-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-600 transition-all"
                  href={"/chat"}
                >
                  SchedAI 시작하기
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="h-screen flex items-center">
        <div ref={sectionRef} className="py-20 bg-gray-50/80 w-full">
          <GlassContainer>
            <motion.h2
              className="text-3xl font-bold text-center mb-10 text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              주요 기능
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                index={0}
                title="스마트 일정 관리"
                description="AI가 사용자의 패턴을 학습하여 최적화된 일정을 추천합니다."
                icon="calendar"
                isInView={isInView}
              />
              <FeatureCard
                index={1}
                title="자연어 명령"
                description='예: "다음 주 금요일 오후 3시에 미팅 잡아줘"와 같이 직관적인 명령을 사용할 수 있습니다.'
                icon="chat"
                isInView={isInView}
              />
              <FeatureCard
                index={2}
                title="실시간 동기화"
                description="Google Calendar와 연동하여 언제 어디서든 즉시 업데이트됩니다."
                icon="sync"
                isInView={isInView}
              />
              <FeatureCard
                index={3}
                title="맞춤화"
                description="개인 선호도에 맞춰 알람, 일정 추천 등 다양한 기능을 제공합니다."
                icon="user"
                isInView={isInView}
              />
            </div>
          </GlassContainer>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="h-screen flex items-center">
        <div className="py-20 bg-gray-900/80 text-white w-full">
          <GlassContainer>
            <motion.h2
              className="text-3xl font-bold text-center mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              사용 방법
            </motion.h2>
            <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
              <HowItWorksCard
                index={0}
                title="일정 추가"
                description='예: "내일 오후 2시에 회의 추가해줘"와 같이 자연어로 손쉽게 일정을 등록하세요.'
                isInView={isInView}
              />
              <HowItWorksCard
                index={1}
                title="캘린더 보기"
                description='예: "이번 주 일정 보여줘" 등을 통해 현재 일정 상황을 간단히 확인할 수 있습니다.'
                isInView={isInView}
              />
              <HowItWorksCard
                index={2}
                title="효율적인 일정 관리"
                description="자동 알림과 스케줄 조율 기능으로 더욱 체계적으로 일정을 관리해 보세요."
                isInView={isInView}
              />
            </div>
          </GlassContainer>
        </div>
      </section>
      <Footer />
    </div>
  );
}
