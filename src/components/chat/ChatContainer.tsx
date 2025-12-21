import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import {
  type Message,
  type ChatSession,
  getMessages,
  saveMessage,
  sendMessageToRAG,
  updateChatSessionTitle,
} from '@/lib/chat';

interface ChatContainerProps {
  session: ChatSession | null;
  onSessionUpdate?: () => void;
}

export default function ChatContainer({ session, onSessionUpdate }: ChatContainerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Load messages when session changes
  useEffect(() => {
    if (session) {
      loadMessages();
    } else {
      setMessages([]);
    }
  }, [session?.id]);

  const loadMessages = async () => {
    if (!session) return;
    
    setLoadingMessages(true);
    try {
      const data = await getMessages(session.id);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!session || !user) return;

    setLoading(true);

    try {
      // Save user message
      const userMessage = await saveMessage(session.id, user.id, 'user', content);
      setMessages((prev) => [...prev, userMessage]);

      // Update session title with first message if it's still default
      if (session.title === 'New Career Session' && messages.length === 0) {
        const newTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await updateChatSessionTitle(session.id, newTitle);
        onSessionUpdate?.();
      }

      // Send to RAG and get response
      const aiResponse = await sendMessageToRAG(content, user.id, session.id);

      // Save AI response
      const assistantMessage = await saveMessage(session.id, user.id, 'assistant', aiResponse);
      setMessages((prev) => [...prev, assistantMessage]);
      
      onSessionUpdate?.();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Select or create a session to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatMessages messages={messages} loading={loading} />
      <ChatInput onSendMessage={handleSendMessage} disabled={!session} loading={loading} />
    </div>
  );
}
