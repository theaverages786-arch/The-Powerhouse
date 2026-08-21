import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Layers, 
  Eye, 
  Check, 
  SlidersHorizontal,
  Code,
  Tag,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  X,
  Activity
} from 'lucide-react';
import { ProductItem } from '../types';

interface LiveFrontendPreviewProps {
  products: ProductItem[];
  onToggleFeatured: (id: string) => void;
  onUpdateProductPrice: (id: string, newPrice: number) => void;
  onSimulateSave: (product: ProductItem) => void;
  isRevalidating: boolean;
}

export function LiveFrontendPreview({
  products,
  onToggleFeatured,
  onUpdateProductPrice,
  onSimulateSave,
  isRevalidating,
}: LiveFrontendPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeProductModal, setActiveProductModal] = useState<ProductItem | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<ProductItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [showSchemaDrawer, setShowSchemaDrawer] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filter & Sort Products
  const categories = ['all', 'Horology', 'Audio Hardware', 'Peripherals', 'Workspace'];
  
  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.productCategories.nodes.some(
      (cat) => cat.name.toLowerCase() === selectedCategory.toLowerCase()
    );
  }).sort((a, b) => {
    if (sortBy === 'featured') {
      return (b.productFields.isFeatured ? 1 : 0) - (a.productFields.isFeatured ? 1 : 0);
    }
    if (sortBy === 'price-asc') {
      return a.productFields.price - b.productFields.price;
    }
    if (sortBy === 'price-desc') {
      return b.productFields.price - a.productFields.price;
    }
    return 0;
  });

  const featuredCount = products.filter((p) => p.productFields.isFeatured).length;

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F0F0F0]">
      {/* Interactive Simulation Top Banner */}
      <div className="bg-[#0A0A0A] border-b border-white/10 py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-0.5 rounded-none bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[11px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              VERCEL EDGE CACHE: HIT (28ms)
            </span>
            <span className="text-white/40 hidden sm:inline">
              ISR Tag: <code className="text-cyan-300">['products', 'featured-products']</code>
            </span>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-[11px] uppercase tracking-wider">
            <span>WP CPT: <strong className="text-white">{products.length} Products</strong></span>
            <span>Featured in WP: <strong className="text-cyan-400">{featuredCount} Active</strong></span>
          </div>
        </div>
      </div>

      {/* Hero Section: Sophisticated Dark Split Bento */}
      <section className="border-b border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Hero Manifesto & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block mb-6 px-3 py-1 border border-cyan-500/30 rounded-full bg-cyan-500/5 self-start"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">
                Headless Architecture v2.0
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-6xl lg:text-[72px] leading-[0.95] font-black uppercase mb-8 tracking-tighter font-display"
            >
              The New<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '1px #00F5FF' }}>
                Standard
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base sm:text-lg text-white/60 max-w-lg mb-10 leading-relaxed font-light"
            >
              High-performance Next.js 14 frontend coupled with the rock-solid familiarity of WordPress CMS. Custom fields, WPGraphQL orchestration, and instant on-demand cache revalidation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#featured-products"
                className="bg-cyan-500 text-black font-bold uppercase text-xs tracking-widest px-8 py-4 rounded-none hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,245,255,0.25)] cursor-pointer inline-flex items-center gap-2"
              >
                <span>Explore Artifacts</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  const el = document.getElementById('featured-products');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border border-white/20 font-bold uppercase text-xs tracking-widest px-8 py-4 rounded-none hover:bg-white/10 text-white transition-all cursor-pointer"
              >
                Inspect Schema
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Lighthouse</div>
                <div className="text-xl font-bold font-mono text-green-400 mt-1">100 / 100</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Edge TTFB</div>
                <div className="text-xl font-bold font-mono text-white mt-1">28 ms</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Query Payload</div>
                <div className="text-xl font-bold font-mono text-cyan-400 mt-1">4.2 KB</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ISR Purge</div>
                <div className="text-xl font-bold font-mono text-cyan-300 mt-1">&lt; 150 ms</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live WP Feed & ISR Real-time Block */}
          <div className="lg:col-span-5 flex flex-col bg-[#0A0A0A]">
            <div className="p-8 border-b border-white/10 bg-gradient-to-r from-transparent to-cyan-950/20 flex items-center justify-between">
              <div>
                <h2 className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1 font-bold">
                  Featured Products
                </h2>
                <p className="text-white/60 text-xs italic font-serif">
                  Pulled via WPGraphQL in 14ms
                </p>
              </div>
              <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
            </div>

            <div className="flex-grow flex flex-col">
              {products.slice(0, 3).map((prod, idx) => (
                <div
                  key={prod.id}
                  onClick={() => setActiveProductModal(prod)}
                  className="p-6 sm:p-8 flex items-center justify-between group cursor-pointer border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex gap-4 items-center">
                    <span className="text-white/20 text-xs font-mono italic">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="text-sm uppercase tracking-wider font-bold group-hover:text-cyan-400 transition-colors">
                        {prod.title}
                      </h3>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">
                        {prod.productCategories.nodes.map(n => n.name).join(', ') || 'Custom Engineered'}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-white group-hover:text-cyan-400 transition-colors">
                    ${prod.productFields.price.toLocaleString()}
                  </span>
                </div>
              ))}

              {/* Next.js ISR Status Card */}
              <div className="mt-auto p-6 sm:p-8">
                <div className="bg-white/5 p-6 border-l-2 border-cyan-500">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      Next.js ISR Status
                    </p>
                    <span className="text-[10px] text-green-400 font-mono">ONLINE</span>
                  </div>
                  <p className="text-[13px] text-white/70 leading-relaxed font-light">
                    On-demand tag invalidation active. When a post is updated in WordPress, Next.js purges the edge cache in under 150ms.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured-products" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-16">
        {/* Section Header with Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Live WordPress ACF & Custom Post Types
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display uppercase">
              Curated Artifacts
            </h2>
          </div>

          {/* Filter & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1 bg-[#0A0A0A] p-1 border border-white/10 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0A0A0A] border border-white/10 px-3 py-2 text-xs font-mono text-white/80 focus:outline-none focus:border-cyan-400 uppercase tracking-wider"
            >
              <option value="featured" className="bg-[#0A0A0A] text-white">Sort: WP Featured First</option>
              <option value="price-asc" className="bg-[#0A0A0A] text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-[#0A0A0A] text-white">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, idx) => {
            const isFeaturedInWP = product.productFields.isFeatured;
            const primaryImg = product.featuredImage?.node?.sourceUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80';

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`group relative bg-[#0A0A0A] border transition-all duration-300 hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(0,245,255,0.08)] flex flex-col ${
                  isFeaturedInWP ? 'border-cyan-500/30' : 'border-white/10'
                }`}
              >
                {/* Top Badges & WP Toggle */}
                <div className="p-5 pb-0 flex items-start justify-between gap-2 z-10">
                  <div className="flex flex-col gap-1.5">
                    {product.productFields.badge && (
                      <span className="px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {product.productFields.badge}
                      </span>
                    )}
                    {isFeaturedInWP && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        ACF is_featured: TRUE
                      </span>
                    )}
                  </div>

                  {/* Interactive WP Toggle Shortcut */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFeatured(product.id);
                    }}
                    title="Toggle ACF is_featured field and test ISR Edge purge"
                    className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-all border ${
                      isFeaturedInWP
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30'
                        : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30'
                    }`}
                  >
                    {isFeaturedInWP ? '★ Featured (WP)' : '☆ Mark Featured'}
                  </button>
                </div>

                {/* Product Image Stage */}
                <div className="relative aspect-[4/3] p-6 flex items-center justify-center overflow-hidden">
                  <img
                    src={primaryImg}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Quick View Hover Button */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-transform hover:scale-105 shadow-xl"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Quick Inspect
                    </button>
                    <button
                      onClick={() => setActiveProductModal(product)}
                      className="px-4 py-2 bg-cyan-500 text-black font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 transition-transform hover:scale-105 shadow-xl glow-cyan-sm"
                    >
                      Full Route
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 pt-2 flex flex-col flex-grow">
                  <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">
                    {product.productCategories.nodes.map(n => n.name).join(' • ') || 'Hardware'}
                  </div>

                  <h3 
                    onClick={() => setActiveProductModal(product)}
                    className="text-lg font-bold text-white tracking-tight font-display hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    {product.title}
                  </h3>

                  <p className="mt-2 text-xs text-white/50 line-clamp-2 leading-relaxed flex-grow font-light">
                    {product.productFields.shortDescription}
                  </p>

                  {/* Price & Action Row */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold font-mono text-white">
                        ${product.productFields.price.toLocaleString()}
                      </span>
                      {product.productFields.originalPrice && (
                        <span className="ml-2 text-xs font-mono text-white/40 line-through">
                          ${product.productFields.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setActiveProductModal(product)}
                      className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-white uppercase tracking-widest font-semibold group/link"
                    >
                      <span>VIEW ARTIFACT</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FULL DYNAMIC PRODUCT ROUTE MODAL (Simulating Next.js /app/products/[slug]/page.tsx) */}
      <AnimatePresence>
        {activeProductModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-[#0A0A0A] border border-white/10 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Route Bar Simulation */}
              <div className="bg-[#050505] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-white/60 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-white/40 uppercase">Next.js 14 Route:</span>
                  <span className="text-cyan-300 font-semibold truncate">
                    app/products/[slug]/page.tsx → /products/{activeProductModal.slug}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSchemaDrawer(!showSchemaDrawer)}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider"
                  >
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect JSON-LD SEO</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveProductModal(null);
                      setShowSchemaDrawer(false);
                    }}
                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 sm:p-8 flex-grow">
                {/* Schema Drawer Preview */}
                {showSchemaDrawer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-8 p-4 bg-black border border-cyan-500/30 text-xs font-mono text-cyan-300 overflow-x-auto"
                  >
                    <div className="flex items-center justify-between mb-2 text-white/50">
                      <span className="uppercase tracking-wider">Structured Data (Google Shopping & Schema.org Product)</span>
                      <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5">generateMetadata()</span>
                    </div>
                    <pre className="text-[11px] leading-relaxed">
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: activeProductModal.title,
    image: activeProductModal.featuredImage?.node?.sourceUrl,
    description: activeProductModal.productFields.shortDescription,
    sku: activeProductModal.productFields.sku,
    offers: {
      '@type': 'Offer',
      price: activeProductModal.productFields.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://the-powerhouse.vercel.app/products/${activeProductModal.slug}`
    }
  },
  null,
  2
)}
                    </pre>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  {/* Gallery */}
                  <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="relative aspect-[4/3] overflow-hidden bg-black border border-white/10">
                      <img
                        src={
                          activeProductModal.productFields.gallery?.[activeGalleryIndex]?.sourceUrl ||
                          activeProductModal.featuredImage?.node?.sourceUrl ||
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt={activeProductModal.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Thumbnail Switcher */}
                    {activeProductModal.productFields.gallery && activeProductModal.productFields.gallery.length > 0 && (
                      <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {activeProductModal.productFields.gallery.map((img, idx) => (
                          <button
                            key={img.id}
                            onClick={() => setActiveGalleryIndex(idx)}
                            className={`relative w-20 h-16 overflow-hidden border-2 transition-all flex-shrink-0 ${
                              activeGalleryIndex === idx
                                ? 'border-cyan-400 scale-105'
                                : 'border-white/10 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={img.sourceUrl} alt={img.altText} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="lg:col-span-5 flex flex-col">
                    {activeProductModal.productFields.badge && (
                      <span className="self-start px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono uppercase font-bold tracking-widest mb-3">
                        {activeProductModal.productFields.badge}
                      </span>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display uppercase tracking-tight">
                      {activeProductModal.title}
                    </h1>

                    <div className="mt-2 text-xs font-mono text-white/40">
                      SKU: {activeProductModal.productFields.sku} • Stock: <span className="text-cyan-400">{activeProductModal.productFields.stockStatus}</span>
                    </div>

                    {/* Price */}
                    <div className="mt-5 flex items-baseline gap-3">
                      <span className="text-3xl font-bold font-mono text-white">
                        ${activeProductModal.productFields.price.toLocaleString()}
                      </span>
                      {activeProductModal.productFields.originalPrice && (
                        <span className="text-base font-mono text-white/40 line-through">
                          ${activeProductModal.productFields.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <p className="mt-4 text-sm text-white/70 leading-relaxed border-t border-b border-white/10 py-4 font-light">
                      {activeProductModal.productFields.shortDescription}
                    </p>

                    {/* Buy CTA */}
                    <div className="mt-6 space-y-3">
                      <button className="w-full py-4 bg-cyan-500 text-black font-bold uppercase text-xs tracking-widest transition-all hover:bg-white hover:text-black glow-cyan-sm cursor-pointer">
                        ACQUIRE ARTIFACT — ${activeProductModal.productFields.price.toLocaleString()}
                      </button>

                      <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                        <div className="p-2.5 bg-white/5 border border-white/10 text-[10px] text-white/50 flex flex-col items-center gap-1 font-mono">
                          <Truck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Fast Courier</span>
                        </div>
                        <div className="p-2.5 bg-white/5 border border-white/10 text-[10px] text-white/50 flex flex-col items-center gap-1 font-mono">
                          <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                          <span>5-Yr Guarantee</span>
                        </div>
                        <div className="p-2.5 bg-white/5 border border-white/10 text-[10px] text-white/50 flex flex-col items-center gap-1 font-mono">
                          <RotateCcw className="w-3.5 h-3.5 text-cyan-300" />
                          <span>30d Return</span>
                        </div>
                      </div>
                    </div>

                    {/* Technical Specifications */}
                    {activeProductModal.productFields.specs && activeProductModal.productFields.specs.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <h4 className="text-xs font-mono uppercase text-white/50 font-bold mb-3 tracking-widest">
                          ACF Repeater Specifications
                        </h4>
                        <div className="divide-y divide-white/5 text-xs font-mono">
                          {activeProductModal.productFields.specs.map((spec, i) => (
                            <div key={i} className="py-2 flex items-center justify-between">
                              <span className="text-white/40">{spec.label}</span>
                              <span className="text-white font-medium">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* HTML Dossier */}
                {activeProductModal.content && (
                  <div className="mt-10 pt-8 border-t border-white/10">
                    <h3 className="text-lg font-bold text-white font-display mb-4 uppercase tracking-wider">
                      WordPress Editor Content (wp-content)
                    </h3>
                    <div 
                      className="prose prose-invert prose-cyan max-w-none text-white/70 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: activeProductModal.content }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK VIEW POPUP */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    Quick Inspect (ACF Preview)
                  </span>
                  <h3 className="text-xl font-bold text-white font-display mt-1 uppercase">
                    {quickViewProduct.title}
                  </h3>
                </div>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-1 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 aspect-video overflow-hidden bg-black border border-white/10">
                <img
                  src={quickViewProduct.featuredImage?.node?.sourceUrl || ''}
                  alt={quickViewProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold font-mono text-white">
                  ${quickViewProduct.productFields.price.toLocaleString()}
                </span>
                <button
                  onClick={() => {
                    const prod = quickViewProduct;
                    setQuickViewProduct(null);
                    setActiveProductModal(prod);
                  }}
                  className="px-5 py-2.5 bg-cyan-500 text-black font-bold uppercase tracking-widest text-xs flex items-center gap-1.5 hover:bg-white"
                >
                  <span>Open Full Route</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
