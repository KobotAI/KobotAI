'use client'
import useSideBar from '@/context/use-sidebar'
import { cn } from '@/lib/utils'
import React from 'react'
import { MinMenu } from './minimized-menu'
import MaxMenu from './maximized-menu'

type Props = {
  domains:
    | {
        id: string
        name: string
        icon: string
      }[]
    | null
    | undefined
}

const SideBar = () => {
  const { expand, onExpand, page } = useSideBar()

  return (
    <>
      <div
        className={cn(
          'bg-cream dark:bg-neutral-950 h-full w-[60px] fill-mode-forwards fixed md:relative z-40',
          expand == undefined && '',
          expand == true
            ? 'animate-open-sidebar'
            : expand == false && 'animate-close-sidebar'
        )}
      >
        <MinMenu
          onShrink={onExpand}
          current={page!}
        />
      </div>
      {expand && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="w-64">
            <MaxMenu
              current={page!}
              onExpand={onExpand}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default SideBar
