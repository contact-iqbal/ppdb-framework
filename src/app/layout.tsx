import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PPDB - SMK Antartika 2 Sidoarjo',
  description: 'Portal Penerimaan Peserta Didik Baru SMK Antartika 2 Sidoarjo',
  icons: {
    icon: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <Script src="https://kit.fontawesome.com/e1288edb06.js" crossOrigin="anonymous" />
        <Script src="https://cdn.jsdelivr.net/npm/sweetalert2@11" />
        <Script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" />
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}