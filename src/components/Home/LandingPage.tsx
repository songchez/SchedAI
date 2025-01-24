"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll } from "framer-motion";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import SchedAILogo from "@/images/SchedAILogo.png";
import bakgroundImageNewYork from "@/images/dark_dashboard_background.png";
import calendarIcon from "@/images/3d_calendar.png";
import { CardBody, CardHeader } from "@heroui/react";
import GlassContainer from "../GlassContainer";
import GoolgleIcon from "@/images/google-icon-logo.svg";
import usageCard1 from "@/images/usageCard_1.png";
import usageCard2 from "@/images/usageCard_2.png";
import usageCard3 from "@/images/usageCard_3.png";
import profileImage from "@/images/profileimage.jpeg";
import githubLogo from "@/images/github-mark.svg";

import {
  CalendarDaysIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BeakerIcon,
} from "@heroicons/react/24/solid";
import Script from "next/script";
import Coffee from "./Coffee";
import GithubLogo from "./GithubLogo";

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* =======================
          1. Hero 섹션
      ======================= */}
      <HeroSection />

      {/* =======================
          2. Feature 섹션
      ======================= */}
      <FeatureSection />

      {/* =======================
          3. CTA 섹션
      ======================= */}
      <CTASection />

      {/* =======================
          4. SchedAI 100% 활용하기 섹션
      ======================= */}
      <UsageSection />

      {/* =======================
          5. 개발자 소개 섹션
      ======================= */}
      <DeveloperSection />

      {/* =======================
          6. Footer 섹션
      ======================= */}
      <FooterSection />
    </main>
  );
}

/* --------------------------------
   Hero Section
-----------------------------------*/
function HeroSection() {
  // 타자 효과 예시 문구s
  const [text] = useTypewriter({
    words: [
      `"SchedAI, 오늘 일정 브리핑해줘."
------------
SchedAI: "오전 10시 마케팅 회의,
오후 12시 바이어와 점심식사, 
오후 3시 테니스 모임이 있습니다."`,

      `"내일 오후 3시부터 5시 비즈니스 미팅일정 추가해줘"
------------
SchedAI: "구글 캘린더에 일정추가를 도와드릴까요? 
회의 내용과 참석자에 대한부분도 
말씀해주시면 적용해드리겠습니다."
------------
"회의 내용은 3분기 비스니스 전략회의 이고, 
참석자는 기획부서 임원진이야."
------------
SchedAI: "구글 캘린더에 일정 추가가 완료되었습니다."`,
      `"다음주 24일~26일 휴일 프랑스파리 여행 계획 짜줘"
------------
SchedAI: "프랑스 여행 계획을 세우기 위해, 
여행의 목적, 선호하는 여행 스타일, 기간, 
방문하고 싶은 지역 등을 알아야 
더욱 맞춤형으로 작성할 수 있습니다."

1일차: 파리 도착 및 주요 명소 탐방
오전
샤를 드골 공항 도착 후 숙소 체크인
..."`,
    ],
    loop: 5, // 반복 횟수 (0이면 무한)
    typeSpeed: 30,
    deleteSpeed: 10,
    delaySpeed: 1500,
  });

  return (
    <section className="relative w-full h-screen flex items-center justify-center bg-no-repeat bg-center bg-cover">
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

      <div className="fixed inset-0 bg-gradient-to-b from-black/40 to-black/20" />

      {/* 본문 컨테이너 */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-center gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* 왼쪽: 스트리밍 대화 텍스트: 2초후에 등장 */}

        <motion.div
          className="text-lg md:text-xl font-light overflow-hidden bg-black/10 backdrop-blur-sm rounded-lg"
          initial={{ width: 0, padding: 0 }}
          animate={{ width: 500, padding: 4 }}
          transition={{
            delay: 2,
            duration: 1,
            ease: "easeOut",
          }}
        >
          <div className="text-primary-300 whitespace-pre m-3">
            {/* Typewriter로 출력되는 영역 */}
            {text}
            <Cursor />
          </div>
        </motion.div>

        {/* 오른쪽: 로고 + 타이틀 + CTA 버튼 */}
        <div className="flex flex-col items-center text-white text-center">
          {/* 로고 */}
          <motion.div
            className="mb-5"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            <Image
              src={SchedAILogo}
              alt="SchedAI Logo"
              width={100}
              height={100}
            />
          </motion.div>

          {/* 메인 타이틀 */}
          <motion.h1
            className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            SchedAI
          </motion.h1>

          {/* 서브 텍스트 */}
          <motion.p
            className="text-lg md:text-xl opacity-90 mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            AI 기반 스케줄링 비서
          </motion.p>

          {/* Hero CTA 버튼 */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.3 }}
          >
            <Link
              href="/chat"
              className="bg-primary-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-600 transition-all"
            >
              SchedAI 시작하기
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* --------------------------------
   Feature Section
-----------------------------------*/
function FeatureSection() {
  return (
    <section className="w-full py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-2 gap-4 items-center">
        {/* 오른쪽 달력 아이콘 */}
        <CalendarDisplay />
        {/* 왼쪽 Feature Cards 목록 */}
        <FeatureCards />
      </div>
    </section>
  );
}

function CalendarDisplay() {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <Image
          src={calendarIcon}
          alt="Calendar Icon"
          height={400}
          width={400}
          style={{ objectFit: "contain" }}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}

function FeatureCards() {
  const features = [
    {
      icon: <CalendarDaysIcon className="w-10" />,
      title: "스마트 일정 관리",
      description:
        "AI 기반 패턴 분석으로 당신의 일정 패턴을 학습해 최적의 스케줄을 제안합니다.",
    },
    {
      icon: <ChatBubbleOvalLeftEllipsisIcon className="w-10" />,
      title: "직관적인 대화 명령이해",
      description:
        '"내일 저녁 7시 회의 잡아줘"처럼 자연어 명령으로 손쉽게 스케줄을 생성합니다.',
    },
    {
      icon: <Image src={GoolgleIcon} alt="googleLogo" className="w-9" />,
      title: "Google Calendar 완벽 연동",
      description:
        "구글 캘린더와 자동 동기화로 한 곳에서 모든 일정을 관리하세요.",
    },
    {
      icon: <BeakerIcon className="w-10" />,
      title: "다양한 LLM모델 지원",
      description:
        "ChatGPT 4o mini, Gemini 2.0 flash 등 다양한 언어모델 지원으로 선호에 맞게 커스텀 가능",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg shadow-lg hover:shadow-primary-400 hover:drop-shadow-2xl">
      <GlassContainer className="hover:text-blue-400 text-primary-100 min-h-60">
        <CardHeader className="flex-col md:flex-row gap-3">
          {icon}
          <h3 className="md:text-xl text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardBody>
          <p>{description}</p>
        </CardBody>
      </GlassContainer>
    </div>
  );
}

/* --------------------------------
   CTA Section
-----------------------------------*/
function CTASection() {
  return (
    <section className="relative w-full py-20 bg-gradient-to-br dark:from-primary-500 dark:to-primary-600 from-white to-primary-100">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        <Link href="/chat">
          <motion.div
            initial={{
              backgroundSize: "150% 150%",
              backgroundPosition: "center center", // 초기 중심 위치 설정
            }}
            whileHover={{
              backgroundSize: "450% 450%",
              transition: { duration: 0.5, ease: "linear" },
            }}
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #FFF8E7, #2D2D2A, transparent 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundRepeat: "no-repeat",
              backgroundClip: "text",
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">무료로 SchedAI</h2>
              <Image
                src={SchedAILogo}
                alt="SchedAI Logo"
                width={40}
                height={40}
              />
              <h2 className="text-3xl md:text-4xl font-bold">사용해보기</h2>
            </div>
            <p className="text-lg md:text-xl">
              지금 바로 AI 스케줄링 비서를 체험해보세요.
            </p>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}

/* --------------------------------
   100% 활용하기 (블로그 섹션)
-----------------------------------*/
function UsageSection() {
  return (
    <section className="relative w-full py-20 dark:bg-black/40 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          SchedAI 100% 활용하기
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {/* 예시 카드 1 */}
          <ParallaxCard
            image={usageCard1}
            title="효율적인 스케줄링 프롬프트 작성법"
            description="AI에게 명령을 더욱 정확히 전달하는 팁을 알아보세요."
            link="/blog/prompt-tips"
          />
          {/* 예시 카드 2 */}
          <ParallaxCard
            image={usageCard2}
            title="Google Calendar와 AI의 완벽한 조화"
            description="구글 캘린더와 SchedAI를 연동해서 얻을 수 있는 장점들."
            link="/blog/google-calendar-ai"
          />
          {/* 예시 카드 3 - 필요시 추가 */}
          <ParallaxCard
            image={usageCard3}
            title="SchedAI 이해하기"
            description="100% 활용하기 위한 SchedAI기능들 이해하기"
            link="/blog/custom-reminder"
          />
        </div>
      </div>
    </section>
  );
}

/* ParallaxCard 컴포넌트 예시 */
function ParallaxCard({
  title,
  description,
  link,
  image,
}: {
  title: string;
  description: string;
  link: string;
  image?: StaticImageData;
}) {
  // 간단하게 hover 시 이미지가 살짝 움직이는 정도로 예시
  return (
    <motion.div
      className="relative w-80 h-72 rounded-lg overflow-hidden shadow-md "
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {image ? (
        <Image src={image} alt={title} fill className="object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}
      <div className="absolute bottom-0 w-full bg-white p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <Link
          href={link}
          className="text-primary-500 text-sm mt-2 inline-block"
        >
          더 보기(준비중)
        </Link>
      </div>
    </motion.div>
  );
}

/* --------------------------------
   개발자 소개 섹션
-----------------------------------*/
function DeveloperSection() {
  // Intersection Observer로 inView 트리거
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section className="relative w-full py-20 bg-white dark:bg-black/40 text-primary-600 dark:text-primary-100">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
          개발자 소개
        </h2>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="flex flex-col md:flex-row items-center gap-8"
        >
          {/* 프로필 이미지 */}
          <div className="relative rounded-full overflow-hidden shadow-lg">
            <Image
              src={profileImage}
              alt="Developer Profile"
              width={200}
              height={200}
              style={{ objectFit: "cover" }}
            />
          </div>

          {/* 소개 텍스트 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Sanchez, Na</h3>
            <p className="mb-4">
              프론트엔드 개발자, AI 스케줄링 서비스 SchedAI를 개발하고 있습니다.
              더 효율적인 삶을 위한 자동화와 UX를 고민합니다.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com/songchez" target="_blank">
                <GithubLogo />
              </a>

              <a
                href="https://www.buymeacoffee.com/tama4840X"
                target="_blank"
                className="flex p-2 items-center bg-yellow-400 rounded-2xl hover:shadow-md"
              >
                <p className="text-xl">🍔</p>
                <span className="ml-2 text-md font-bold text-primary-500">
                  Buy Me A Coffee
                </span>
              </a>
              <a
                href="https://eliclosetshop.tistory.com/"
                target="_blank"
                className="bg-[rgb(252,87,87)] text-white rounded-2xl px-4 py-2 hover:bg-primary-600 transition-all"
              >
                티스토리 블로그
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------------
   Footer Section
-----------------------------------*/
function FooterSection() {
  return (
    <footer className="w-full py-6 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* 로고 (간단히 텍스트로 처리) */}
        <div className="flex items-center gap-3">
          {/* 원한다면 여기서 Image 로고로 교체 가능 */}
          <div className="text-xl font-bold">SchedAI</div>
        </div>
        <p className="mt-3 md:mt-0 text-sm">
          © 2025 SchedAI. All rights reserved.
        </p>
        {/* 소셜 링크가 있다면 추가 */}
        {/* 예) <div>소셜 아이콘...</div> */}
      </div>
    </footer>
  );
}
