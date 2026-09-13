import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Public Search Desk',
  description: 'Search and organize publicly available web information.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>
}
