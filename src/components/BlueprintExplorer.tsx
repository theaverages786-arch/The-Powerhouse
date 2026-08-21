import React, { useState } from 'react';
import { 
  FolderTree, 
  Copy, 
  Check, 
  FileCode, 
  Sparkles, 
  Code2, 
  Terminal, 
  Layers, 
  ExternalLink,
  Search,
  Download,
  Info
} from 'lucide-react';
import { BLUEPRINT_FILES } from '../data/blueprintFiles';
import { BlueprintFile } from '../types';

export function BlueprintExplorer() {
  const [selectedFileId, setSelectedFileId] = useState<string>('wp-engine-php');
  const [copied, setCopied] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedFile = BLUEPRINT_FILES.find((f) => f.id === selectedFileId) || BLUEPRINT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = BLUEPRINT_FILES.filter((f) => {
    const matchesCat = filterCategory === 'all' || f.category === filterCategory;
    const matchesSearch = f.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Top Banner */}
      <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold uppercase tracking-widest">
              100% PRODUCTION READY
            </span>
            <span className="text-white/40 text-xs font-mono uppercase tracking-wider">• 9 Blueprint Files</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
            The Powerhouse Codebase Blueprint
          </h2>
          <p className="text-xs text-white/50 font-mono mt-1">
            TypeScript 5.8 • Next.js 14 App Router • PHP 8.2 • WPGraphQL • ACF Pro • Apache
          </p>
        </div>

        {/* Global Action */}
        <button
          onClick={handleCopyCode}
          className="px-6 py-3.5 bg-cyan-500 hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all cursor-pointer shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : `Copy ${selectedFile.filename}`}</span>
        </button>
      </div>

      {/* Main Grid: File Tree on Left, Code Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: File Explorer & Categories */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#0A0A0A] p-1.5 border border-white/10 text-xs font-mono">
            {[
              { id: 'all', label: 'All Files' },
              { id: 'wordpress', label: 'WordPress' },
              { id: 'nextjs-core', label: 'Next.js Core' },
              { id: 'frontend-ui', label: 'Frontend UI' },
              { id: 'isr-deployment', label: 'ISR & Deploy' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all ${
                  filterCategory === cat.id
                    ? 'bg-cyan-500 text-black font-bold'
                    : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search file path or component..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-white/10 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* File List */}
          <div className="bg-[#0A0A0A] border border-white/10 p-2 space-y-1 max-h-[580px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-3 transition-all flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-white shadow-sm'
                      : 'border-transparent text-white/50 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected ? 'text-cyan-400' : 'text-white/30'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-mono font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white/80'}`}>
                        {file.filename}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-white/5 text-white/40">
                        {file.language}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/40 font-mono truncate mt-0.5">
                      {file.path}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Architecture Insights Card */}
          <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 text-xs font-mono text-white/80 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              <Info className="w-4 h-4" />
              <span>Architectural Guarantee</span>
            </div>
            <p className="text-white/60 text-[11px] leading-relaxed font-light">
              Every single snippet in this blueprint is verified for Next.js 14 App Router, WPGraphQL 1.28+, and standard cPanel Apache environments.
            </p>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* File Header & Highlights */}
          <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {selectedFile.badge}
                </span>
                <h3 className="text-xl font-bold text-white font-display mt-2 uppercase tracking-tight">
                  {selectedFile.title}
                </h3>
                <p className="text-xs text-white/40 font-mono mt-0.5">
                  Target Path: <code className="text-cyan-300">{selectedFile.path}</code>
                </p>
              </div>

              <button
                onClick={handleCopyCode}
                className="self-start sm:self-auto px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 hover:text-white flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed border-t border-white/10 pt-4 font-light">
              {selectedFile.description}
            </p>

            {/* Highlights bullet points */}
            <div className="bg-black p-4 border border-white/10 space-y-2">
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                Key Architectural Highlights:
              </div>
              {selectedFile.highlights.map((h, i) => (
                <div key={i} className="text-xs font-mono text-white/80 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actual Code Box */}
          <div className="relative bg-[#050505] border border-white/10 shadow-2xl overflow-hidden">
            <div className="bg-black px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-xs font-mono text-cyan-300">{selectedFile.path}</span>
              </div>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                {selectedFile.language}
              </span>
            </div>

            <pre className="p-6 text-xs font-mono text-white/90 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
