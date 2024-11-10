'use client'
import { useChatWindow } from '@/hooks/conversation/use-conversation'
import React from 'react'
import { Loader } from '../loader'
import Bubble from '../chatbot/bubble'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { PaperclipIcon, SendIcon } from 'lucide-react'

type Props = {}

const Messenger = (props: Props) => {
  const {
    messageWindowRef,
    chats,
    loading,
    chatRoom,
    onHandleSentMessage,
    register,
  } = useChatWindow()

  return (
    <div className="flex-1 flex flex-col h-0 relative">
      <div className="flex-1 h-0 w-full flex flex-col">
        <Loader loading={loading}>
          <div
            ref={messageWindowRef}
            className="h-full overflow-y-auto px-4 py-6 space-y-4"
          >
            {chats.length ? (
              chats.map((chat: any) => (
                <Bubble
                  key={chat.id}
                  message={{
                    role: chat.role!,
                    content: chat.message,
                  }}
                  createdAt={chat.createdAt}
                />
              ))
            ) : (
              <div className="text-center text-muted-foreground">
                No messages yet
              </div>
            )}
          </div>
        </Loader>
      </div>

      {/* Input area */}
      <form
        onSubmit={onHandleSentMessage}
        className="p-4 border-t bg-background"
      >
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Input
            {...register('content')}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!chatRoom}
            size="icon"
          >
            <SendIcon className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Messenger
