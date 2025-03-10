"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import GoolgleIcon from "@/images/google-icon-logo.svg";
import usageCard1 from "@/images/usageCard_1.png";
import usageCard2 from "@/images/usageCard_2.png";
import usageCard3 from "@/images/usageCard_3.png";
import profileImage from "@/images/profileimage.jpeg";

import { BeakerIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import { GithubLogo } from "@/components/SVGAssets";
import { FeatureBackground } from "@/components/SVGAssets";
import BluePrintSection from "./BluePrintSection";
import CTASection from "./CTASection";
import NeumorphicClock from "./Clock";

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
      <FeatureSection1 />
      <BluePrintSection />
      <FeatureSection2 />

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
  return (
    <section className="w-full min-h-screen items-center justify-start">
      <div className="flex md:flex-row flex-col 2xl:justify-center justify-start items-center mt-14">
        {/* 본문 컨테이너 */}
        <motion.div
          className="flex flex-col gap-8 order-2 md:order-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="text-black drop-shadow-lg w-full backdrop-blur-sm">
            {/* 메인 타이틀 */}
            <div className="flex flex-col gap-7 p-10 md:mx-20">
              <h2 className="md:text-7xl text-3xl mb-5 dark:text-white">
                <span className="text-[#07090F] dark:text-[#FFF8E7] px-3 border-1 border-primary-500 rounded-lg">
                  시간
                </span>
                을{" "}
                <span className="text-[#07090F] dark:text-[#FFF8E7] border-b border-primary-500">
                  디자인
                </span>
                하세요
              </h2>
              <h1 className="md:text-3xl text-xl dark:text-white">
                쉽고 편해지는 구글 캘린더 관리
              </h1>
              <h1 className="md:text-3xl text-xl dark:text-white">
                나만의 AI일정관리 비서,{" "}
                <span className="text-orange-500">SchedAI</span>.
              </h1>
              <Link
                href="/chat"
                className="text-lg text-white bg-primary-500 w-40 drop-shadow-md p-3 rounded-lg hover:bg-orange-500 transition-all"
              >
                지금 대화시작하기
              </Link>
            </div>
          </div>
        </motion.div>
        <div className="order-1 md:order-2">
          <NeumorphicClock />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------
   Feature Section
-----------------------------------*/

// FeatureSection1 : 문제와 솔루션 연결
function FeatureSection1() {
  return (
    <section className="w-full h-full flex justify-center md:text-3xl text-xl">
      <div className="flex flex-col gap-5 md:py-16 py-10 mx-10">
        <div>🧐 “이 일정, 어디에 저장했더라?”</div>
        <div>산더미처럼 쌓인 업무, 하나하나 수정하고 계신가요?</div>
        <div>일정이 쌓일수록 스트레스가 커지시나요?</div>
        <Divider />
        <div>
          <span className="text-orange-500">SchedAI</span>와 함께하면 모두
          해결할 수 있어요.
        </div>
      </div>
    </section>
  );
}

// FeatureSection2
function FeatureSection2() {
  const features = [
    {
      icon: <Image src={GoolgleIcon} alt="googleLogo" className="md:w-9 w-6" />,
      title: "Google Calendar & Task 완벽연동",
      description:
        "SchedAI는 Google Calendar & Task에 완벽하게 연동되어있습니다. 여러분이 로그인한 구글계정에 적용된 일정을 확인해보세요!",
    },
    {
      icon: <LightBulbIcon className="md:w-10 w-6" />,
      title: "스마트 일정 관리",
      description:
        "일일이 찾을 필요없이, 중요한 일정과 약속을 AI에게 물어보고 가장 좋은 날로 새로운 일정을 잡아보세요.",
    },
    {
      icon: <BeakerIcon className="md:w-10 w-6" />,
      title: "다양한 최신 LLM 모델 지원",
      description:
        "ChatGPT 4o mini, Gemini 2.0 flash 등 다양한 언어모델 지원으로 선호에 맞게 커스텀 가능",
    },
  ];
  return (
    <section className="relative my-32 flex justify-center w-screen h-screen">
      <FeatureBackground />
      <div className="flex flex-col gap-5 justify-center items-start m-5 h-full">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="backdrop-blur-md bg-white/5 shadow-lg p-5"
          >
            <CardHeader className="flex gap-5">
              {feature.icon}
              <h3 className="text-xl">{feature.title}</h3>
            </CardHeader>
            <CardBody>{feature.description}</CardBody>
          </Card>
        ))}
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
      className="relative w-80 h-72 rounded-lg overflow-hidden shadow-md"
      role="button"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill={true}
          sizes="512px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gray-200" />
      )}
      <div className="absolute bottom-0 w-full bg-white text-primary-600 p-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm  mt-1">{description}</p>
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
            />
          </div>

          {/* 소개 텍스트 */}
          <div>
            <h3 className="text-xl font-semibold mb-2">Sanchez, Na</h3>
            <p className="mb-4">
              프론트엔드 개발자, AI 스케줄링 서비스 SchedAI를 개발하고 있습니다.
              더 효율적인 삶을 위한 자동화와 UX를 고민합니다.
            </p>
            <div className="flex md:flex-row flex-col md:items-center items-start gap-3 text-black">
              <a
                href="https://github.com/songchez"
                target="_blank"
                className="flex items-center justify-center gap-2 bg-neutral-200 p-2 rounded-2xl hover:shadow-md transition-all"
              >
                <GithubLogo />
                <span className="text-lg">github</span>
              </a>

              <a
                href="https://www.buymeacoffee.com/tama4840X"
                target="_blank"
                className="flex p-2 items-center bg-yellow-400 rounded-2xl hover:shadow-md transition-all"
              >
                <p className="text-2xl">🍔</p>
                <span className="ml-2 text-lg text-primary-500">
                  buy me a bigmac
                </span>
              </a>
              <a
                href="https://eliclosetshop.tistory.com/"
                target="_blank"
                className="bg-[rgb(252,87,87)] text-lg text-white rounded-2xl p-2 hover:shadow-md transition-all"
              >
                tistory blog
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
    <footer className="relative w-full py-6 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* 로고 (간단히 텍스트로 처리) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-xl font-bold">
            SchedAI
          </Link>
        </div>
        <div className="flex flex-col items-end text-sm">
          <p className="mt-3 md:mt-0">© 2025 SchedAI. All rights reserved.</p>
          <Link href="/privacy" className="text-orange-300 font-bold">
            개인정보 처리방침
          </Link>
          <Link href="/terms" className="text-orange-300 font-bold">
            SchedAI 이용약관
          </Link>
        </div>

        {/* 소셜 링크가 있다면 추가 */}
        {/* 예) <div>소셜 아이콘...</div> */}
      </div>
    </footer>
  );
}
