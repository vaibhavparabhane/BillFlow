import type { Metadata } from 'next'
import AppThemeProvider from '@/components/common/AppThemeProvider'

export const metadata: Metadata = {
  title: 'BillOps',
  description: 'Smart billing and invoicing for Indian businesses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  )
}
