'use client';
import { SIDE_BAR_MENU } from '@/constants/menu'
import { LogOut, ChevronLeft } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import MenuItem from './menu-item'

type Props = {
  onExpand(): void
  current: string
}

const MaxMenu = ({ current, onExpand }: Props) => {
  return (
    <div className="py-6 px-3 flex flex-col h-full bg-white dark:bg-[#1A1A1A] shadow-lg fixed left-0 top-0 bottom-0 w-64 z-50">
      <div className="flex justify-between items-center mb-8 px-1">
        <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Kobot AI Logo"
              width={40}
              height={40}
              className="mr-2 transition-opacity hover:opacity-80"
            />
            <span className="text-xl font-bold text-black">Kobot AI</span>
          </div>
          <ChevronLeft
            className="cursor-pointer text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            onClick={onExpand}
          />
      </div>
      <div className="flex flex-col justify-between h-full overflow-y-auto">
        <div className="space-y-4">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              size="max"
              {...menu}
              key={key}
              current={current}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MaxMenu
