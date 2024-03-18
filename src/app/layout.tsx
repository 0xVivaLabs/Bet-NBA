import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './(components)/Providers'
import { Nav } from '@/app/(components)/Nav'
import { headers } from 'next/headers'

import { cookieToInitialState } from 'wagmi'
import { config } from '@/config'
import Web3ModalProvider from '@/context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bet NBA',
  description: 'Bet NBA by polymer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Web3ModalProvider initialState={initialState}>
            <main className={'dark text-foreground bg-background'}>
              <Nav />
              {children}
            </main>
          </Web3ModalProvider>
        </Providers>
      </body>
    </html>
  )
}
