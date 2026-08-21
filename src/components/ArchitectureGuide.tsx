import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Database,
  Server,
  Cloud,
  Check
} from 'lucide-react';
import { 
  WPGRAPHQL_VS_REST_COMPARISON, 
  WORDPRESS_PLUGINS, 
  STEP_BY_STEP_CPANEL_GUIDE 
} from '../data/architecturalComparison';

export function ArchitectureGuide() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Top Section */}
      <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest mb-4">
          <Zap className="w-3.5 h-3.5" />
          Elite Headless Architecture Manual
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white font-display uppercase tracking-tight">
          "The Powerhouse" Architecture Blueprint
        </h1>
        <p className="mt-3 text-sm sm:text-base text-white/60 max-w-3xl leading-relaxed font-light">
          How to deliver a familiar WordPress admin interface for non-technical clients while powering an ultra-responsive Next.js 14 frontend on Vercel with on-demand edge revalidation.
        </p>
      </div>

      {/* 1. ARCHITECTURE FLOW DIAGRAM */}
      <section className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
            01
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display uppercase tracking-tight">
              End-to-End Dataflow & Invalidation Architecture
            </h2>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              From cPanel WordPress Editor to Vercel Worldwide Edge Cache
            </p>
          </div>
        </div>

        {/* Visual Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {/* Step 1 */}
          <div className="p-5 bg-black border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                <span>STAGE 01</span>
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-display uppercase">cPanel WordPress</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed font-light">
                Client creates/edits a product in WP Admin. Hits <strong className="text-white font-bold">"Publish"</strong>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/40">
              Hook: <code className="text-cyan-300">save_post_product</code>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 bg-black border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                <span>STAGE 02</span>
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-display uppercase">Async Webhook Ping</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed font-light">
                WP fires non-blocking HTTP POST to Next.js with secret token & tags: <code className="text-cyan-300">['products', 'slug']</code>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/40">
              Non-blocking: <code className="text-green-400">&lt; 15ms latency</code>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 bg-black border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                <span>STAGE 03</span>
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-display uppercase">On-Demand ISR Purge</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed font-light">
                <code className="text-cyan-300">/api/revalidate</code> verifies HMAC token and invokes <code className="text-cyan-300">revalidateTag()</code>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/40">
              Execution: <code className="text-green-400">Vercel Edge Node</code>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 bg-black border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                <span>STAGE 04</span>
                <Cloud className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm font-display uppercase">Instant Global Update</h3>
              <p className="text-xs text-white/60 mt-2 leading-relaxed font-light">
                Next incoming visitor receives fresh static HTML in <strong className="text-white font-bold">28ms</strong>. No full rebuild!
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-white/40">
              Cache: <code className="text-white">Global Edge CDN</code>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WPGRAPHQL VS WP REST API DECISION MATRIX */}
      <section className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
            02
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display uppercase tracking-tight">
              API Benchmark: WPGraphQL vs. WP REST API
            </h2>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Why WPGraphQL is the definitively superior choice for cPanel Shared Hosting
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-white/10">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black text-white/50 uppercase text-[10px] tracking-widest border-b border-white/10">
              <tr>
                <th className="p-4 pl-6">Architectural Dimension</th>
                <th className="p-4 text-cyan-300">WPGraphQL (Recommended)</th>
                <th className="p-4 text-white/40">WP REST API</th>
                <th className="p-4 pr-6">Architectural Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {WPGRAPHQL_VS_REST_COMPARISON.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 pl-6 font-bold text-white uppercase">{row.feature}</td>
                  <td className="p-4 text-cyan-300">{row.graphql}</td>
                  <td className="p-4 text-white/50">{row.restApi}</td>
                  <td className="p-4 pr-6 text-green-400 font-bold">{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. MUST-HAVE PLUGINS FOR THE FOOLPROOF CPANEL ADMIN */}
      <section className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
            03
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display uppercase tracking-tight">
              The WordPress Headless Plugin Stack
            </h2>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Exact configuration to keep cPanel hosting ultra-lean and secure
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORDPRESS_PLUGINS.map((plugin) => (
            <div key={plugin.slug} className="p-5 bg-black border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-white text-sm font-display uppercase">{plugin.name}</h3>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
                    {plugin.version}
                  </span>
                </div>
                <p className="text-xs text-white/60 leading-relaxed mb-3 font-light">
                  {plugin.description}
                </p>
              </div>
              <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-cyan-300 flex items-start gap-1.5">
                <span className="font-bold">•</span>
                <span>cPanel Advantage: {plugin.cPanelImpact}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. STEP-BY-STEP CPANEL SETUP & CLIENT HANDOFF */}
      <section className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/5 border border-white/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
            04
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display uppercase tracking-tight">
              Step-by-Step Deployment & Client Handoff Guide
            </h2>
            <p className="text-xs text-white/50 font-mono mt-0.5">
              Follow this standard operating procedure for flawless client handoff
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {STEP_BY_STEP_CPANEL_GUIDE.map((item, idx) => (
            <div key={idx} className="p-4 bg-black border border-white/10 flex items-start gap-4">
              <div className="w-7 h-7 bg-cyan-500 text-black flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm font-display uppercase">{item.step}</h3>
                <p className="text-xs text-white/60 mt-1 leading-relaxed font-mono font-light">
                  {item.details}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
