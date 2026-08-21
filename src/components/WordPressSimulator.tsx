import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  RefreshCw, 
  Plus, 
  Edit3, 
  Check, 
  Send, 
  Terminal, 
  Layers, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Database,
  ExternalLink,
  Search,
  Code2
} from 'lucide-react';
import { ProductItem, WebhookLog } from '../types';

interface WordPressSimulatorProps {
  products: ProductItem[];
  onToggleFeatured: (id: string) => void;
  onUpdateProduct: (updated: ProductItem) => void;
  onAddProduct: (newProduct: ProductItem) => void;
  webhookLogs: WebhookLog[];
  onTriggerManualWebhook: () => void;
  isRevalidating: boolean;
}

export function WordPressSimulator({
  products,
  onToggleFeatured,
  onUpdateProduct,
  onAddProduct,
  webhookLogs,
  onTriggerManualWebhook,
  isRevalidating,
}: WordPressSimulatorProps) {
  const [activeSubTab, setActiveSubTab] = useState<'cpt-manager' | 'graphiql' | 'webhook-logs'>('cpt-manager');
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // GraphiQL query state
  const [graphQlQuery, setGraphQlQuery] = useState<string>(`query GetFeaturedProducts {
  products(first: 6, where: { orderby: { field: DATE, order: DESC } }) {
    nodes {
      id
      title
      slug
      productFields {
        price
        isFeatured
        badge
        sku
        stockStatus
      }
    }
  }
}`);
  const [graphQlResult, setGraphQlResult] = useState<string>('');
  const [isQuerying, setIsQuerying] = useState<boolean>(false);
  const [queryLatency, setQueryLatency] = useState<number>(0);

  // Execute Simulated GraphQL Query
  const handleExecuteQuery = () => {
    setIsQuerying(true);
    const startTime = performance.now();

    setTimeout(() => {
      // Parse or simulate query filtering
      const isFilteringFeatured = graphQlQuery.includes('isFeatured') || graphQlQuery.includes('Featured');
      
      const filtered = isFilteringFeatured
        ? products.filter(p => p.productFields.isFeatured)
        : products;

      const output = {
        data: {
          products: {
            nodes: filtered.map(p => ({
              id: p.id,
              databaseId: p.databaseId,
              title: p.title,
              slug: p.slug,
              productFields: {
                price: p.productFields.price,
                isFeatured: p.productFields.isFeatured,
                badge: p.productFields.badge,
                sku: p.productFields.sku,
                stockStatus: p.productFields.stockStatus,
                specs: p.productFields.specs
              }
            }))
          }
        },
        extensions: {
          wpgraphql: {
            version: '1.28.0',
            executionTimeMs: Math.round(performance.now() - startTime + 8),
            cacheStatus: 'HIT_OBJECT_CACHE',
            schema: 'Product_ACF_V2'
          }
        }
      };

      setGraphQlResult(JSON.stringify(output, null, 2));
      setQueryLatency(Math.round(performance.now() - startTime + 8));
      setIsQuerying(false);
    }, 180);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.productFields.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
      {/* Top Banner: Admin Header */}
      <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 font-black text-xl font-mono">
            W
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white font-display uppercase tracking-tight">
                WordPress Headless Control Center
              </h2>
              <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-widest">
                WP 6.7 + WPGraphQL 1.28
              </span>
            </div>
            <p className="text-xs text-white/50 font-mono mt-1">
              Host: <span className="text-white/80">cPanel Shared (Apache / PHP 8.2)</span> • Frontend: <span className="text-cyan-300">Vercel Next.js 14</span>
            </p>
          </div>
        </div>

        {/* Sub-tabs Switcher */}
        <div className="flex items-center gap-2 bg-black p-1 border border-white/10">
          <button
            onClick={() => setActiveSubTab('cpt-manager')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
              activeSubTab === 'cpt-manager'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Products CPT ({products.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('graphiql');
              if (!graphQlResult) handleExecuteQuery();
            }}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all ${
              activeSubTab === 'graphiql'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            GraphiQL IDE
          </button>
          <button
            onClick={() => setActiveSubTab('webhook-logs')}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 ${
              activeSubTab === 'webhook-logs'
                ? 'bg-cyan-500 text-black font-bold'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>ISR Webhooks</span>
            <span className={`w-1.5 h-1.5 rounded-full ${activeSubTab === 'webhook-logs' ? 'bg-black' : 'bg-green-400'}`} />
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PRODUCTS CPT MANAGER */}
      {activeSubTab === 'cpt-manager' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-white/40 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onTriggerManualWebhook}
                disabled={isRevalidating}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white/80 flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRevalidating ? 'animate-spin' : ''}`} />
                <span>Test save_post Webhook</span>
              </button>

              <button
                onClick={() => {
                  const newId = `prod_${Date.now()}`;
                  const newProd: ProductItem = {
                    id: newId,
                    databaseId: Math.floor(Math.random() * 900) + 100,
                    title: 'AERO-STEALTH Titanium Carabiner',
                    slug: `aero-stealth-carabiner-${Date.now()}`,
                    date: new Date().toISOString(),
                    content: '<p>Precision CNC-milled monolithic titanium carabiner with knurled lock ring.</p>',
                    featuredImage: {
                      node: {
                        sourceUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
                        altText: 'AERO-STEALTH Titanium Carabiner',
                      }
                    },
                    productFields: {
                      price: 145,
                      originalPrice: 175,
                      isFeatured: true,
                      badge: 'NEW LAUNCH',
                      sku: 'AST-CAR-99',
                      stockStatus: 'IN_STOCK',
                      shortDescription: 'Monolithic Grade 5 titanium lock carabiner for everyday carry.',
                      specs: [
                        { label: 'Weight', value: '42 grams' },
                        { label: 'Load Limit', value: '800 kg' }
                      ],
                      gallery: []
                    },
                    productCategories: {
                      nodes: [{ name: 'Titanium Hardware', slug: 'titanium-hardware' }]
                    }
                  };
                  onAddProduct(newProd);
                }}
                className="px-5 py-2.5 bg-cyan-500 hover:bg-white text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,245,255,0.2)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product (ACF)</span>
              </button>
            </div>
          </div>

          {/* WordPress Table */}
          <div className="bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black text-white/50 uppercase text-[10px] tracking-widest border-b border-white/10">
                  <tr>
                    <th className="p-4 pl-6">Product Title & SKU</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price (ACF)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">ACF is_featured Toggle</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  {filteredProducts.map((p) => {
                    const isFeat = p.productFields.isFeatured;
                    return (
                      <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.featuredImage?.node?.sourceUrl || ''}
                              alt={p.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover bg-black border border-white/10"
                            />
                            <div>
                              <div className="font-bold text-white text-sm font-display uppercase">{p.title}</div>
                              <div className="text-[11px] text-white/40 font-mono">
                                ID: #{p.databaseId} • SKU: {p.productFields.sku} • Slug: /{p.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-white/50">
                          {p.productCategories.nodes.map(n => n.name).join(', ') || 'Uncategorized'}
                        </td>

                        <td className="p-4 font-bold font-mono text-white">
                          ${p.productFields.price.toLocaleString()}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            p.productFields.stockStatus === 'IN_STOCK'
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                          }`}>
                            {p.productFields.stockStatus}
                          </span>
                        </td>

                        {/* ACF is_featured Toggle */}
                        <td className="p-4">
                          <button
                            onClick={() => onToggleFeatured(p.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all cursor-pointer text-xs uppercase tracking-wider ${
                              isFeat
                                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isFeat ? 'bg-cyan-400 animate-pulse' : 'bg-white/30'}`} />
                            <span>{isFeat ? 'TRUE (Featured)' : 'FALSE'}</span>
                          </button>
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => setEditingProduct({ ...p })}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white flex items-center gap-1.5 ml-auto text-xs uppercase tracking-wider"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Edit ACF</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT DRAWER */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
                    WordPress Custom Post Type Editor
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-0.5 uppercase">
                    Edit: {editingProduct.title}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                {/* Title */}
                <div>
                  <label className="block text-white/50 mb-1 uppercase tracking-wider">Post Title</label>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full bg-black border border-white/10 px-4 py-2.5 text-white font-sans text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Price & Badge */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 mb-1 uppercase tracking-wider">ACF: Price ($ USD)</label>
                    <input
                      type="number"
                      value={editingProduct.productFields.price}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        productFields: { ...editingProduct.productFields, price: Number(e.target.value) }
                      })}
                      className="w-full bg-black border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 uppercase tracking-wider">ACF: Badge / Pill Text</label>
                    <input
                      type="text"
                      value={editingProduct.productFields.badge || ''}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        productFields: { ...editingProduct.productFields, badge: e.target.value }
                      })}
                      className="w-full bg-black border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                {/* Is Featured Toggle */}
                <div className="p-4 bg-black border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white uppercase tracking-wider">ACF: is_featured (True / False)</div>
                    <div className="text-white/40 text-[11px] font-light">
                      Controls inclusion in the Next.js homepage featured products query.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingProduct({
                      ...editingProduct,
                      productFields: {
                        ...editingProduct.productFields,
                        isFeatured: !editingProduct.productFields.isFeatured
                      }
                    })}
                    className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all border ${
                      editingProduct.productFields.isFeatured
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.25)]'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}
                  >
                    {editingProduct.productFields.isFeatured ? '✓ TRUE (Featured)' : 'FALSE'}
                  </button>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-white/50 mb-1 uppercase tracking-wider">ACF: Short Description</label>
                  <textarea
                    rows={3}
                    value={editingProduct.productFields.shortDescription}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      productFields: { ...editingProduct.productFields, shortDescription: e.target.value }
                    })}
                    className="w-full bg-black border border-white/10 p-3 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Save & Webhook Trigger CTA */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Auto-dispatches Vercel ISR webhook
                </span>

                <button
                  onClick={() => {
                    onUpdateProduct(editingProduct);
                    setEditingProduct(null);
                  }}
                  className="px-6 py-3 bg-cyan-500 hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,255,0.25)] cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update & Revalidate Edge</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUB-TAB 2: GRAPHIQL IDE EXPLORER */}
      {activeSubTab === 'graphiql' && (
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white font-display uppercase tracking-tight flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  WPGraphQL Query Explorer (GraphiQL)
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Endpoint: <code className="text-cyan-300">POST /graphql</code> • Schema: WPGraphQL for ACF
                </p>
              </div>

              <div className="flex items-center gap-3">
                {queryLatency > 0 && (
                  <span className="text-xs font-mono text-green-400 bg-green-500/10 px-3 py-1.5 border border-green-500/20 uppercase tracking-wider">
                    ⚡ {queryLatency}ms execution
                  </span>
                )}

                <button
                  onClick={handleExecuteQuery}
                  disabled={isQuerying}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-white text-black font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.25)] cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 fill-black ${isQuerying ? 'animate-spin' : ''}`} />
                  <span>{isQuerying ? 'Executing...' : 'Run Query'}</span>
                </button>
              </div>
            </div>

            {/* Split Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Query Input */}
              <div className="flex flex-col">
                <div className="text-[11px] font-mono text-white/50 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>GraphQL Request</span>
                  <span className="text-white/30">POST /graphql</span>
                </div>
                <textarea
                  value={graphQlQuery}
                  onChange={(e) => setGraphQlQuery(e.target.value)}
                  rows={14}
                  className="w-full bg-black border border-white/10 p-4 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 leading-relaxed resize-none"
                  spellCheck={false}
                />
              </div>

              {/* Right: Response Output */}
              <div className="flex flex-col">
                <div className="text-[11px] font-mono text-white/50 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>JSON Response Payload</span>
                  <span className="text-green-400">200 OK (application/json)</span>
                </div>
                <pre className="w-full bg-black border border-white/10 p-4 text-xs font-mono text-green-300 overflow-y-auto max-h-[300px] leading-relaxed">
                  {graphQlResult || '// Click "Run Query" to execute WPGraphQL'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ISR REVALIDATION WEBHOOK AUDIT LOGS */}
      {activeSubTab === 'webhook-logs' && (
        <div className="space-y-6">
          <div className="bg-[#0A0A0A] border border-white/10 p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white font-display uppercase tracking-tight flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Vercel Edge ISR Revalidation Audit Trail
                </h3>
                <p className="text-xs text-white/50 font-mono mt-0.5">
                  Fired automatically by <code className="text-cyan-300">save_post_product</code> hook in <code className="text-cyan-300">powerhouse-engine.php</code>
                </p>
              </div>

              <button
                onClick={onTriggerManualWebhook}
                disabled={isRevalidating}
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRevalidating ? 'animate-spin' : ''}`} />
                <span>Simulate WP Post Save</span>
              </button>
            </div>

            {/* Logs Table */}
            <div className="divide-y divide-white/5 text-xs font-mono">
              {webhookLogs.length === 0 ? (
                <div className="py-12 text-center text-white/40 uppercase tracking-widest">
                  No webhooks dispatched yet. Toggle a product or click "Simulate WP Post Save" above.
                </div>
              ) : (
                webhookLogs.map((log) => (
                  <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 text-white">
                          <span className="font-bold uppercase">{log.event}</span>
                          <span className="text-white/30">•</span>
                          <span className="text-cyan-300">Post #{log.postId} ("{log.postTitle}")</span>
                        </div>
                        <div className="text-[11px] text-white/50 mt-1">
                          Purged Tags: {log.tagsPurged.map(t => (
                            <code key={t} className="bg-black px-1.5 py-0.5 border border-white/10 mr-1 text-white/80">
                              {t}
                            </code>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <span className="text-[11px] text-white/40">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="px-2.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold uppercase tracking-wider">
                        {log.status.toUpperCase()} ({log.latencyMs}ms)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
