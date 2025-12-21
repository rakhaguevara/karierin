import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import EmptyChat from './EmptyChat';
import type { Message } from '@/lib/chat';

interface ChatMessagesProps {
  messages: Message[];
  loading?: boolean;
}

export default function ChatMessages({ messages, loading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return <EmptyChat />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessage key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>
        
        {loading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
