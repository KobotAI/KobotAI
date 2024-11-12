'use client';
import { SIDE_BAR_MENU } from '@/constants/menu'
import React from 'react'

import { Menu } from 'lucide-react'
import MenuItem from './menu-item'

type MinMenuProps = {
  onShrink(): void
  current: string
}

export const MinMenu = ({
  onShrink,
  current,
}: MinMenuProps) => {
  return (
    <div className="py-6 px-3 flex flex-col items-center h-full bg-white dark:bg-[#1A1A1A] shadow-lg">
      <div className="mb-8 cursor-pointer transition-transform hover:scale-110">
        <Menu onClick={onShrink} className="w-6 h-6 text-[#4A4A4A] dark:text-[#D1D1D1]" />
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          {SIDE_BAR_MENU.map((menu, key) => (
            <MenuItem
              size="min"
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
