import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const Responding = () => {
  return (
    <div className="self-start flex items-end gap-3 mb-4">
      <Avatar className="w-8 h-8">
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="AI Assistant"
        />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <div className="p-3 rounded-2xl rounded-tl-sm shadow-md">
        <div className="typing">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  )
}
