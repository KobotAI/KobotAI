import SideBar from '@/components/sidebar'
import { ChatProvider } from '@/context/user-chat-context'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const OwnerLayout = async ({ children }: Props) => {
  return (
    <ChatProvider>
      <div className="flex h-screen w-full">
        <SideBar />
        <div className="w-full h-screen flex flex-col pl-20 md:pl-4">
          {children}
        </div>
      </div>
    </ChatProvider>
  )
}

export default OwnerLayout
