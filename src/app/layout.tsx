import './globals.css'
import type { Metadata } from 'next'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
