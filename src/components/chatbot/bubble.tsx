import React from 'react'
import { cn, extractUUIDFromString, getMonthName } from '@/lib/utils'
import { adjustColor } from '@/lib/color'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  message: {
    role: 'assistant' | 'user'
    content: string
    link?: string
  }
  createdAt?: Date
  textColor?: string
  backgroundColor?: string
}

const Bubble = ({ message, createdAt, textColor, backgroundColor }: Props) => {
  let d = new Date()
  const image = extractUUIDFromString(message.content)

  // Adjust colors for better visibility
  const bubbleColor = message.role === 'assistant' 
  ? adjustColor(backgroundColor || '#FFFFFF', -30) // Slightly darker than background for AI
  : adjustColor(backgroundColor || '#FFFFFF', 10); // Slightly lighter than background for user

  const bubbleTextColor = adjustColor(textColor || '#000000', message.role === 'assistant' ? 20 : -20);
  const timeColor = adjustColor(bubbleTextColor, -50) // Even lighter/darker for time

  return (
    <div
      className={cn(
        'flex gap-3 items-end mb-4',
        message.role === 'assistant' ? 'self-start' : 'self-end flex-row-reverse'
      )}
    >
      {message.role === 'assistant' && (
        <Avatar className="w-8 h-8 mb-2">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="AI Assistant"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'flex flex-col gap-2 p-4 rounded-2xl shadow-md',
          message.role === 'assistant'
            ? 'rounded-bl-sm'
            : 'rounded-br-sm',
          message.content.length < 20 ? 'min-w-[100px]' : 'max-w-[70%]'
        )}
        style={{
          backgroundColor: bubbleColor,
          color: bubbleTextColor,
        }}
      >
        {image ? (
          <div className="relative aspect-square rounded-lg overflow-hidden">
            <Image
              src={`https://ucarecdn.com/${image[0]}/`}
              fill
              alt="Uploaded image"
              className="object-cover"
            />
          </div>
        ) : (
          <p className="text-sm leading-relaxed">{message.content.replace('(complete)', ' ')}</p>
        )}
        {message.link && (
          <Link
            className="text-sm font-medium underline mt-2 inline-block"
            href={message.link}
            target="_blank"
            style={{ color: adjustColor(bubbleTextColor, -40) }}
          >
            More Information
          </Link>
        )}
        <p className="text-xs mt-1 self-end" style={{ color: timeColor }}>
          {createdAt ? (
            <>
              {createdAt.getDate()} {getMonthName(createdAt.getMonth())},{' '}
              {createdAt.getHours()}:{createdAt.getMinutes().toString().padStart(2, '0')}
              {createdAt.getHours() >= 12 ? 'PM' : 'AM'}
            </>
          ) : (
            `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')} ${
              d.getHours() >= 12 ? 'PM' : 'AM'
            }`
          )}
        </p>
      </div>
    </div>
  )
}

export default Bubble
