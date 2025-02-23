import Link from "next/link";
import { motion } from "framer-motion";

function CTASection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: -50, rotate: -5 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80 },
    },
  };

  return (
    <section className="relative w-full h-full py-14">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center"
      >
        <motion.div className="flex flex-col md:flex-row items-center gap-2 mb-6">
          <motion.h2
            variants={headingVariants}
            className="text-2xl md:text-4xl font-extrabold tracking-tight"
          >
            AI 스케줄러, 지금 바로 체험하기
          </motion.h2>
        </motion.div>
        <Link href="/chat">
          <motion.div
            variants={buttonVariants}
            className="border border-primary-500 dark:border-white p-3 md:text-lg text-base rounded-2xl transition-colors duration-200"
            whileHover={{
              scale: 1.08,
              rotate: -2,
              boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            지금 대화하러가기
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}

export default CTASection;
