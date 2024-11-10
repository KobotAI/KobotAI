import ConversationMenu from '@/components/conversations'
import Messenger from '@/components/conversations/messenger'
import { Separator } from '@/components/ui/separator'
import React from 'react'

type Props = {}

const ConversationPage = async (props: Props) => {
  return (
    <div className="w-full h-full flex">
      <ConversationMenu />

      <Separator orientation="vertical" />
      <div className="w-full flex flex-col">
        <Messenger />
      </div>
    </div>
  )
}

export default ConversationPage