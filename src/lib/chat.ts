import { supabase } from '@/integrations/supabase/client';

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const RAG_WEBHOOK_URL = 'https://unlatticed-lavone-uncomputably.ngrok-free.dev/webhook/bc3934df-8d10-48df-9960-f0db1e806328';

export async function getChatSessions(userId: string): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createChatSession(userId: string, title?: string): Promise<ChatSession> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
      title: title || 'New Career Session',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateChatSessionTitle(sessionId: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) throw error;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('chat_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) throw error;
}

export async function getMessages(sessionId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Message[];
}

export async function saveMessage(
  sessionId: string,
  userId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      session_id: sessionId,
      user_id: userId,
      role,
      content,
    })
    .select()
    .single();

  if (error) throw error;
  
  // Update session's updated_at timestamp
  await supabase
    .from('chat_sessions')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  return data as Message;
}

export async function sendMessageToRAG(
  message: string,
  userId: string,
  sessionId: string
): Promise<string> {
  try {
    const response = await fetch(RAG_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        user_id: userId,
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`RAG API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (typeof data === 'string') {
      return data;
    }
    if (data.response) {
      return data.response;
    }
    if (data.message) {
      return data.message;
    }
    if (data.output) {
      return data.output;
    }
    
    return JSON.stringify(data);
  } catch (error) {
    console.error('Error calling RAG webhook:', error);
    throw new Error('Failed to get response from career assistant. Please try again.');
  }
}
