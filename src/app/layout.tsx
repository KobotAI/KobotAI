import type { Metadata } from 'next'
import { Comfortaa } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/context/theme-provider'

const comfortaa = Comfortaa({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kobot AI',
  description: 'Kobot AI - The easiest way to deploy AI chatbots',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
        <body className={comfortaa.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
  )
}