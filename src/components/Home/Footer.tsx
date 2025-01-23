{
  /* 푸터 섹션 */
}
import { motion } from "framer-motion";

import React from "react";
import GlassContainer from "../GlassContainer";

export default function Footer() {
  return (
    <section className="h-screen flex items-center">
      <motion.div
        className="py-8 bg-gray-800/80 text-white w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <GlassContainer className="text-center">
          <p className="text-sm opacity-75">
            &copy; 2025 SchedAI. 모든 권리 보유.
          </p>
        </GlassContainer>
      </motion.div>
    </section>
  );
}
