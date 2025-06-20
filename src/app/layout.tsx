import type { Metadata } from 'next'
import './globals.css'
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'

export const metadata: Metadata = {
  title: 'TaskFlow - Task Management App',
  description: 'Manage your tasks efficiently with our intuitive kanban board system.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased theme-transition">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  )
}