import { motion } from "framer-motion";

export function WhatsApp() {
  return (
    <motion.a
      href="https://wa.me/201226098595"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 3.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30"
      aria-label="Chat on WhatsApp"
    >
      <motion.span
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
        className="absolute h-full w-full rounded-full bg-[#25D366] opacity-40"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="relative h-7 w-7"
      >
        <path d="M16.002 2.4C8.49 2.4 2.4 8.49 2.4 16.002c0 2.37.62 4.69 1.8 6.73L2.4 29.6l7.09-1.77a13.56 13.56 0 0 0 6.51 1.66h.01c7.51 0 13.6-6.09 13.6-13.6C29.6 8.49 23.51 2.4 16.002 2.4zm0 24.93h-.01a11.27 11.27 0 0 1-5.74-1.57l-.41-.25-4.21 1.05 1.07-4.1-.27-.42a11.22 11.22 0 0 1-1.72-6.03c0-6.22 5.07-11.28 11.3-11.28s11.3 5.06 11.3 11.28-5.07 11.3-11.31 11.3zm6.2-8.46c-.34-.17-2-1-2.31-.11-.31.09-.53.48-.66.65l-.34.38c-.13.15-.25.17-.47.06-.22-.11-.93-.34-1.77-1.1-.66-.59-1.1-1.31-1.23-1.53-.13-.22-.01-.34.1-.45l.32-.38c.1-.12.13-.22.2-.37.07-.15.03-.28-.02-.39-.05-.11-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5l-.56-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.19-.57-.34z" />
      </svg>
    </motion.a>
  );
}
