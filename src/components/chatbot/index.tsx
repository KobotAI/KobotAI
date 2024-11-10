'use client'
import { useChatBot } from '@/hooks/chatbot/use-chatbot'
import React from 'react'
import { BotWindow } from './window'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { BotIcon } from '@/icons/bot-icon'
import { ChevronDown } from 'lucide-react'

type Props = {}

const AIBot = (props: Props) => {
  const {
    onOpenChatBot,
    botOpened,
    onChats,
    register,
    onStartChatting,
    onAiTyping,
    messageWindowRef,
    currentBot,
    loading,
    setOnChats,
    errors,
    inputValue,
    setInputValue,
  } = useChatBot()

  const handleSubmit = () => {
    onStartChatting();
    setInputValue('');
  };

  return (
    <div className="h-screen flex flex-col justify-end items-end gap-4 pb-4 pr-4">
      {botOpened && (
        <BotWindow
          errors={errors}
          setChat={setOnChats}
          helpdesk={currentBot?.helpdesk!}
          domainName={currentBot?.name!}
          ref={messageWindowRef}
          help={currentBot?.chatBot?.helpdesk}
          theme={currentBot?.chatBot?.background}
          textColor={currentBot?.chatBot?.textColor}
          chats={onChats}
          register={register}
          onChat={handleSubmit}
          onResponding={onAiTyping}
          onClose={onOpenChatBot}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      )}
      <div className="relative z-50">
        <div
          className={cn(
            'rounded-full cursor-pointer shadow-lg flex items-center justify-center bg-emerald-300 transition-all duration-300',
            loading ? 'invisible' : 'visible',
            botOpened ? 'w-10 h-10 hover:w-16 hover:h-16' : 'w-16 h-16'
          )}
          onClick={onOpenChatBot}
        >
          {botOpened ? (
            <ChevronDown className={cn(
              'text-white transition-all duration-300',
              botOpened ? 'w-6 h-6 hover:w-8 hover:h-8' : 'w-8 h-8'
            )} />
          ) : currentBot?.chatBot?.icon ? (
            <Image
              src={`https://ucarecdn.com/${currentBot.chatBot.icon}/`}
              alt="bot"
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <BotIcon />
          )}
        </div>
      </div>
    </div>
  )
}

export default AIBot
