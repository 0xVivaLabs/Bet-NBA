import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { optimismSepolia } from 'wagmi/chains'

// Get projectId at https://cloud.walletconnect.com
export const projectId = '4ba6756adca662307def0899adf1b9ff'

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Bet NBA',
  description: 'Bet NBA',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [optimismSepolia] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  // ...wagmiOptions // Optional - Override createConfig parameters
})
