'use client';
import { onChatBot, onGetCurrentChatBot } from '@/actions/bot';
import { postToParent } from '@/lib/utils';
import { ChatBotMessageProps, ChatBotMessageSchema } from '@/schemas/conversation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { UploadClient } from '@uploadcare/upload-client';
import { useForm } from 'react-hook-form';

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  link?: string;
}

export interface ChatBotResponse {
  response?: ChatMessage;
  chatRoom?: string;
}

const upload = new UploadClient({
  publicKey: process.env.UPLOAD_CARE_PUBLIC_KEY as string,
});

export const useChatBot = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatBotMessageProps>({
    resolver: zodResolver(ChatBotMessageSchema),
  });

  const [currentBot, setCurrentBot] = useState<any>(undefined);
  const messageWindowRef = useRef<HTMLDivElement | null>(null);
  const [botOpened, setBotOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [onChats, setOnChats] = useState<ChatMessage[]>([]);
  const [onAiTyping, setOnAiTyping] = useState<boolean>(false);
  const [currentBotId, setCurrentBotId] = useState<string>();
  const [inputValue, setInputValue] = useState('');

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({ top: messageWindowRef.current.scrollHeight, left: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    onScrollToBottom();
  }, [onChats]);

  useEffect(() => {
    postToParent(JSON.stringify({ width: botOpened ? 450 : 80, height: botOpened ? 700 : 80 }));
  }, [botOpened]);

  const onGetChatBot = async (id: string) => {
    setCurrentBotId(id);
    const chatbot = await onGetCurrentChatBot(id);
    if (chatbot) {
      setOnChats([{ role: 'assistant', content: 'Hi there' }]);
      setCurrentBot(chatbot);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener('message', (e) => {
      const botId = e.data;
      if (typeof botId === 'string') {
        onGetChatBot(botId);
      }
    });
  }, []);

  const onStartChatting = handleSubmit(async (values) => {
    if (values.image?.length) {
      const uploaded = await upload.uploadFile(values.image[0]);
      const userMessage: ChatMessage = {
        role: 'user',
        content: uploaded.uuid,
      };
      setOnChats(prev => [...prev, userMessage]);
      setOnAiTyping(true);

      const response: ChatBotResponse = await onChatBot(currentBotId!, onChats, 'user', uploaded.uuid);

      if (response?.response) {
        setOnAiTyping(false);
        setOnChats(prev => [...prev, response.response as ChatMessage]);
      }
    }

    reset();

    if (values.content) {
      const userMessage: ChatMessage = {
        role: 'user',
        content: values.content,
      };
      setOnChats(prev => [...prev, userMessage]);
      setOnAiTyping(true);

      const response: ChatBotResponse = await onChatBot(currentBotId!, onChats, 'user', values.content);

      if (response?.response) {
        setOnAiTyping(false);
        setOnChats(prev => [...prev, response.response as ChatMessage]);
      }
    }
  });

  return {
    botOpened,
    onOpenChatBot: () => setBotOpened(prev => !prev),
    onStartChatting,
    onChats,
    register,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    setOnChats,
    errors,
    inputValue,
    setInputValue,
  };
};