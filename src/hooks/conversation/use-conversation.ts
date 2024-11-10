import {
  onGetChatMessages,
  onGetAllChatRooms,
  onOwnerSendMessage,
  onRealTimeChat,
  onViewUnReadMessages,
} from '@/actions/conversation'
import { useChatContext } from '@/context/user-chat-context'
import { getMonthName, pusherClient } from '@/lib/utils'
import { ChatBotMessageSchema, ConversationSearchSchema } from '@/schemas/conversation.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

// useConversation hook
export const useConversation = () => {
  const { register, watch } = useForm({
    resolver: zodResolver(ConversationSearchSchema),
    mode: 'onChange',
  })
  const { setLoading: loadMessages, setChats, setChatRoom } = useChatContext()
  const [chatRooms, setChatRooms] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchAllChatRooms = async () => {
      setLoading(true)
      try {
        const rooms = await onGetAllChatRooms()
        if (rooms) {
          setChatRooms(rooms)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllChatRooms()
  }, [])

  const onGetActiveChatMessages = async (id: string) => {
    try {
      loadMessages(true)
      const messages = await onGetChatMessages(id)
      if (messages) {
        setChatRoom(id)
        loadMessages(false)
        setChats(messages[0].message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    register,
    chatRooms,
    loading,
    onGetActiveChatMessages,
  }
}

export const useChatTime = (createdAt: Date, roomId: string) => {
  const { chatRoom } = useChatContext()
  const [messageSentAt, setMessageSentAt] = useState<string>()
  const [urgent, setUrgent] = useState<boolean>(false)

  const onSetMessageReceivedDate = () => {
    const dt = new Date(createdAt)
    const current = new Date()
    const currentDate = current.getDate()
    const hr = dt.getHours()
    const min = dt.getMinutes()
    const date = dt.getDate()
    const month = dt.getMonth()
    const difference = currentDate - date

    if (difference <= 0) {
      setMessageSentAt(`${hr}:${min}${hr > 12 ? 'PM' : 'AM'}`)
      if (current.getHours() - dt.getHours() < 2) {
        setUrgent(true)
      }
    } else {
      setMessageSentAt(`${date} ${getMonthName(month)}`)
    }
  }

  const onSeenChat = async () => {
    if (chatRoom === roomId && urgent) {
      await onViewUnReadMessages(roomId) // Ensure this function is defined in your actions
      setUrgent(false)
    }
  }

  useEffect(() => {
    onSeenChat()
  }, [chatRoom])

  useEffect(() => {
    onSetMessageReceivedDate()
  }, [])

  return { messageSentAt, urgent, onSeenChat }
}

// useChatWindow hook
export const useChatWindow = () => {
  const { chats, loading, setChats, chatRoom } = useChatContext()
  const messageWindowRef = useRef<HTMLDivElement | null>(null)
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ChatBotMessageSchema),
    mode: 'onChange',
  })

  const onScrollToBottom = () => {
    messageWindowRef.current?.scroll({
      top: messageWindowRef.current.scrollHeight,
      left: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    onScrollToBottom()
  }, [chats])

  useEffect(() => {
    if (chatRoom) {
      pusherClient.subscribe(chatRoom)
      pusherClient.bind('realtime-mode', (data: any) => {
        setChats((prev) => [...prev, data.chat])
      })

      return () => {
        pusherClient.unbind('realtime-mode')
        pusherClient.unsubscribe(chatRoom)
      }
    }
  }, [chatRoom])

  const onHandleSentMessage = handleSubmit(async (values) => {
    try {
      reset()
      const message = await onOwnerSendMessage(chatRoom!, values.content, 'assistant')
      if (message) {
        await onRealTimeChat(chatRoom!, message.message[0].message, message.message[0].id, 'assistant')
      }
    } catch (error) {
      console.log(error)
    }
  })

  return {
    messageWindowRef,
    register,
    onHandleSentMessage,
    chats,
    loading,
    chatRoom,
  }
}