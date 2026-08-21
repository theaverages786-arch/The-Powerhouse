export interface PluginItem {
  name: string;
  slug: string;
  category: 'core' | 'custom-fields' | 'security' | 'performance';
  required: boolean;
  version: string;
  description: string;
  cPanelImpact: string;
}

export const WORDPRESS_PLUGINS: PluginItem[] = [
  {
    name: 'WPGraphQL',
    slug: 'wp-graphql',
    category: 'core',
    required: true,
    version: '1.28.0+',
    description: 'Transforms WordPress into a lightning-fast GraphQL server. Exposes custom post types, taxonomies, users, and media in a single structured endpoint.',
    cPanelImpact: 'Zero frontend overhead; queries only requested fields, cutting memory usage by 70% compared to standard PHP themes.'
  },
  {
    name: 'Advanced Custom Fields PRO (ACF Pro)',
    slug: 'advanced-custom-fields-pro',
    category: 'custom-fields',
    required: true,
    version: '6.3.0+',
    description: 'Industry-standard custom fields for Price, is_featured toggles, galleries, specs accordions, and badge overlays with an intuitive UI.',
    cPanelImpact: 'Native database storage; fast query indexed tables.'
  },
  {
    name: 'WPGraphQL for Advanced Custom Fields',
    slug: 'wpgraphql-acf',
    category: 'custom-fields',
    required: true,
    version: '2.3.0+',
    description: 'Automatically exposes ACF field groups directly in the WPGraphQL schema with typed schemas and auto-generated field keys.',
    cPanelImpact: 'No custom SQL queries needed; resolves fields dynamically.'
  },
  {
    name: 'Headless Mode (or Custom mu-plugin)',
    slug: 'headless-mode',
    category: 'core',
    required: true,
    version: '0.4.0+',
    description: 'Disables standard WordPress theme template execution and redirects visitors to the Next.js Vercel frontend via HTTP 301.',
    cPanelImpact: 'Prevents CPU-draining theme rendering and asset compilation on cPanel.'
  },
  {
    name: 'WP Webhooks / Custom Save Hook',
    slug: 'wp-webhooks',
    category: 'performance',
    required: true,
    version: '3.3.0+',
    description: 'Triggers on-demand Next.js ISR cache invalidation when a product is added, updated, or deleted in the admin dashboard.',
    cPanelImpact: 'Non-blocking async HTTP POST; executes in <15ms without slowing down the client editing experience.'
  },
  {
    name: 'WPGraphQL Smart Cache (Optional)',
    slug: 'wpgraphql-smart-cache',
    category: 'performance',
    required: false,
    version: '1.4.0+',
    description: 'Provides Network-level Object caching for GraphQL queries on the cPanel origin server.',
    cPanelImpact: 'Caches query results in Redis or transient cache, dropping cPanel CPU spikes by 85%.'
  }
];

export const WPGRAPHQL_VS_REST_COMPARISON = [
  {
    feature: 'Over-fetching & Payload Size',
    graphql: '🔥 Exact field requests (~4.2 KB per product query). 0% redundant data.',
    restApi: '⚠️ Returns hundreds of unused fields (WP objects, raw author data, rendered HTML) (~48 KB per product). 10x larger payload.',
    verdict: 'WPGraphQL Wins — Crucial for slow cPanel I/O limits.'
  },
  {
    feature: 'Under-fetching & HTTP Roundtrips',
    graphql: '⚡ 1 Single Request fetches Product + Categories + ACF Specs + Gallery Media.',
    restApi: '🐢 Requires 3 to 4 sequential roundtrips (/wp-json/wp/v2/products + /media + /categories).',
    verdict: 'WPGraphQL Wins — Massive reduction in TTFB on shared hosting.'
  },
  {
    feature: 'TypeScript Type Safety',
    graphql: '🛡️ Auto-generates exact TypeScript types from the GraphQL schema using GraphQL Code Generator.',
    restApi: '⚠️ Manual typing required; prone to breaking if client changes custom fields in WP.',
    verdict: 'WPGraphQL Wins — Enterprise stability.'
  },
  {
    feature: 'Edge Caching (Next.js ISR)',
    graphql: '🚀 Integrates seamlessly with Next.js 14 fetch tags (next: { tags: ["products"] }).',
    restApi: '✅ Can be cached, but headers are harder to segment cleanly.',
    verdict: 'WPGraphQL Wins with Next.js App Router.'
  },
  {
    feature: 'cPanel Server Load',
    graphql: '💚 1 lightweight parse execution per revalidation cycle.',
    restApi: '⚠️ Multiple PHP workers spawned per page build.',
    verdict: 'WPGraphQL significantly lighter on shared server RAM.'
  }
];

export const STEP_BY_STEP_CPANEL_GUIDE = [
  {
    step: '1. Setup cPanel Subdomain & PHP 8.2',
    details: 'Create a dedicated subdomain like admin.yourclientdomain.com or cms.yourclientdomain.com. Set PHP version to 8.2 or 8.3 with memory_limit = 256M and max_execution_time = 300 via MultiPHP INI Editor.'
  },
  {
    step: '2. Install WordPress Core & Clean Default Themes',
    details: 'Install a fresh WordPress instance via cPanel Softaculous or WP Toolkit. Delete sample posts, pages, and heavy themes (e.g. Twenty Twenty-Four). Leave a blank 1-file theme or enable headless mode.'
  },
  {
    step: '3. Drop the Must-Use Plugin in wp-content/mu-plugins/',
    details: 'Create the directory /wp-content/mu-plugins/ and upload powerhouse-engine.php. This automatically registers the "Products" post type, custom taxonomies, CORS rules, and the Vercel webhook listener without client interference.'
  },
  {
    step: '4. Configure ACF Pro Field Group',
    details: 'In WP Admin > Custom Fields > Add New: Create "Product Specifications". Add fields: price (Number), is_featured (True/False toggle), badge (Text), gallery (Gallery), specs (Repeater). Set "Show in GraphQL" to ON with GraphQL Field Name: productFields.'
  },
  {
    step: '5. Connect to Vercel Environment Variables',
    details: 'On your Vercel project dashboard, set WORDPRESS_GRAPHQL_ENDPOINT=https://admin.yourclientdomain.com/graphql and NEXTJS_REVALIDATION_SECRET=your_random_64_char_hash.'
  },
  {
    step: '6. Test On-Demand Edge Invalidation',
    details: 'Publish a new Product in WP Admin with is_featured toggled ON. Check your Vercel live site — the product appears instantly across worldwide edge nodes in under 200ms!'
  }
];
