import { motion } from "framer-motion";

import {
  CalendarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ArrowPathIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// 아이콘을 매핑하는 헬퍼 객체
const icons = {
  calendar: <CalendarIcon className="h-8 w-8 text-primary-500" />,
  chat: <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 text-primary-500" />,
  sync: <ArrowPathIcon className="h-8 w-8 text-primary-500" />,
  user: <UserIcon className="h-8 w-8 text-primary-500" />,
};

// 개별 기능 카드 컴포넌트
export default function FeatureCard({
  index,
  title,
  description,
  icon,
  isInView,
}: {
  index: number;
  title: string;
  description: string;
  icon: keyof typeof icons;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="p-6 bg-white/80 backdrop-blur-lg rounded-xl drop-shadow-lg hover:drop-shadow-2xl transition-shadow"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Heroicons 아이콘 삽입 */}
      <div>{icons[icon]}</div>
      <h3 className="mt-4 font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
