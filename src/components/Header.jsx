import React from 'react'
import ThemeToggle from './ThemeToggle'

export default function Header({ header }) {
  return (
    <div className='h-12 bg-slate-800 dark:bg-neutral-800 dark:border-neutral-800 border-b border-slate-700 p-2 flex items-center justify-between shadow-sm'>
      <span className='font-bold text-2xl text-slate-100'>{header}</span>
      <ThemeToggle />
    </div>
  )
}