import { motion } from "framer-motion";
import gjLogo from "@/assets/gj-logo-new.png";

export function Loader() {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 1.1, delay: 1.6, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <img src={gjLogo} alt="GJ Media House" className="h-20 w-20 object-contain" />
      </motion.div>
    </motion.div>
  );
}
