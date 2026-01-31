'use client';

// 1. IMPORT WAJIB DI ATAS
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image'; // Added Image import
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';

// Import Components
// import UIBackground from './components/UIBackground'; // Replaced by Silk
import Silk from './components/Silk';
import WalletConnect from './components/WalletConnect';
import NameInputModal from './components/NameInputModal';
import HooksSelection from './components/HookSelection';
import TransactionModal from './components/TransactionModal';
import HookResult from './components/HookResult';
import SplashScreen from './components/SplashScreen';
import HistoryModal from './components/HistoryModal';
import BubbleMenu from './components/BubbleMenu';
import DecryptedText from './components/DecryptedText';

import { TOPIC_PROMPTS, type TopicKey } from './config/topicPrompts';
import { userStorage } from '../utils/userStorage';

type Hook = {
  id: string;
  username: string;
  topic: string;
  content: string;
  preview: string;
};

type AppState = 'initial' | 'selecting' | 'result';

export default function Home() {
  const { isConnected, address } = useAccount();

  const [prompt, setPrompt] = useState('');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [credits, setCredits] = useState(1000);
  const [appState, setAppState] = useState<AppState>('initial');
  const [userName, setUserName] = useState<string>('');

  const [generatedHooks, setGeneratedHooks] = useState<Hook[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const [selectedHook, setSelectedHook] = useState<Hook | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [pendingHook, setPendingHook] = useState<Hook | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // ==========================================
  // LOGIC AI GENERATOR
  // ==========================================
  const handleGenerateHooks = async (promptText: string) => {
    setIsThinking(true);
    const toastId = toast.loading("AI is thinking...", {
      style: { background: '#222', color: '#fff' }
    });

    try {
      console.log("Sending to API:", { category: activeTopic || 'General', userPrompt: promptText });

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeTopic || 'General',
          userPrompt: promptText,
          walletAddress: address
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.hooks && Array.isArray(data.hooks)) {
        const formattedHooks: Hook[] = data.hooks.map((item: any, i: number) => {
          const contentText = typeof item === 'string' ? item : item.hook;

          // Logic Teaser: Ambil 10 kata pertama saja
          const words = contentText.split(/\s+/);
          const previewText = words.length > 10 ? words.slice(0, 10).join(' ') + '...' : contentText;

          return {
            id: `ai-${Date.now()}-${i}`,
            username: userName || 'Creator',
            topic: activeTopic || 'General',
            content: contentText,
            preview: previewText
          };
        });

        setGeneratedHooks(formattedHooks);
        setAppState('selecting');

        toast.dismiss(toastId);
        toast.success("Hooks generated successfully!");
      } else {
        throw new Error("Invalid data format from AI");
      }

    } catch (err) {
      // ✅ FIX: Hapus ': any' dan gunakan casting manual
      const error = err as Error;

      console.error("Generate Error:", error);
      toast.dismiss(toastId);

      // Cek pesan error dengan aman
      const errorMessage = error.message || "Unknown error";

      if (errorMessage.includes("500")) {
        toast.error("Server Error (500). Check API Key or Backend Logs.");
      } else if (errorMessage.includes("Failed to fetch")) {
        toast.error("Connection failed. Is the server running?");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      toast.error("Please enter a topic first!");
      return;
    }
    handleGenerateHooks(prompt);
  };

  // ==========================================
  // DATA USER & STORAGE
  // ==========================================
  useEffect(() => {
    if (!isConnected || !address) {
      setUserName('');
      setCredits(5);
      setIsDataLoaded(false);
      setShowNameModal(false);
      return;
    }
    const userData = userStorage.getUserData(address);
    if (userData && userData.name) {
      setUserName(userData.name);
      setCredits(userData.credits);
      setShowNameModal(false);
    } else {
      setUserName('');
      setCredits(1000);
      setShowNameModal(true);
    }
    setIsDataLoaded(true);
  }, [isConnected, address]);

  const handleNameSubmit = useCallback((name: string) => {
    if (!address) return;
    setUserName(name);
    userStorage.saveUserData(address, { name, credits: 1000 });
    setShowNameModal(false);
    toast.success(`Welcome, ${name}!`);
  }, [address]);

  // ==========================================
  // TRANSAKSI & NAVIGASI
  // ==========================================
  const handleSelectHook = useCallback((hook: Hook) => {
    if (credits <= 0) {
      toast.error("You are out of credits!");
      // return; // Dev mode: allow unlimited
    }
    const updatedHook = { ...hook, username: userName || 'Anonymous' };
    setPendingHook(updatedHook);
    setShowTransactionModal(true);
  }, [userName, credits]);

  const [historyId, setHistoryId] = useState<string | undefined>(undefined);

  const handleTransactionSuccess = useCallback(async () => {
    if (!address) return;
    setShowTransactionModal(false);

    const hasCredits = credits > 0;
    if (hasCredits) {
      const newCredits = Math.max(0, credits - 1);
      setCredits(newCredits);
      userStorage.updateCredits(address, newCredits);
      toast.success("Transaction successful! Credit used.");
    }

    if (pendingHook) {
      // 1. SAVE INITIAL HISTORY (TEXT ONLY)
      try {
        const res = await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                walletAddress: address,
                prompt: pendingHook.content
            })
        });
        const data = await res.json();
        if (data.historyId) {
            setHistoryId(data.historyId);
            console.log("✅ Initial history saved:", data.historyId);
        }
      } catch (e) {
        console.error("Failed to save initial history", e);
      }

      setSelectedHook(pendingHook);
      setAppState('result');
      setPendingHook(null);
    }
  }, [credits, pendingHook, address]);

  const handleTryAnother = useCallback(() => {
    setAppState('initial');
    setSelectedHook(null);
    setPrompt('');
    setActiveTopic(null);
  }, []);

  const handleBack = useCallback(() => {
    setAppState('initial');
    setPrompt('');
  }, []);

  const handleBackToSelection = useCallback(() => {
    setAppState('selecting');
    setSelectedHook(null);
  }, []);

  // ==========================================
  // FETCH CATEGORIES (DYNAMIC)
  // ==========================================
  const [suggestions, setSuggestions] = useState<{ name: string, prompt: string }[]>([
    { name: 'General', prompt: 'Write a viral hook about...' },
    { name: 'Business', prompt: 'Write a contrarian business lesson about...' }
  ]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data.categories && Array.isArray(data.categories)) {
            setSuggestions(data.categories);
          }
        }
      } catch (e) {
        console.error("Failed to fetch categories:", e);
      }
    }
    fetchCategories();
  }, []);

  // ==========================================
  // RENDER UI
  // ==========================================
  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  if (isConnected && !isDataLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading data...</div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen flex flex-col bg-black">
        <div className="relative w-full min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col">
          <div className="absolute inset-0 z-0 pointer-events-none">
               <Silk 
                  speed={5} 
                  scale={0.7} 
                  color="#2800ca" 
                  noiseIntensity={2} 
                  rotation={1.17} 
               />
          </div>
          <div className="relative z-10 flex-1 flex flex-col">
            {!isConnected ? (
              // UI BELUM CONNECT
              <>
                <div className="flex-1 flex flex-col items-center justify-center px-6">
                  <p className="text-white/60 text-sm mb-3 font-medium tracking-wide">HookLab assistant</p>
                  <h1 className="text-white text-3xl font-bold text-center leading-snug font-poppins">
                    Please Connect <br /> Wallet, First !
                  </h1>
                </div>
                {/* FIX TAILWIND CLASS */}
                <div className="relative z-20 w-full px-4 pb-12 mt-auto">
                  <div className="w-full bg-white rounded-[20px] p-5 shadow-lg min-h-35 flex flex-col justify-between">
                    <div className="flex items-center"><WalletConnect isConnected={false} /></div>
                  </div>
                </div>
              </>
            ) : appState === 'selecting' ? (
              // UI PILIH HASIL
              <HooksSelection onSelectHook={handleSelectHook} onBack={handleBack} userName={userName} generatedHooks={generatedHooks} />
            ) : appState === 'result' && selectedHook ? (
              // UI HASIL FINAL
              <HookResult 
                hook={selectedHook} 
                onTryAnother={handleTryAnother} 
                onBack={handleBackToSelection}
                initialHistoryId={historyId}
              />
            ) : (
              // UI UTAMA (INPUT)
              <>
                <div className="pt-10 px-4 w-full max-w-2xl mx-auto flex items-center justify-start gap-4 mb-8 relative z-10">
                  {/* GLASS LOGO - Moved up */}
                  <Image 
                    src="/logo_glassmorp.png" 
                    width={50} 
                    height={50} 
                    alt="HookLab Logo" 
                    className="drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                  <span className="text-white font-bold text-2xl font-poppins tracking-wide drop-shadow-md">HookLab AI</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-20 relative z-0">
                  {/* Removed HookLab assistant pill */}
                  <h1 className="text-white text-2xl md:text-3xl font-bold text-center leading-tight font-poppins mb-8 drop-shadow-2xl">
                    Hello <span className="inline-block text-blue-400">
                        <DecryptedText 
                            text={userName || 'there'} 
                            speed={100}
                            maxIterations={20}
                            useOriginalCharsOnly={true}
                            className="text-blue-400"
                            encryptedClassName="text-blue-400 opacity-50"
                            loop={true}
                            animateOn="view"
                        />
                    </span>, <br /> 
                    <span className="text-xl md:text-2xl font-normal text-gray-300 mt-2 block">How can i help you today ?</span>
                  </h1>
                  
                  {/* Bubble Menu Static Cloud */}
                  <div className="relative w-full max-w-2xl mx-auto px-4 mt-4 z-20">
                      <BubbleMenu
                          items={suggestions.map((s, i) => ({
                              label: s.name,
                              ariaLabel: `Select topic ${s.name}`,
                              rotation: (i % 2 === 0 ? -3 : 3) + Math.random() * 4 - 2,
                              active: activeTopic === s.name,
                              hoverStyles: { bgColor: '#2563EB', textColor: '#ffffff' },
                              onClick: () => {
                                  if (activeTopic === s.name) {
                                      setActiveTopic(null);
                                  } else {
                                      setActiveTopic(s.name);
                                      setPrompt(s.prompt);
                                  }
                              }
                          }))}
                          staggerDelay={0.05}
                      />
                  </div>
                  
                  <div className="h-8"></div> 
                </div>

                <div className="relative z-20 w-full max-w-2xl mx-auto px-4 pb-6 mt-auto">
                  {/* GLASS PROMPT BOX - More transparent, lighter border */}
                  <div className="w-full bg-white/5 border border-white/10 rounded-[24px] p-2 shadow-2xl backdrop-blur-md">
                    <div className="relative bg-black/20 rounded-[20px] p-4 group focus-within:ring-1 focus-within:ring-white/20 transition-all duration-300">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isThinking}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                        placeholder="Type your topic here or choose a category from the menu..."
                        className="w-full h-24 resize-none bg-transparent border-none outline-none text-base text-white placeholder:text-gray-500 pr-12 disabled:opacity-50 font-sans"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <button onClick={handleSubmit} disabled={!prompt.trim() || isThinking} className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl flex items-center justify-center transition-all duration-200 shadow-lg shadow-blue-900/20 disabled:shadow-none transform active:scale-95 disabled:cursor-not-allowed group-hover:shadow-blue-600/30">
                            {isThinking ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> :
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" /></svg>}
                          </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 px-2">
                       <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span>AI Ready</span>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setShowHistory(true)}
                            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all tooltip tooltip-left"
                            data-tip="History"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                          
                          <div className="h-4 w-[1px] bg-white/10"></div>
                          
                          <div className="flex items-center gap-2 text-gray-400 text-sm">
                             <WalletConnect isConnected={true} />
                             <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5 text-xs font-mono">{credits}/5</span>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <NameInputModal isOpen={showNameModal} onSubmit={handleNameSubmit} />
      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        walletAddress={address}
      />
      <TransactionModal isOpen={showTransactionModal} onClose={() => { setShowTransactionModal(false); setPendingHook(null); }} onSuccess={handleTransactionSuccess} hasCredits={credits > 0} />
    </>
  );
}