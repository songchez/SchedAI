import { motion } from "framer-motion";
// 사용 방법 카드 컴포넌트
export default function HowItWorksCard({
  index,
  title,
  description,
  isInView,
}: {
  index: number;
  title: string;
  description: string;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="p-6 bg-gray-800/80 backdrop-blur-md rounded-xl drop-shadow-lg hover:drop-shadow-2xl transition-shadow"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }}
      transition={{ duration: 0.5, delay: index * 0.3 }}
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-gray-100 opacity-90 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
