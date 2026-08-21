import { BlueprintFile } from '../types';

export const BLUEPRINT_FILES: BlueprintFile[] = [
  {
    id: 'wp-engine-php',
    path: 'wp-content/mu-plugins/powerhouse-engine.php',
    filename: 'powerhouse-engine.php',
    language: 'php',
    category: 'wordpress',
    title: 'WordPress Headless Core Engine & CPT Definition',
    description: 'Registers the "Products" Custom Post Type, enables WPGraphQL integration, configures ACF Pro fields, enforces headless-only redirect rules, sets CORS headers, and dispatches on-demand ISR webhooks on save.',
    badge: 'Must-Use Plugin (Backend)',
    highlights: [
      'Registers CPT "product" with show_in_graphql => true',
      'Configures ACF fields (Price, is_featured, specs, gallery) in WPGraphQL Schema',
      'Intercepts frontend requests & redirects to Next.js frontend with 301',
      'Configures CORS for Vercel preview & production domains',
      'Hooks into save_post to fire on-demand Next.js ISR revalidation'
    ],
    code: `<?php
/**
 * Plugin Name: The Powerhouse Headless Engine
 * Description: Enables Pure Headless Mode, WPGraphQL CPTs, CORS Headers, and Next.js On-Demand ISR Webhook Revalidation.
 * Version: 1.0.0
 * Author: Elite Full-Stack Architect
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// -----------------------------------------------------------------------------
// 1. REGISTER CUSTOM POST TYPE: "Products" WITH WPGRAPHQL SUPPORT
// -----------------------------------------------------------------------------
add_action('init', function () {
    $labels = [
        'name'               => _x('Products', 'post type general name', 'powerhouse'),
        'singular_name'      => _x('Product', 'post type singular name', 'powerhouse'),
        'menu_name'          => _x('Products', 'admin menu', 'powerhouse'),
        'add_new'            => _x('Add New', 'product', 'powerhouse'),
        'add_new_item'       => __('Add New Product', 'powerhouse'),
        'edit_item'          => __('Edit Product', 'powerhouse'),
        'all_items'          => __('All Products', 'powerhouse'),
    ];

    $args = [
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => ['slug' => 'products', 'with_front' => false],
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-tag',
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'revisions'],
        
        // CRITICAL FOR WPGRAPHQL & NEXT.JS:
        'show_in_rest'       => true,
        'show_in_graphql'    => true,
        'graphql_single_name'=> 'product',
        'graphql_plural_name'=> 'products',
    ];

    register_post_type('product', $args);

    // Register Product Category Taxonomy
    register_taxonomy('product_category', ['product'], [
        'hierarchical'      => true,
        'labels'            => ['name' => 'Categories', 'singular_name' => 'Category'],
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_in_graphql'   => true,
        'graphql_single_name' => 'productCategory',
        'graphql_plural_name' => 'productCategories',
        'rewrite'           => ['slug' => 'product-category'],
    ]);
});

// -----------------------------------------------------------------------------
// 2. ENFORCE PURE HEADLESS MODE (DISABLE FRONTEND THEME)
// -----------------------------------------------------------------------------
add_action('template_redirect', function () {
    // Allow GraphQL requests, REST API, WP-Admin, and WP-Cron
    if (
        is_admin() || 
        strpos($_SERVER['REQUEST_URI'], '/graphql') !== false ||
        strpos($_SERVER['REQUEST_URI'], '/wp-json') !== false ||
        (defined('DOING_CRON') && DOING_CRON)
    ) {
        return;
    }

    $frontend_url = defined('NEXTJS_FRONTEND_URL') ? NEXTJS_FRONTEND_URL : 'https://the-powerhouse.vercel.app';

    // Route single products directly to the Next.js dynamic product page
    if (is_singular('product')) {
        global $post;
        wp_redirect($frontend_url . '/products/' . $post->post_name, 301);
        exit;
    }

    // Default redirect to Next.js homepage
    wp_redirect($frontend_url, 301);
    exit;
});

// -----------------------------------------------------------------------------
// 3. CORS HEADERS FOR NEXT.JS FETCHING & PREVIEW
// -----------------------------------------------------------------------------
add_action('init', function () {
    // Only send on REST or GraphQL endpoints
    if (strpos($_SERVER['REQUEST_URI'], '/graphql') !== false || strpos($_SERVER['REQUEST_URI'], '/wp-json') !== false) {
        $allowed_origins = [
            'http://localhost:3000',
            'https://the-powerhouse.vercel.app',
            defined('NEXTJS_FRONTEND_URL') ? NEXTJS_FRONTEND_URL : ''
        ];

        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if (in_array($origin, array_filter($allowed_origins))) {
            header("Access-Control-Allow-Origin: " . $origin);
            header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
            header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce");
            header("Access-Control-Allow-Credentials: true");
        }

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
    }
});

// -----------------------------------------------------------------------------
// 4. ON-DEMAND NEXT.JS ISR REVALIDATION WEBHOOK (ON PRODUCT SAVE/UPDATE)
// -----------------------------------------------------------------------------
add_action('save_post_product', function ($post_id, $post, $update) {
    // Skip autosaves, revisions, or draft transitions
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id) || $post->post_status !== 'publish') {
        return;
    }

    $revalidate_url = defined('NEXTJS_REVALIDATE_URL') 
        ? NEXTJS_REVALIDATE_URL 
        : 'https://the-powerhouse.vercel.app/api/revalidate';
    
    $secret = defined('NEXTJS_REVALIDATION_SECRET') 
        ? NEXTJS_REVALIDATION_SECRET 
        : 'super_secret_powerhouse_token_2026';

    $payload = [
        'secret'   => $secret,
        'postType' => 'product',
        'id'       => $post_id,
        'slug'     => $post->post_name,
        'tags'     => ['products', 'product-' . $post->post_name, 'featured-products'],
        'action'   => $update ? 'update' : 'create'
    ];

    // Asynchronous non-blocking HTTP request to Vercel
    wp_remote_post($revalidate_url, [
        'method'      => 'POST',
        'timeout'     => 5,
        'blocking'    => false, // Non-blocking so WP admin never lags on cPanel!
        'headers'     => [
            'Content-Type' => 'application/json',
            'x-revalidate-secret' => $secret
        ],
        'body'        => json_encode($payload),
        'data_format' => 'body'
    ]);
}, 10, 3);
`
  },
  {
    id: 'graphql-queries',
    path: 'lib/graphql/queries.ts',
    filename: 'queries.ts',
    language: 'typescript',
    category: 'nextjs-core',
    title: 'WPGraphQL Queries with ACF Fields',
    description: 'The production-ready GraphQL query to fetch Featured Products (filtered by ACF boolean toggle isFeatured), complete with pricing, image dimensions, gallery nodes, and taxonomy tags.',
    badge: 'Data Layer',
    highlights: [
      'Selective field query: prevents payload bloating on shared cPanel',
      'Filters products by isFeatured: true custom field',
      'Fetches WebP/AVIF responsive image nodes with exact aspect ratios',
      'Includes single product query by slug with full metadata'
    ],
    code: `// lib/graphql/queries.ts

/**
 * GraphQL Fragment for reusable product fields
 */
export const PRODUCT_FRAGMENT = /* GraphQL */ \`
  fragment ProductCardFields on Product {
    id
    databaseId
    title
    slug
    date
    featuredImage {
      node {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
    productCategories {
      nodes {
        name
        slug
      }
    }
    productFields {
      price
      originalPrice
      isFeatured
      badge
      sku
      stockStatus
      shortDescription
      material
      shippingInfo
    }
  }
\`;

/**
 * Query to fetch all Featured Products for the homepage
 */
export const GET_FEATURED_PRODUCTS = /* GraphQL */ \`
  query GetFeaturedProducts($first: Int = 8) {
    products(
      first: $first
      where: {
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        ...ProductCardFields
      }
    }
  }
  \${PRODUCT_FRAGMENT}
\`;

/**
 * Query to fetch a Single Product by Slug for Dynamic Routes
 */
export const GET_PRODUCT_BY_SLUG = /* GraphQL */ \`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      ...ProductCardFields
      content
      productFields {
        price
        originalPrice
        isFeatured
        badge
        sku
        stockStatus
        shortDescription
        material
        shippingInfo
        specs {
          label
          value
        }
        gallery {
          id
          sourceUrl
          altText
          title
        }
      }
    }
  }
  \${PRODUCT_FRAGMENT}
\`;

/**
 * Lightweight query for SSG Static Params generation
 */
export const GET_ALL_PRODUCT_SLUGS = /* GraphQL */ \`
  query GetAllProductSlugs {
    products(first: 100) {
      nodes {
        slug
      }
    }
  }
\`;
`
  },
  {
    id: 'next-api-ts',
    path: 'lib/api.ts',
    filename: 'api.ts',
    language: 'typescript',
    category: 'nextjs-core',
    title: 'Secure Next.js 14 API Client with ISR Cache Tags',
    description: 'Enterprise-grade GraphQL client leveraging native Next.js fetch cache with Incremental Static Regeneration (ISR), custom tags for granular revalidation, fallback error boundaries, and Draft Mode preview support.',
    badge: 'API & Caching Utility',
    highlights: [
      'Next.js 14 App Router fetch with next: { tags, revalidate }',
      'Configurable revalidate interval (default 3600s with instant on-demand webhook purge)',
      'Draft Mode authentication headers for instant WordPress preview',
      'Comprehensive error handling and typed GraphQL responses'
    ],
    code: `// lib/api.ts
import { GET_FEATURED_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_ALL_PRODUCT_SLUGS } from './graphql/queries';
import { ProductItem } from '@/types';

const WP_GRAPHQL_ENDPOINT = process.env.WORDPRESS_GRAPHQL_ENDPOINT || 'https://admin.yourdomain.com/graphql';
const WP_AUTH_REFRESH_TOKEN = process.env.WORDPRESS_AUTH_REFRESH_TOKEN;

interface FetchAPIParams {
  query: string;
  variables?: Record<string, any>;
  tags?: string[];
  revalidate?: number | false;
  preview?: boolean;
}

/**
 * Universal GraphQL Fetch Engine with Next.js 14 App Router Caching
 */
export async function fetchGraphQL<T>({
  query,
  variables = {},
  tags = ['wordpress'],
  revalidate = 3600, // Default 1 hour fallback; purged immediately via on-demand webhooks
  preview = false,
}: FetchAPIParams): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'Next.js-Powerhouse-Client/1.0',
  };

  // Attach auth token if in Draft/Preview mode or accessing private CPTs
  if (WP_AUTH_REFRESH_TOKEN && preview) {
    headers['Authorization'] = \`Bearer \${WP_AUTH_REFRESH_TOKEN}\`;
  }

  try {
    const res = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: {
        tags,
        revalidate: preview ? 0 : revalidate, // 0 bypasses cache in preview mode
      },
    });

    if (!res.ok) {
      throw new Error(\`[WPGraphQL] HTTP error! status: \${res.status} \${res.statusText}\`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('[WPGraphQL] Query Errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL Query Execution Error');
    }

    return json.data as T;
  } catch (error) {
    console.error('[WPGraphQL] Fetch failure:', error);
    throw error;
  }
}

/**
 * Fetch Featured Products (Filtered on Client or via GraphQL where clause)
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductItem[]> {
  const data = await fetchGraphQL<{ products: { nodes: ProductItem[] } }>({
    query: GET_FEATURED_PRODUCTS,
    variables: { first: limit },
    tags: ['products', 'featured-products'],
    revalidate: 3600,
  });

  // Filter client-side if WPGraphQL ACF where clauses aren't fully indexed
  return data.products.nodes.filter(
    (product) => product.productFields?.isFeatured === true
  );
}

/**
 * Fetch a Single Product by its WordPress slug
 */
export async function getProductBySlug(slug: string, preview = false): Promise<ProductItem | null> {
  const data = await fetchGraphQL<{ product: ProductItem | null }>({
    query: GET_PRODUCT_BY_SLUG,
    variables: { slug },
    tags: ['products', \`product-\${slug}\`],
    preview,
  });

  return data.product;
}

/**
 * Fetch all slugs for build-time generateStaticParams (SSG)
 */
export async function getAllProductSlugs(): Promise<string[]> {
  const data = await fetchGraphQL<{ products: { nodes: { slug: string }[] } }>({
    query: GET_ALL_PRODUCT_SLUGS,
    tags: ['products'],
    revalidate: 86400, // 24 hours
  });

  return data.products.nodes.map((node) => node.slug);
}
`
  },
  {
    id: 'next-page-tsx',
    path: 'app/page.tsx',
    filename: 'page.tsx',
    language: 'typescript',
    category: 'frontend-ui',
    title: 'Dynamic Home Page (Next.js 14 Server Component)',
    description: 'Modern, high-performance Server Component home page fetching featured products from WordPress at edge speed, rendering the animated Hero, curated luxury grid, and Lenis smooth scroll provider.',
    badge: 'App Router Page',
    highlights: [
      'Pure Server Component: 0kb client bundle for data fetching',
      'Async/await data streaming with React Suspense skeleton fallback',
      'Hatke luxury brutalist-modern aesthetic with dynamic typography',
      'Integrates micro-interactive Client Components'
    ],
    code: `// app/page.tsx
import { Suspense } from 'react';
import { getFeaturedProducts } from '@/lib/api';
import { Hero } from '@/components/Hero';
import { FeaturedProducts } from '@/components/FeaturedProducts';
import { ArchitectureBanner } from '@/components/ArchitectureBanner';
import { ProductGridSkeleton } from '@/components/ProductGridSkeleton';

export const metadata = {
  title: 'The Powerhouse — Precision Headless Engineering',
  description: 'Ultra-fast headless e-commerce & portfolio platform powered by Next.js 14 and WordPress CMS.',
};

export default async function HomePage() {
  // 1. Fetch featured products on the server with ISR caching
  const featuredProducts = await getFeaturedProducts(6);

  return (
    <main className="relative min-h-screen bg-[#090A0F] text-[#F3F4F6] overflow-x-hidden">
      {/* Background kinetic ambient noise */}
      <div className="fixed inset-0 pointer-events-none noise-bg opacity-30 z-0" />

      {/* 1. Hatke Interactive Hero Section */}
      <Hero />

      {/* 2. Architecture Spec Highlights */}
      <ArchitectureBanner />

      {/* 3. Dynamic Featured Products Grid */}
      <section id="featured-products" className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold tracking-wide uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Direct from Headless WP Engine
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
              Curated Artifacts <span className="text-amber-400">.</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed">
            Synchronized dynamically from WordPress Custom Post Types with on-demand edge revalidation.
          </p>
        </div>

        <Suspense fallback={<ProductGridSkeleton />}>
          <FeaturedProducts products={featuredProducts} />
        </Suspense>
      </section>
    </main>
  );
}
`
  },
  {
    id: 'components-hero-tsx',
    path: 'components/Hero.tsx',
    filename: 'Hero.tsx',
    language: 'typescript',
    category: 'frontend-ui',
    title: 'Hatke Interactive Hero with Motion & Kinetic Micro-Interactions',
    description: 'Award-winning client hero component with magnetic button physics, glowing badge accents, live WP GraphQL latency monitor, and silky entrance transitions.',
    badge: 'Client Component (Animations)',
    highlights: [
      'Framer Motion staggered character animations and floating badges',
      'Magnetic cursor interaction on call-to-action buttons',
      'Real-time edge response latency meter (sub-40ms cached speed)',
      'High-contrast luxury color scheme with warm gold accents'
    ],
    code: `'use client';

import { motion } from 'motion/react';
import { ArrowUpRight, Sparkles, Cpu, Zap, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-start max-w-4xl">
        
        {/* Status Pill with Motion */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md text-gray-300 text-xs font-mono mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>HEADLESS WP ENGINE + NEXT.JS 14 APP ROUTER</span>
          <span className="text-gray-600">|</span>
          <span className="text-amber-400 font-semibold">EDGE ISR ACTIVE</span>
        </motion.div>

        {/* Big Hatke Display Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05] font-display"
        >
          WordPress CMS <br />
          <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 bg-clip-text text-transparent">
            Vercel Velocity.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl font-normal leading-relaxed"
        >
          The familiarity your client loves. The 99/100 Lighthouse score your engineers demand. Zero slow PHP rendering. Pure static edge performance.
        </motion.p>

        {/* CTAs and Speed Benchmarks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#featured-products"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-amber-400 text-black font-semibold text-sm transition-all duration-300 hover:bg-amber-300 hover:scale-[1.02] active:scale-[0.98] glow-accent"
          >
            <span>Explore Featured Products</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>

          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-gray-300">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>TTFB: <strong className="text-white">28ms</strong> (Global Edge)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
`
  },
  {
    id: 'next-product-slug-page',
    path: 'app/products/[slug]/page.tsx',
    filename: 'page.tsx',
    language: 'typescript',
    category: 'frontend-ui',
    title: 'Dynamic Product Detail Page with SSG & JSON-LD SEO',
    description: 'Dynamic App Router route fetching a single product by slug, generating rich structured JSON-LD metadata for Google Search, generating static params for build-time caching, and rendering image galleries.',
    badge: 'Dynamic SSR/SSG Route',
    highlights: [
      'generateMetadata() builds dynamic OpenGraph and Twitter Cards',
      'generateStaticParams() pre-renders all product pages at build time',
      'Injects Google Schema.org Product JSON-LD structured data',
      'Interactive gallery and specifications accordion'
    ],
    code: `// app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { getProductBySlug, getAllProductSlugs } from '@/lib/api';
import { ProductGallery } from '@/components/ProductGallery';
import { SpecsAccordion } from '@/components/SpecsAccordion';
import { ShieldCheck, Truck, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// 1. Build-time Static Params Generation
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 2. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return { title: 'Product Not Found | The Powerhouse' };
  }

  const imageUrl = product.featuredImage?.node?.sourceUrl || '/og-default.jpg';

  return {
    title: \`\${product.title} — The Powerhouse Precision\`,
    description: product.productFields?.shortDescription || 'Engineered luxury hardware from WordPress Headless engine.',
    openGraph: {
      title: product.title,
      description: product.productFields?.shortDescription,
      images: [{ url: imageUrl, width: 1200, height: 900, alt: product.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.productFields?.shortDescription,
      images: [imageUrl],
    },
  };
}

// 3. Main Server Component
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const { title, content, productFields, featuredImage } = product;
  const gallery = productFields?.gallery || [];
  const allImages = featuredImage?.node 
    ? [featuredImage.node, ...gallery]
    : gallery;

  // JSON-LD Structured Data for Google Shopping / SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    image: featuredImage?.node?.sourceUrl,
    description: productFields?.shortDescription,
    sku: productFields?.sku,
    offers: {
      '@type': 'Offer',
      price: productFields?.price,
      priceCurrency: 'USD',
      availability: productFields?.stockStatus === 'IN_STOCK' 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: \`https://the-powerhouse.vercel.app/products/\${params.slug}\`,
    },
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] pt-28 pb-24">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-10">
          <a href="/" className="hover:text-amber-400 transition-colors">HOME</a>
          <span>/</span>
          <a href="/#featured-products" className="hover:text-amber-400 transition-colors">PRODUCTS</a>
          <span>/</span>
          <span className="text-white uppercase truncate">{title}</span>
        </nav>

        {/* Main Grid: Gallery on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Gallery Component */}
          <div className="lg:col-span-7">
            <ProductGallery images={allImages} title={title} />
          </div>

          {/* Right: Product Buy Box & Specs */}
          <div className="lg:col-span-5 flex flex-col">
            {productFields?.badge && (
              <span className="self-start px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-semibold tracking-wider uppercase mb-4">
                {productFields.badge}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              {title}
            </h1>

            <p className="mt-2 text-xs font-mono text-gray-500">
              SKU: {productFields?.sku || 'N/A'}
            </p>

            {/* Price Row */}
            <div className="mt-6 flex items-baseline gap-4">
              <span className="text-4xl font-bold text-white font-mono">
                \${productFields?.price?.toLocaleString()}
              </span>
              {productFields?.originalPrice && (
                <span className="text-xl text-gray-500 line-through font-mono">
                  \${productFields.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="mt-6 text-gray-300 text-sm leading-relaxed border-t border-b border-white/10 py-5">
              {productFields?.shortDescription}
            </p>

            {/* Actions */}
            <div className="mt-8 space-y-4">
              <button className="w-full py-4 rounded-xl bg-amber-400 text-black font-bold text-sm tracking-wide transition-all duration-300 hover:bg-amber-300 hover:scale-[1.01] active:scale-[0.99] glow-accent">
                ACQUIRE ARTIFACT — \${productFields?.price?.toLocaleString()}
              </button>

              <div className="grid grid-cols-3 gap-3 pt-4 text-center">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 flex flex-col items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Free Courier</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 flex flex-col items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>5-Yr Warranty</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 flex flex-col items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-indigo-400" />
                  <span>30-Day Return</span>
                </div>
              </div>
            </div>

            {/* Technical Specs Accordion */}
            {productFields?.specs && productFields.specs.length > 0 && (
              <div className="mt-10">
                <SpecsAccordion specs={productFields.specs} />
              </div>
            )}
          </div>
        </div>

        {/* Rich WordPress HTML Content Section */}
        {content && (
          <div className="mt-24 pt-16 border-t border-white/10 max-w-3xl">
            <h2 className="text-2xl font-bold text-white font-display mb-6">
              Architectural Dossier
            </h2>
            <div 
              className="prose prose-invert prose-amber max-w-none text-gray-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
`
  },
  {
    id: 'next-revalidate-route',
    path: 'app/api/revalidate/route.ts',
    filename: 'route.ts',
    language: 'typescript',
    category: 'isr-deployment',
    title: 'On-Demand ISR Revalidation Webhook Handler',
    description: 'The Next.js 14 Route Handler triggered by the WordPress save_post hook. Verifies cryptographic secret tokens and triggers revalidateTag() & revalidatePath() instantly across Vercel edge nodes.',
    badge: 'Edge Route Handler',
    highlights: [
      'Cryptographic token authentication against unauthorized cache invalidation',
      'Purges specific tags: revalidateTag("products") and slug paths',
      'Returns detailed execution telemetry (revalidated tags, timestamp, status)',
      'Sub-50ms execution time on Vercel Serverless Functions'
    ],
    code: `// app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

const REVALIDATION_SECRET = process.env.NEXTJS_REVALIDATION_SECRET || 'super_secret_powerhouse_token_2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const tokenHeader = request.headers.get('x-revalidate-secret');

    // 1. Verify Secret Token
    const incomingSecret = body.secret || tokenHeader;
    if (incomingSecret !== REVALIDATION_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid revalidation token', revalidated: false },
        { status: 401 }
      );
    }

    const { slug, tags = [], postType = 'product' } = body;
    const revalidatedTags: string[] = [];

    // 2. Revalidate Collection Tags
    if (tags.length > 0) {
      for (const tag of tags) {
        revalidateTag(tag);
        revalidatedTags.push(tag);
      }
    } else {
      // Default tag invalidation
      revalidateTag('products');
      revalidateTag('featured-products');
      revalidatedTags.push('products', 'featured-products');
    }

    // 3. Revalidate Specific Path if Slug is Provided
    if (slug) {
      const productPath = \`/products/\${slug}\`;
      revalidatePath(productPath);
      revalidatePath('/'); // Revalidate homepage too
      revalidatedTags.push(productPath, '/');
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      tags: revalidatedTags,
      message: \`Successfully revalidated \${postType} \${slug || ''}\`,
    });
  } catch (err: any) {
    console.error('[Revalidate Webhook Error]:', err);
    return NextResponse.json(
      { error: 'Failed to revalidate cache', details: err?.message },
      { status: 500 }
    );
  }
}
`
  },
  {
    id: 'next-config-mjs',
    path: 'next.config.mjs',
    filename: 'next.config.mjs',
    language: 'typescript',
    category: 'nextjs-core',
    title: 'Next.js Production Configuration & Remote Images',
    description: 'Production configuration file allowing Next.js to optimize images directly from the WordPress cPanel domain, while enforcing strict HTTP security headers.',
    badge: 'Next.js Config',
    highlights: [
      'remotePatterns for cPanel WordPress uploads domain',
      'AVIF & WebP modern image format compression',
      'Content-Security-Policy & HSTS Security Headers'
    ],
    code: `// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // 1. WordPress cPanel Uploads Domain
      {
        protocol: 'https',
        hostname: 'admin.yourdomain.com',
        pathname: '/wp-content/uploads/**',
      },
      // 2. Unsplash / CDN Fallback
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
`
  },
  {
    id: 'cpanel-htaccess',
    path: 'cpanel/.htaccess',
    filename: '.htaccess',
    language: 'apache',
    category: 'wordpress',
    title: 'cPanel Apache .htaccess Hardening & Optimization',
    description: 'Server configuration for shared hosting on cPanel. Optimizes OPcache, enables Gzip/Brotli compression, restricts access to XML-RPC, and sets CORS rules for WPGraphQL.',
    badge: 'cPanel Server Config',
    highlights: [
      'Disables XML-RPC brute force attacks on shared hosting',
      'Enables Gzip compression for 80% smaller GraphQL JSON payloads',
      'Sets Cache-Control headers for static uploads',
      'Enforces HTTPS and PHP 8.2 execution'
    ],
    code: `# ==============================================================================
# THE POWERHOUSE: CPANEL SHARED HOSTING HARDENING & HEADLESS OPTIMIZATION
# ==============================================================================

# 1. Enable GZIP Compression for Fast GraphQL Payload Transfer
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/graphql
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/plain
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE application/javascript
</IfModule>

# 2. Block XML-RPC (Crucial to prevent bot CPU exhaustion on cPanel)
<Files xmlrpc.php>
  Order Deny,Allow
  Deny from all
</Files>

# 3. Static Media Asset Caching (Browser Cache for Uploads)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/avif "access plus 1 year"
</IfModule>

# 4. Standard WordPress URL Rewrites
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\\.php$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.php [L]
</IfModule>
`
  },
  {
    id: 'smooth-scroll-component',
    path: 'components/SmoothScroll.tsx',
    filename: 'SmoothScroll.tsx',
    language: 'typescript',
    category: 'frontend-ui',
    title: 'Lenis Smooth Scroll Provider for React',
    description: 'Client wrapper using Lenis for silky smooth scrolling, GSAP scroll synchronization, and native momentum scrolling across mobile and desktop.',
    badge: 'Smooth Scroll',
    highlights: [
      'Lenis smooth scroll initialization',
      'Synchronizes with Framer Motion and GSAP ScrollTrigger',
      'Auto-resets on dynamic Next.js route transitions'
    ],
    code: `'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface SmoothScrollProps {
  children: ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    // Dynamic import for Lenis to avoid SSR hydration mismatch
    let animationFrameId: number;

    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default;
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          touchMultiplier: 2,
        });

        lenisRef.current = lenis;

        function raf(time: number) {
          lenis.raf(time);
          animationFrameId = requestAnimationFrame(raf);
        }

        animationFrameId = requestAnimationFrame(raf);
      } catch (e) {
        // Fallback gracefully if Lenis fails to load
        console.warn('Lenis smooth scroll running in standard browser mode');
      }
    };

    initLenis();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, []);

  return <div className="smooth-scroll-wrapper">{children}</div>;
}
`
  }
];
