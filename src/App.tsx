import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { LiveFrontendPreview } from './components/LiveFrontendPreview';
import { WordPressSimulator } from './components/WordPressSimulator';
import { BlueprintExplorer } from './components/BlueprintExplorer';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { LiveEndpointConnector } from './components/LiveEndpointConnector';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { ProductItem, WebhookLog } from './types';
import { Zap, CheckCircle2, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'live-preview' | 'wp-simulator' | 'code-blueprints' | 'architecture-guide' | 'endpoint-tester'>('live-preview');
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: 'log_init',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      event: 'save_post_product',
      postId: 101,
      postTitle: 'AERO-X9 Titanium Chronograph',
      tagsPurged: ['products', 'product-aero-x9-titanium-chronograph', 'featured-products'],
      status: 'success',
      latencyMs: 142,
      signature: 'sha256_9b83f0...validated',
    }
  ]);
  const [isRevalidating, setIsRevalidating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger simulated on-demand ISR revalidation webhook
  const triggerRevalidation = (product?: ProductItem) => {
    setIsRevalidating(true);
    const targetProduct = product || products[0];
    const postTitle = targetProduct ? targetProduct.title : 'Featured Products';
    const postId = targetProduct ? targetProduct.databaseId : 101;
    const slug = targetProduct ? targetProduct.slug : 'products';

    setToastMessage(`⚡ Dispatching save_post webhook for "${postTitle}" to /api/revalidate...`);

    setTimeout(() => {
      const newLog: WebhookLog = {
        id: `log_${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'save_post_product',
        postId: postId,
        postTitle: postTitle,
        tagsPurged: ['products', `product-${slug}`, 'featured-products'],
        status: 'success',
        latencyMs: Math.floor(Math.random() * 80) + 95, // 95 - 175ms
        signature: `sha256_${Math.random().toString(36).substring(2, 12)}...validated`,
      };

      setWebhookLogs((prev) => [newLog, ...prev]);
      setIsRevalidating(false);
      setToastMessage(`✓ Vercel Edge ISR Cache Purged in ${newLog.latencyMs}ms! Next.js 14 served fresh HTML.`);

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }, 600);
  };

  // Toggle ACF is_featured on a product
  const handleToggleFeatured = (id: string) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const nextFeatured = !p.productFields.isFeatured;
        return {
          ...p,
          productFields: {
            ...p.productFields,
            isFeatured: nextFeatured,
          },
        };
      }
      return p;
    });

    setProducts(updated);
    const target = updated.find((p) => p.id === id);
    triggerRevalidation(target);
  };

  // Update a product's price
  const handleUpdateProductPrice = (id: string, newPrice: number) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          productFields: {
            ...p.productFields,
            price: newPrice,
          },
        };
      }
      return p;
    });
    setProducts(updated);
    const target = updated.find((p) => p.id === id);
    triggerRevalidation(target);
  };

  // Update entire product from WordPress simulator
  const handleUpdateProduct = (updatedProd: ProductItem) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProd.id ? updatedProd : p))
    );
    triggerRevalidation(updatedProd);
  };

  // Add new product from WordPress simulator
  const handleAddProduct = (newProd: ProductItem) => {
    setProducts((prev) => [newProd, ...prev]);
    triggerRevalidation(newProd);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F0F0F0] flex flex-col antialiased selection:bg-cyan-400 selection:text-black">
      {/* Toast Notification for Edge ISR invalidation */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-20 right-6 z-50 max-w-md bg-[#0A0A0A] border-l-2 border-cyan-500 border-t border-r border-b border-white/10 text-white p-4 shadow-2xl shadow-cyan-500/10 flex items-start gap-3 text-xs font-mono"
          >
            <Zap className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 text-white/90">{toastMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSimulateWebhook={() => triggerRevalidation()}
        isRevalidating={isRevalidating}
        webhookCount={webhookLogs.length}
      />

      {/* View Router */}
      <main className="flex-grow flex flex-col">
        {activeTab === 'live-preview' && (
          <LiveFrontendPreview
            products={products}
            onToggleFeatured={handleToggleFeatured}
            onUpdateProductPrice={handleUpdateProductPrice}
            onSimulateSave={(prod) => triggerRevalidation(prod)}
            isRevalidating={isRevalidating}
          />
        )}

        {activeTab === 'wp-simulator' && (
          <WordPressSimulator
            products={products}
            onToggleFeatured={handleToggleFeatured}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            webhookLogs={webhookLogs}
            onTriggerManualWebhook={() => triggerRevalidation()}
            isRevalidating={isRevalidating}
          />
        )}

        {activeTab === 'code-blueprints' && <BlueprintExplorer />}

        {activeTab === 'architecture-guide' && <ArchitectureGuide />}

        {activeTab === 'endpoint-tester' && <LiveEndpointConnector />}
      </main>

      {/* Global Footer */}
      <footer className="h-14 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 bg-[#050505] shrink-0 gap-3 py-3 sm:py-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-500 rounded-none rotate-45 flex items-center justify-center">
              <div className="w-2 h-2 bg-[#050505] -rotate-45" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/50 font-mono">
              POWERHOUSE • HEADLESS WP + NEXT.JS 14
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/30 hidden md:inline">
            STACK: NEXT.JS 14 / WPGRAPHQL / EDGE ISR / TAILWIND
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_6px_rgba(0,245,255,0.8)]" />
            <span className="text-[9px] uppercase tracking-widest text-white/60 font-mono">
              VERCEL EDGE NODE: ACTIVE
            </span>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-white/30 font-mono">
            WPGraphQL 1.28
          </span>
        </div>
      </footer>
    </div>
  );
}
