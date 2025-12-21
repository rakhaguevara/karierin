import { motion } from 'framer-motion';
import { Compass, Sparkles } from 'lucide-react';

export default function EmptyChat() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6"
      >
        <Compass className="w-10 h-10 text-primary" />
      </motion.div>
      
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Ask Karierin about your future career
      </h2>
      
      <p className="text-muted-foreground max-w-md mb-8">
        I'm your AI career assistant. Let's explore your passions, discover suitable career paths, and plan your professional journey together.
      </p>

      <div className="grid gap-3 w-full max-w-md">
        {[
          'What careers match my interests in technology and creativity?',
          'How do I start a career in data science as a fresh graduate?',
          'What skills should I develop for a product management role?',
        ].map((suggestion, index) => (
          <motion.button
            key={suggestion}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors text-left group"
          >
            <Sparkles className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
              {suggestion}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
