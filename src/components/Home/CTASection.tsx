/* --------------------------------
   CTA Section (Trendy Version)
-----------------------------------*/
import Link from "next/link";
import { motion } from "framer-motion";

function CTASection() {
  return (
    <section className="relative w-full py-20 bg-gradient-to-br dark:from-primary-600 dark:to-primary-700 from-rose-100 to-primary-100">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        <Link href="/chat">
          <motion.div
            initial={{
              backgroundSize: "150% 150%",
              backgroundPosition: "center center",
            }}
            whileHover={{
              backgroundSize: "300% 300%",
              transition: { duration: 0.6, ease: "linear" },
            }}
            style={{
              backgroundImage:
                // 가운데를 중심으로 은은한 그라디언트 확대되는 느낌
                "radial-gradient(circle at center, #FFF8E7 0%, #2D2D2A 40%, transparent 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundRepeat: "no-repeat",
              backgroundClip: "text",
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-2 mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                AI 스케줄러, 지금 바로 체험하기
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200">
              한 번의 클릭으로 일정 고민, 간단하게 끝내보세요.
            </p>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}

export default CTASection;
