'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

type WalletConnectProps = {
  isConnected?: boolean;
  showModal?: boolean;
};

export default function WalletConnect({ isConnected, showModal = false }: WalletConnectProps) {
  const [showWalletModal, setShowWalletModal] = useState(showModal);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { connect, connectors, isPending } = useConnect();
  const { isConnected: accountConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // Check if Metamask is installed (computed on render)
  const hasMetamask = typeof window !== 'undefined' &&
    typeof window.ethereum !== 'undefined' &&
    window.ethereum?.isMetaMask === true;

  // Debug: Log available connectors
  useEffect(() => {
    console.log('Metamask Detection:', {
      hasEthereum: typeof window !== 'undefined' && typeof window.ethereum !== 'undefined',
      isMetaMask: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
      ethereum: typeof window !== 'undefined' ? window.ethereum : undefined
    });

    console.log('Available connectors:', connectors.map(c => ({
      id: c.id,
      name: c.name,
      type: c.type,
      ready: c.ready
    })));

    
  }, [connectors]);

  const handleConnectMetamask = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Check if Metamask is installed
      if (typeof window.ethereum === 'undefined' || !window.ethereum.isMetaMask) {
        setError('MetaMask is not installed! Please install MetaMask extension.');
        setIsConnecting(false);
        // Redirect to Metamask download
        setTimeout(() => {
          window.open('https://metamask.io/download/', '_blank');
        }, 2000);
        return;
      }

      // Find injected connector (Metamask)
      const metamaskConnector = connectors.find(c => c.type === 'injected' || c.id.includes('injected'));

      console.log('Attempting Metamask connection with connector:', metamaskConnector);

      if (!metamaskConnector) {
        setError('MetaMask connector not found. Please refresh the page.');
        setIsConnecting(false);
        return;
      }

      // Connect to Metamask
      await connect({ connector: metamaskConnector });
      setShowWalletModal(false);
      setIsConnecting(false);
    } catch (err) {
      console.error('Metamask connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to MetaMask';
      setError(errorMessage);
      setIsConnecting(false);
    }
  };

  const handleConnectCoinbase = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // Find Coinbase connector
      const coinbaseConnector = connectors.find(c =>
        c.type === 'coinbaseWallet' ||
        c.id.includes('coinbase')
      );

      console.log('Attempting Coinbase connection with connector:', coinbaseConnector);

      if (!coinbaseConnector) {
        setError('Coinbase Wallet connector not found');
        setIsConnecting(false);
        return;
      }

      await connect({ connector: coinbaseConnector });
      setShowWalletModal(false);
      setIsConnecting(false);
    } catch (err) {
      console.error('Coinbase connection error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Coinbase Wallet';
      setError(errorMessage);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowWalletModal(false);
  };

  // Jika sudah connected
  if (accountConnected) {
    return (
      <>
        {/* ADDRESS BUTTON (TRIGGER SAJA) */}
        <button
          onClick={() => setShowWalletModal(true)}
          className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all shadow-lg hover:shadow-green-500/10"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          <span className="text-white text-sm font-bold tracking-wide">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </button>

        {/* DISCONNECT POPUP - FIXED MODAL */}
        {showWalletModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div 
               className="relative bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-[320px] shadow-2xl flex flex-col gap-4 animate-in zoom-in-95 duration-200"
               onClick={(e) => e.stopPropagation()}
            >
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                   Wallet Connected
                </h3>
                <button
                  onClick={() => setShowWalletModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Address Card */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-inner">
                    {address?.substring(2, 4).toUpperCase()}
                 </div>
                 <div className="text-center">
                    <p className="text-xs text-white/40 mb-1 font-medium tracking-wider">WALLET ADDRESS</p>
                    <p className="text-sm font-mono text-white/90 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 cursor-pointer hover:bg-black/60 transition-colors"
                       onClick={() => {
                          navigator.clipboard.writeText(address || '');
                       }}
                       title="Copy Address"
                    >
                      {address?.slice(0, 6)}...{address?.slice(-6)}
                      <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </p>
                 </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                 <button
                    onClick={() => setShowWalletModal(false)}
                    className="py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl font-medium transition-colors text-sm"
                 >
                    Close
                 </button>
                 <button
                    onClick={() => {
                      disconnect();
                      setShowWalletModal(false);
                    }}
                    className="py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2"
                 >
                    Disconnect
                 </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  

  // Jika belum connected
  return (
    <>
      <button
        onClick={() => setShowWalletModal(true)}
        disabled={isConnecting}
        className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
      >
        <div className="w-2 h-2 rounded-full shrink-0 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] group-hover:bg-red-400 transition-colors" />
        <span className="text-white text-sm font-bold group-hover:text-white/90 tracking-wide">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </span>
      </button>

      {/* Modal Pilihan Wallet */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-[340px] shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white font-poppins flex items-center gap-2">
                Connect Wallet
              </h3>
              <button
                onClick={() => {
                  setShowWalletModal(false);
                  setError(null);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Metamask Status Indicator */}
            {!hasMetamask && (
              <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3">
                 <div className="p-1.5 bg-orange-500/20 rounded-full shrink-0">
                    <svg className="w-4 h-4 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                 </div>
                 <div>
                    <p className="text-sm text-orange-400 font-bold">MetaMask not detected</p>
                    <p className="text-xs text-orange-400/70">Please install extension first</p>
                 </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                 <div className="mt-0.5 p-1 bg-red-500/20 rounded-full shrink-0">
                    <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                 </div>
                 <p className="text-xs text-red-400 leading-relaxed">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {/* Tombol Metamask */}
              <button
                onClick={handleConnectMetamask}
                disabled={isConnecting}
                className={`group relative w-full flex items-center gap-4 p-4 rounded-xl transition-all border disabled:opacity-50 overflow-hidden ${hasMetamask
                  ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 cursor-pointer'
                  : 'bg-white/5 border-white/5 opacity-50 cursor-not-allowed'
                  }`}
              >
                {/* Hover Gradient */}
                {hasMetamask && <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />}
                
                <div className="relative w-10 h-10 bg-[#161616] rounded-xl flex items-center justify-center shrink-0 border border-white/10 shadow-sm group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-orange-500" viewBox="0 0 40 40" fill="currentColor">
                    <path d="M32.5 5L20 14.5 22.5 9.5 32.5 5z" />
                    <path d="M7.5 5L20 14.5 17.5 9.5 7.5 5z" />
                    <path d="M27.5 29L25 33.5 32 35.5 34 29 27.5 29z" />
                    <path d="M6 29L8 35.5 15 33.5 12.5 29 6 29z" />
                  </svg>
                </div>
                <div className="relative flex-1 text-left">
                  <p className="font-bold text-white group-hover:text-orange-400 transition-colors">MetaMask</p>
                  <p className="text-xs text-white/40">
                    {hasMetamask ? 'Connect to MetaMask' : 'Not installed'}
                  </p>
                </div>
                {hasMetamask && (
                  <div className="relative w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                )}
              </button>

              {/* Tombol Coinbase */}
              <button
                onClick={handleConnectCoinbase}
                disabled={isConnecting}
                className="group relative w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-white/20 disabled:opacity-50 overflow-hidden"
              >
                 {/* Hover Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative w-10 h-10 bg-[#0052FF] rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 28 28" fill="currentColor">
                     <path d="M14 4C8.5 4 4 8.5 4 14s4.5 10 10 10 10-4.5 10-10S19.5 4 14 4zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="white" />
                     <path d="M11 13h6v2h-6z" fill="white" />
                  </svg>
                </div>
                <div className="relative flex-1 text-left">
                  <p className="font-bold text-white group-hover:text-blue-400 transition-colors">Coinbase Wallet</p>
                  <p className="text-xs text-white/40">Connect to Coinbase</p>
                </div>
              </button>
            </div>

            {isConnecting && (
              <div className="mt-6 flex flex-col items-center animate-fade-in">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-sm text-white/60">Connecting to provider...</p>
              </div>
            )}

            <p className="text-[10px] text-white/20 text-center mt-6">
              By connecting, you agree to our Terms of Service
            </p>
          </div>
        </div>
      )}
    </>
  );
}