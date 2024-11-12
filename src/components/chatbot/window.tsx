'use client';
import { ChatBotMessageProps } from '@/schemas/conversation.schema'
import React, { forwardRef } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import TabsMenu from '../tabs'
import { BOT_TABS_MENU } from '@/constants/menu'
import { TabsContent } from '../ui/tabs'
import { Separator } from '../ui/separator'
import Bubble from './bubble'
import { Responding } from './responding'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Paperclip, Send, X } from 'lucide-react'
import { Label } from '../ui/label'
import { CardDescription, CardTitle } from '../ui/card'
import Accordion from '../accordian'
import { adjustColor } from '@/lib/color'

type Props = {
  errors: any
  register: UseFormRegister<ChatBotMessageProps>
  chats: { role: 'assistant' | 'user'; content: string; link?: string }[]
  onChat: (event: React.FormEvent<HTMLFormElement>) => void
  onResponding: boolean
  domainName: string
  theme?: string | null
  textColor?: string | null
  help?: boolean
  helpdesk: {
    id: string
    question: string
    answer: string
    domainId: string | null
  }[]
  setChat: React.Dispatch<
    React.SetStateAction<
      {
        role: 'user' | 'assistant'
        content: string
        link?: string | undefined
      }[]
    >
  >
  onClose: () => void
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

export const BotWindow = forwardRef<HTMLDivElement, Props>(
  (
    {
      errors,
      register,
      chats,
      onChat,
      onResponding,
      domainName,
      helpdesk,
      setChat,
      textColor,
      theme,
      help,
      onClose,
      inputValue,
      setInputValue,
    },
    ref
  ) => {
    // Calculate adjusted colors
    const adjustedBackgroundColor = adjustColor(theme || '#000000', -10);
    const adjustedTextColor = adjustColor(textColor || '#FFFFFF', 20);

    const lightBackgroundColor = adjustColor(theme || '#000000', 220); // Adjust the 80 value as needed for desired lightness

    return (
      <div className="fixed bottom-4 right-4 z-50 w-full max-w-[420px] h-[85vh] max-h-[650px] flex flex-col rounded-3xl shadow-xl border border-gray-300 overflow-hidden">
        
        {/* Header */}
        <div 
          className="flex justify-between px-5 py-4 items-center rounded-t-3xl shadow-lg"
          style={{
            backgroundColor: theme || '#000000',
            color: textColor || '#FFFFFF',
          }}
        >
          <div className="flex items-center gap-3">
            <Avatar className="w-14 h-14">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-tight">
              <h3 className="text-xl font-bold">John Doe</h3>
              <span className="text-sm opacity-80">{domainName.split('.com')[0]}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
            style={{ color: textColor || '#FFFFFF' }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Tabs */}
        <div 
          className="flex flex-col h-full"
          style={{
            backgroundColor: lightBackgroundColor,
            color: '#000000', // Changed to black as default
          }}
        > 
          <TabsMenu 
            triggers={BOT_TABS_MENU} 
            className="bg-transparent border-none m-2"
          >
          
          {/* Chat Tab */}
          <TabsContent value="chat">
            <Separator orientation="horizontal" />
            <div className="flex flex-col h-full">

              {/* Chat Messages */}
              <div
                className="px-4 flex h-[55vh] max-h-[350px] flex-col py-4 gap-3 chat-window overflow-y-auto"
                ref={ref}
              >
                {chats.map((chat, key) => (
                  <Bubble 
                    key={key} 
                    message={chat} 
                    textColor={textColor || '#FFFFFF'}
                    backgroundColor={theme || '#000000'}
                  />
                ))}
                {onResponding && <Responding />}
              </div>
              
              {/* Input Field */}
              <form onSubmit={(e) => { e.preventDefault(); onChat(e); }} className="flex px-3 py-2 items-center bg-gray-100 shadow-inner">
                <div className="relative flex-1">
                  <Input
                    {...register('content')}
                    placeholder="Type your message..."
                    className="focus-visible:ring-0 w-full p-3 pl-4 pr-12 bg-white rounded-full shadow-sm border-none"
                  />
                  <Label htmlFor="bot-image" className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <Paperclip className="w-5 h-5 text-gray-400 hover:text-black" />
                    <Input
                      {...register('image')}
                      type="file"
                      id="bot-image"
                      className="hidden"
                    />
                  </Label>
                </div>
                <Button 
                  type="submit" 
                  className="ml-2 p-2 rounded-full"
                  style={{
                    backgroundColor: theme || '#000000',
                    color: textColor || '#FFFFFF',
                  }}
                >
                  <Send className="w-6 h-6" />
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* Help Desk Tab */}
          <TabsContent value="helpdesk">
            <div 
              className="h-[55vh] max-h-[485px] overflow-y-auto p-5 flex flex-col gap-4"
              style={{
                backgroundColor: adjustedBackgroundColor,
                color: adjustedTextColor,
              }}
            >
              <div>
                <CardTitle className="text-xl" style={{ color: adjustedTextColor }}>Help Desk</CardTitle>
                <CardDescription style={{ color: adjustColor(adjustedTextColor, -20) }}>
                  Browse a list of frequently asked questions.
                </CardDescription>
              </div>
              <Separator orientation="horizontal" />
              {helpdesk.map((desk) => (
                <Accordion 
                  key={desk.id} 
                  trigger={desk.question} 
                  content={desk.answer} 
                />
              ))}
            </div>
          </TabsContent>
          </TabsMenu>
        </div>

        {/* Footer */}
        <div className="flex justify-center py-3 bg-gray-50">
          <a href="https://kobot.ai" target="_blank" rel="noopener noreferrer" className="text-black-bold text-xs font-bold">Powered by Kobot AI</a>
        </div>
      </div>
    )
  }
)

BotWindow.displayName = 'BotWindow'
