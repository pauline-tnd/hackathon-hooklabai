'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import UIBackground from './components/UIBackground';
import WalletConnect from './components/WalletConnect';

export default function Home() {
  const { isConnected, address } = useAccount();
  const [prompt, setPrompt] = useState('');
  const [credits, setCredits] = useState(5);

  // Suggestions untuk setelah connect
  const suggestions = [
    'Holiday',
    'Travel',
    'Business',
    'Tech',
    'Lifestyle',
    'Finance',
    'Health'
  ];

  // Handler untuk submit prompt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    console.log('Prompt:', prompt);
    // TODO: Call API untuk generate hooks
    setPrompt('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black">
      <div className="relative w-full max-w-[400px] min-h-screen md:h-[844px] bg-[#0A0A0A] overflow-hidden shadow-2xl flex flex-col">
        
        <UIBackground />

        <div className="relative z-10 flex-1 flex flex-col h-full">
          
          {/* CONDITIONAL RENDERING BERDASARKAN WALLET STATUS */}
          
          {!isConnected ? (
            // ========================================
            // HALAMAN 1: SEBELUM CONNECT WALLET
            // ========================================
            <>
              {/* Tengah - Pesan Connect Wallet */}
              <div className="flex-1 flex flex-col items-center justify-center px-6">
                <p className="text-white/60 text-sm mb-3 font-medium tracking-wide">
                  AI assistant
                </p>
                <h1 className="text-white text-3xl font-bold text-center leading-snug font-poppins">
                  Please Connect <br />
                  Wallet, First !
                </h1>
              </div>

              {/* Bawah - Card dengan Tombol Connect */}
              <div className="relative z-20 w-full px-4 pb-12 mt-auto">
                <div className="w-full bg-white rounded-[20px] p-5 shadow-lg min-h-[140px] flex flex-col justify-between">
                  <p className="text-black/40 text-xs font-bold tracking-wide mb-4">
                    What do you want to post about?
                  </p>
                  
                  <div className="flex items-center">
                    <WalletConnect isConnected={false} />
                  </div>
                </div>
                
                {/* Bottom Indicator */}
                <div className="w-full flex justify-center mt-8">
                  <div className="w-[130px] h-[5px] bg-white/20 rounded-full" />
                </div>
              </div>
            </>
          ) : (
            // ========================================
            // HALAMAN 2: SETELAH CONNECT WALLET
            // ========================================
            <>
              {/* Header dengan Logo */}
              <div className="pt-12 px-6 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-xl font-poppins tracking-wide">
                  HookLab AI
                </span>
              </div>

              {/* Tengah - Greeting & Suggestions */}
              <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-10">
                <p className="text-white/60 text-sm mb-2 font-medium tracking-wide">
                  AI assistant
                </p>
                <h1 className="text-white text-2xl font-bold text-center leading-snug font-poppins mb-8">
                  Hello Chaterin, <br />
                  How can i help you today ?
                </h1>
                
                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2 justify-center max-w-[320px]">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="px-5 py-2 bg-white rounded-full text-black text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bawah - Card dengan Input & Credits */}
              <div className="relative z-20 w-full px-4 pb-12 mt-auto">
                <div className="w-full bg-white rounded-[20px] p-5 shadow-lg">
                  <p className="text-black/40 text-xs font-bold tracking-wide mb-3">
                    What do you want to post about?
                  </p>
                  
                  {/* Input Area */}
                  <form onSubmit={handleSubmit} className="mb-3">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Type your prompt here..."
                      className="w-full h-20 resize-none border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    />
                  </form>

                  {/* Bottom Actions */}
                  <div className="flex items-center gap-3">
                    <WalletConnect isConnected={true} />
                    
                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full">
                      <span className="text-sm font-bold text-gray-700">
                        Credits: {credits}/5
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Indicator */}
                <div className="w-full flex justify-center mt-8">
                  <div className="w-[130px] h-[5px] bg-white/20 rounded-full" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}