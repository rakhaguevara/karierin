import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import ChatContainer from '@/components/chat/ChatContainer';
import {
  type ChatSession,
  getChatSessions,
  createChatSession,
  deleteChatSession,
} from '@/lib/chat';

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user]);

  const loadSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await getChatSessions(user.id);
      setSessions(data);
      
      // Set first session as active if none selected
      if (data.length > 0 && !activeSession) {
        setActiveSession(data[0]);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat sessions.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    if (!user) return;
    
    try {
      const newSession = await createChatSession(user.id);
      setSessions((prev) => [newSession, ...prev]);
      setActiveSession(newSession);
      
      toast({
        title: 'New Session Created',
        description: 'Start a new career conversation!',
      });
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new session.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      
      // If deleted session was active, select another one
      if (activeSession?.id === sessionId) {
        const remaining = sessions.filter((s) => s.id !== sessionId);
        setActiveSession(remaining[0] || null);
      }
      
      toast({
        title: 'Session Deleted',
        description: 'Chat session has been removed.',
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete session.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
    toast({
      title: 'Signed Out',
      description: 'You have been logged out successfully.',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse-soft">
            <span className="text-2xl font-bold text-primary">K</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={setActiveSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-4 lg:px-6 shrink-0">
          <div className="lg:hidden w-10" /> {/* Spacer for mobile menu */}
          <h1 className="text-lg font-semibold text-foreground truncate">
            {activeSession?.title || 'Career Assistant'}
          </h1>
        </header>

        {/* Chat Area */}
        <ChatContainer 
          session={activeSession} 
          onSessionUpdate={loadSessions}
        />
      </main>
    </div>
  );
}
