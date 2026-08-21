export interface ProductACF {
  price: number;
  originalPrice?: number;
  isFeatured: boolean;
  badge?: string;
  sku: string;
  stockStatus: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  shortDescription: string;
  specs: {
    label: string;
    value: string;
  }[];
  gallery: {
    id: string;
    sourceUrl: string;
    altText: string;
    title?: string;
  }[];
  material?: string;
  shippingInfo?: string;
}

export interface ProductItem {
  id: string;
  databaseId: number;
  title: string;
  slug: string;
  date: string;
  content: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  productFields: ProductACF;
  productCategories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  productTags?: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
}

export interface BlueprintFile {
  id: string;
  path: string;
  filename: string;
  language: 'typescript' | 'php' | 'json' | 'apache' | 'bash' | 'markdown' | 'graphql';
  category: 'wordpress' | 'nextjs-core' | 'frontend-ui' | 'isr-deployment';
  title: string;
  description: string;
  badge: string;
  code: string;
  highlights: string[];
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  event: string;
  postId: number;
  postTitle: string;
  tagsPurged: string[];
  status: 'success' | 'pending' | 'failed';
  latencyMs: number;
  signature: string;
}
