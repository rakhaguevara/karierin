import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <span className="text-sm font-semibold text-primary">K</span>
      </div>
      <div className="chat-bubble-assistant">
        <div className="flex gap-1.5 py-1">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </motion.div>
  );
}
