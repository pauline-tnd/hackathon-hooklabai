'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { base } from 'wagmi/chains';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { coinbaseWallet, injected } from 'wagmi/connectors';
import { useState, type ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const [config] = useState(() =>
    createConfig({
      chains: [base],
      connectors: [
        injected(), // Metamask - harus di atas
        coinbaseWallet({
          appName: 'HookLab AI',
          appLogoUrl: undefined,
        }),
      ],
      ssr: false,
      transports: {
        [base.id]: http(),
      },
    })
  );

  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}