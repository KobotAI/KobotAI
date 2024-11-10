'use client'
import { useConversation } from '@/hooks/conversation/use-conversation'
import React from 'react'
import TabsMenu from '../tabs/index'
import { TABS_MENU } from '@/constants/menu'
import { TabsContent } from '../ui/tabs'
import { Loader } from '../loader'
import ChatCard from './chat-card'
import { CardDescription } from '../ui/card'
import { Separator } from '../ui/separator'

const ConversationMenu = () => {
  const { register, chatRooms, loading, onGetActiveChatMessages } = useConversation()

  return (
    <div className="flex flex-col h-full border-r">
      {/* Header */}
      <div className="p-4 bg-muted">
        <h2 className="text-lg font-semibold">Conversations</h2>
      </div>

      <TabsMenu triggers={TABS_MENU}>
        <TabsContent value="general" className="flex-grow overflow-y-auto">
          <Loader loading={loading}>
            {chatRooms.length ? (
              chatRooms.map((room) => (
                <ChatCard
                  seen={room.chatRoom[0].message[0]?.seen}
                  id={room.chatRoom[0].id}
                  onChat={() => onGetActiveChatMessages(room.chatRoom[0].id)}
                  createdAt={room.chatRoom[0].message[0]?.createdAt}
                  key={room.chatRoom[0].id}
                  title={room.email!}
                  description={room.chatRoom[0].message[0]?.message}
                />
              ))
            ) : (
              <CardDescription className="p-4 text-center">No chats</CardDescription>
            )}
          </Loader>
        </TabsContent>
        {/* Other tabs can remain as they are */}
        <TabsContent value="all">
          <Separator orientation="horizontal" className="mt-5" />
          Coming soon
        </TabsContent>
        <TabsContent value="expired">
          <Separator orientation="horizontal" className="mt-5" />
          Coming soon
        </TabsContent>
        <TabsContent value="starred">
          <Separator orientation="horizontal" className="mt-5" />
          Coming soon
        </TabsContent>
      </TabsMenu>
    </div>
  )
}

export default ConversationMenu