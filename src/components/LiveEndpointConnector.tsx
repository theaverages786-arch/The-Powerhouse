import React, { useState } from 'react';
import { 
  Radio, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Terminal, 
  Layers, 
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export function LiveEndpointConnector() {
  const [endpointUrl, setEndpointUrl] = useState<string>('https://admin.yourdomain.com/graphql');
  const [authToken, setAuthToken] = useState<string>('');
  const [testQuery, setTestQuery] = useState<string>(`query TestConnection {
  generalSettings {
    title
    description
    url
  }
  products(first: 3) {
    nodes {
      id
      title
      slug
    }
  }
}`);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [testResponse, setTestResponse] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number>(0);

  const handleTestEndpoint = async () => {
    setIsLoading(true);
    setStatus('idle');
    const start = performance.now();

    try {
      // Direct live fetch
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(endpointUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: testQuery }),
      });

      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      setTestResponse(JSON.stringify(json, null, 2));
      setStatus('success');
    } catch (err: any) {
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setStatus('error');
      setTestResponse(
        JSON.stringify(
          {
            error: 'Connection Failed / CORS restriction',
            message: err.message,
            diagnosticTips: [
              '1. Ensure WPGraphQL plugin is active on WordPress.',
              '2. Ensure CORS headers are enabled in powerhouse-engine.php or .htaccess on cPanel.',
              '3. Verify your endpoint URL ends in /graphql and uses https://.',
              '4. Test in a new tab if iframe security policies restrict local origin requests.'
            ]
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest mb-4">
          <Radio className="w-3.5 h-3.5" />
          Remote WordPress GraphQL Connectivity Tester
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white font-display uppercase tracking-tight">
          Connect & Test Your Real WordPress Backend
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-white/60 max-w-2xl font-mono leading-relaxed font-light">
          Validate your live cPanel WordPress GraphQL endpoint, diagnose CORS headers, and test query execution before pushing to Vercel production.
        </p>
      </div>

      {/* Connection Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 space-y-4 text-xs font-mono">
            <div>
              <label className="block text-white/50 mb-1 font-bold uppercase tracking-wider">
                WPGraphQL Endpoint URL
              </label>
              <input
                type="url"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="https://admin.yourdomain.com/graphql"
                className="w-full bg-black border border-white/10 px-4 py-2.5 text-cyan-300 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-white/50 mb-1 font-bold uppercase tracking-wider">
                Authorization Bearer Token (Optional / Draft Mode)
              </label>
              <input
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-black border border-white/10 px-4 py-2.5 text-white/80 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-white/50 mb-1 font-bold uppercase tracking-wider">
                GraphQL Test Query
              </label>
              <textarea
                rows={8}
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="w-full bg-black border border-white/10 p-4 text-white/80 font-mono text-xs focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            <button
              onClick={handleTestEndpoint}
              disabled={isLoading}
              className="w-full py-3.5 bg-cyan-500 hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.25)] transition-all cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Testing Endpoint...' : 'Send Live GraphQL Request'}</span>
            </button>
          </div>
        </div>

        {/* Live Response Panel */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="bg-[#050505] border border-white/10 p-6 sm:p-8 flex-grow flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 text-xs font-mono">
              <span className="text-white/50 uppercase font-bold tracking-widest">Server Response</span>
              {status === 'success' && (
                <span className="flex items-center gap-1.5 text-green-400 bg-green-500/10 px-2.5 py-1 border border-green-500/20 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>200 OK ({latency}ms)</span>
                </span>
              )}
              {status === 'error' && (
                <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2.5 py-1 border border-red-500/20 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Failed ({latency}ms)</span>
                </span>
              )}
              {status === 'idle' && (
                <span className="text-white/30 uppercase tracking-wider">Awaiting Request</span>
              )}
            </div>

            <pre className="flex-grow bg-black border border-white/10 p-4 text-xs font-mono text-green-300 overflow-y-auto max-h-[420px] leading-relaxed">
              {testResponse || '// Endpoint response JSON will display here after execution.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
