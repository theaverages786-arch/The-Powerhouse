import React from 'react';
import { 
  Sparkles, 
  Terminal, 
  Code2, 
  BookOpen, 
  Radio, 
  RefreshCw, 
  Layers
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'live-preview' | 'wp-simulator' | 'code-blueprints' | 'architecture-guide' | 'endpoint-tester';
  setActiveTab: (tab: 'live-preview' | 'wp-simulator' | 'code-blueprints' | 'architecture-guide' | 'endpoint-tester') => void;
  onSimulateWebhook: () => void;
  isRevalidating: boolean;
  webhookCount: number;
}

export function Header({
  activeTab,
  setActiveTab,
  onSimulateWebhook,
  isRevalidating,
  webhookCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 shrink-0">
      {/* Top micro-announcement bar */}
      <div className="bg-[#0A0A0A] border-b border-white/5 px-4 py-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-white/60 flex items-center justify-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Headless Architecture v2.0 • WPGraphQL + Next.js 14 App Router + Edge ISR</span>
        <span className="text-white/20">/</span>
        <span className="text-cyan-400 font-bold">Zero PHP Theme Bloat</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('live-preview')}>
          <div className="w-7 h-7 bg-cyan-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_12px_rgba(0,245,255,0.4)]">
            <div className="w-3.5 h-3.5 bg-[#050505] -rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tighter uppercase text-white font-display">
                Powerhouse
              </span>
              <span className="px-2 py-0.5 rounded-none text-[9px] uppercase tracking-widest font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                v2.0
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono hidden sm:block">
              WordPress CMS ⇄ Vercel Edge
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-6">
          <button
            onClick={() => setActiveTab('live-preview')}
            className={`text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'live-preview'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-cyan-400 font-medium'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Prototype</span>
          </button>

          <button
            onClick={() => setActiveTab('wp-simulator')}
            className={`text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'wp-simulator'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-cyan-400 font-medium'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>WP-Dashboard</span>
            {webhookCount > 0 && (
              <span className="px-1.5 py-0.2 text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {webhookCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('code-blueprints')}
            className={`text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'code-blueprints'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-cyan-400 font-medium'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture-guide')}
            className={`text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'architecture-guide'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-cyan-400 font-medium'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('endpoint-tester')}
            className={`text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 py-1 ${
              activeTab === 'endpoint-tester'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-white/60 hover:text-cyan-400 font-medium'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>Vercel / WP-API</span>
          </button>
        </nav>

        {/* Action Controls & API Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-white/40">API Status</span>
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
          </div>

          <button
            onClick={onSimulateWebhook}
            disabled={isRevalidating}
            title="Simulates saving a product in WordPress and triggering Next.js on-demand ISR revalidation"
            className="flex items-center gap-2 px-4 py-2 border border-white/20 font-bold uppercase text-[10px] tracking-widest text-white hover:bg-white/10 transition-all rounded-none cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRevalidating ? 'animate-spin text-green-400' : ''}`} />
            <span>
              {isRevalidating ? 'Purging ISR...' : 'Trigger Webhook'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex items-center justify-around bg-[#0A0A0A] border-t border-white/10 px-2 py-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('live-preview')}
          className={`px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap ${
            activeTab === 'live-preview' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-white/50'
          }`}
        >
          Prototype
        </button>
        <button
          onClick={() => setActiveTab('wp-simulator')}
          className={`px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap ${
            activeTab === 'wp-simulator' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-white/50'
          }`}
        >
          WP Admin
        </button>
        <button
          onClick={() => setActiveTab('code-blueprints')}
          className={`px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap ${
            activeTab === 'code-blueprints' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-white/50'
          }`}
        >
          Blueprint
        </button>
        <button
          onClick={() => setActiveTab('architecture-guide')}
          className={`px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap ${
            activeTab === 'architecture-guide' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-white/50'
          }`}
        >
          Architecture
        </button>
        <button
          onClick={() => setActiveTab('endpoint-tester')}
          className={`px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap ${
            activeTab === 'endpoint-tester' ? 'text-cyan-400 font-bold border-b border-cyan-400' : 'text-white/50'
          }`}
        >
          Live API
        </button>
      </div>
    </header>
  );
}
