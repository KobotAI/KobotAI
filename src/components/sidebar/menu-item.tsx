import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  size: 'max' | 'min'
  label: string
  icon: JSX.Element
  path?: string
  current?: string
  onSignOut?(): void
}

const MenuItem = ({ size, path, icon, label, current, onSignOut }: Props) => {
  const baseClasses = "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
  const activeClasses = "bg-[#FF6B00] text-white font-medium"
  const inactiveClasses = "text-[#4A4A4A] hover:bg-[#E6E6E6] dark:text-[#D1D1D1] dark:hover:bg-[#2A2A2A]"

  const linkContent = (
    <>
      {React.cloneElement(icon, { className: "w-5 h-5" })}
      {size === 'max' && <span>{label}</span>}
    </>
  )

  return (
    <Link
      onClick={onSignOut}
      className={cn(
        baseClasses,
        current === path ? activeClasses : inactiveClasses,
        size === 'min' && "justify-center"
      )}
      href={path ? `/${path}` : '#'}
      title={size === 'min' ? label : undefined}
    >
      {linkContent}
    </Link>
  )
}

export default MenuItem
