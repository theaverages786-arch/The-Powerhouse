import { ProductItem } from '../types';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_1',
    databaseId: 101,
    title: 'AERO-X9 Titanium Chronograph',
    slug: 'aero-x9-titanium-chronograph',
    date: '2026-08-15T10:00:00Z',
    content: `
      <p>Engineered for high-velocity precision, the <strong>AERO-X9 Chronograph</strong> is milled from a monolithic block of aerospace-grade Grade 5 Titanium.</p>
      <h3>Kinetic Micro-Architecture</h3>
      <p>Featuring a skeletonized dial with DLC (Diamond-Like Carbon) coating, dual anti-reflective sapphire crystals, and a custom flyback mechanical movement calibrated to ±1.5 sec/day.</p>
      <ul>
        <li>SuperLuminova BGW9 indices for 12-hour low-light luminescence</li>
        <li>Integrated quick-release FKM vulcanized rubber & titanium link straps</li>
        <li>Water resistance up to 300 meters (30 ATM)</li>
      </ul>
    `,
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
        altText: 'AERO-X9 Titanium Chronograph front view on dark granite',
        mediaDetails: { width: 1200, height: 900 }
      }
    },
    productFields: {
      price: 2450,
      originalPrice: 2800,
      isFeatured: true,
      badge: 'LIMITED EDITION (100 PCS)',
      sku: 'AX9-TI-01',
      stockStatus: 'IN_STOCK',
      shortDescription: 'Monolithic Grade 5 Titanium skeleton timepiece with flyback chronograph calibre.',
      material: 'Aerospace Grade 5 Titanium / Sapphire / DLC Coating',
      shippingInfo: 'Complimentary insured worldwide courier shipping within 48h.',
      specs: [
        { label: 'Case Diameter', value: '41.5 mm' },
        { label: 'Thickness', value: '11.8 mm' },
        { label: 'Power Reserve', value: '72 Hours' },
        { label: 'Water Resistance', value: '30 ATM / 300M' },
        { label: 'Movement', value: 'Calibre VX-9 Skeletonized Flyback' }
      ],
      gallery: [
        {
          id: 'gal_1',
          sourceUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
          altText: 'AERO-X9 Dial Detail',
          title: 'Skeletonized Dial'
        },
        {
          id: 'gal_2',
          sourceUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
          altText: 'Titanium Bezel and Crown',
          title: 'Crown & Pusher Machining'
        },
        {
          id: 'gal_3',
          sourceUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1200&q=80',
          altText: 'Exhibition Caseback',
          title: 'Rotor & Movement Details'
        }
      ]
    },
    productCategories: {
      nodes: [
        { name: 'Horology', slug: 'horology' },
        { name: 'Titanium Hardware', slug: 'titanium-hardware' }
      ]
    },
    productTags: {
      nodes: [
        { name: 'Skeleton', slug: 'skeleton' },
        { name: 'Aerospace', slug: 'aerospace' },
        { name: 'Featured', slug: 'featured' }
      ]
    }
  },
  {
    id: 'prod_2',
    databaseId: 102,
    title: 'VALKYRIE Spatial Planar Headphones',
    slug: 'valkyrie-spatial-planar-headphones',
    date: '2026-08-10T14:30:00Z',
    content: `
      <p>The <strong>VALKYRIE Spatial Planar</strong> system represents an acoustic breakthrough for audiophiles and mastering engineers.</p>
      <h3>Ultra-Thin Nanometer Diaphragm</h3>
      <p>Using 98mm ultra-thin planar magnetic drivers wrapped in open-back anodized magnesium chambers, delivering an ultra-wide frequency response from 4Hz to 52,000Hz with zero distortion.</p>
      <ul>
        <li>Precision CNC milled magnesium cups with lambskin memory foam ear cushions</li>
        <li>Custom 8-core monocrystalline silver-plated balanced 4.4mm cable included</li>
        <li>Optimized acoustic impedance for both desktop DACs and portable amps</li>
      </ul>
    `,
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
        altText: 'VALKYRIE Spatial Planar Headphones floating perspective',
        mediaDetails: { width: 1200, height: 900 }
      }
    },
    productFields: {
      price: 1890,
      isFeatured: true,
      badge: 'ARCHITECT AUDIO CHOICE',
      sku: 'VK-PLN-88',
      stockStatus: 'LOW_STOCK',
      shortDescription: '98mm Planar Magnetic open-back studio reference monitor headphones with magnesium chassis.',
      material: 'Anodized Magnesium Alloy, Carbon Fiber Headband, Lambskin Cushions',
      shippingInfo: 'Custom aluminum flight case included. Ships next business day.',
      specs: [
        { label: 'Driver Type', value: '98mm Nanometer Planar Magnetic' },
        { label: 'Frequency Response', value: '4 Hz – 52 kHz' },
        { label: 'Impedance', value: '38 Ohms' },
        { label: 'THD Distortion', value: '< 0.03% @ 1kHz 100dB' },
        { label: 'Weight', value: '375 grams' }
      ],
      gallery: [
        {
          id: 'gal_4',
          sourceUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
          altText: 'Planar Driver Chamber',
          title: 'Magnesium Open-Back Grill'
        },
        {
          id: 'gal_5',
          sourceUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
          altText: 'Ergonomic lambskin cushions',
          title: 'Comfort Ear Pads'
        }
      ]
    },
    productCategories: {
      nodes: [
        { name: 'Audio Hardware', slug: 'audio-hardware' },
        { name: 'Studio Reference', slug: 'studio-reference' }
      ]
    },
    productTags: {
      nodes: [
        { name: 'Planar', slug: 'planar' },
        { name: 'Audiophile', slug: 'audiophile' },
        { name: 'Featured', slug: 'featured' }
      ]
    }
  },
  {
    id: 'prod_3',
    databaseId: 103,
    title: 'NEXUS-65 Custom Kinetic Keyboard',
    slug: 'nexus-65-custom-kinetic-keyboard',
    date: '2026-08-01T09:15:00Z',
    content: `
      <p>A tactile masterpiece. <strong>NEXUS-65</strong> integrates an isolated silicone leaf-spring gasket suspension with brass weight bars and per-key haptic feedback.</p>
      <h3>Cerakote E-White & Copper Weight</h3>
      <p>Precision-milled from 6063 Aluminum, hand-finished with an ultra-durable micro-textured Cerakote coating and mirror-polished copper back accent plate.</p>
    `,
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
        altText: 'NEXUS-65 Custom Mechanical Keyboard with custom keycaps',
        mediaDetails: { width: 1200, height: 900 }
      }
    },
    productFields: {
      price: 640,
      originalPrice: 720,
      isFeatured: true,
      badge: 'TOP SELLER',
      sku: 'NX65-CER-01',
      stockStatus: 'IN_STOCK',
      shortDescription: 'Leaf-spring gasket mounted 65% mechanical keyboard with mirror copper weight and hot-swap PCB.',
      material: '6063 Aluminum, Polished Pure Copper, FR4 Plate, Poron Foam',
      shippingInfo: 'Pre-assembled with factory-lubed custom Holy Panda X switches.',
      specs: [
        { label: 'Layout', value: '65% Compact (68 Keys)' },
        { label: 'Mounting Style', value: 'Isolated Leaf Spring Gasket' },
        { label: 'Typing Angle', value: '7.5 Degrees' },
        { label: 'Polling Rate', value: '8000 Hz Ultra-Low Latency' },
        { label: 'Connectivity', value: 'USB-C / 2.4Ghz Wireless / BT 5.3' }
      ],
      gallery: [
        {
          id: 'gal_6',
          sourceUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
          altText: 'NEXUS-65 Top View',
          title: 'Top Down Aesthetic'
        },
        {
          id: 'gal_7',
          sourceUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80',
          altText: 'Side Profile and Copper Accent',
          title: 'Side Chamfer'
        }
      ]
    },
    productCategories: {
      nodes: [
        { name: 'Peripherals', slug: 'peripherals' },
        { name: 'Custom Input', slug: 'custom-input' }
      ]
    },
    productTags: {
      nodes: [
        { name: 'Mechanical', slug: 'mechanical' },
        { name: 'Custom Keyboard', slug: 'custom-keyboard' },
        { name: 'Featured', slug: 'featured' }
      ]
    }
  },
  {
    id: 'prod_4',
    databaseId: 104,
    title: 'OBSIDIAN RAW Minimalist Deskpad',
    slug: 'obsidian-raw-minimalist-deskpad',
    date: '2026-07-28T16:00:00Z',
    content: `
      <p>Crafted from full-grain Tuscan vegetable-tanned leather, backed with high-density natural Portuguese wool felt. Over time, it develops a deep, rich patina unique to your workspace.</p>
    `,
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
        altText: 'OBSIDIAN RAW desk organizer and leather deskpad',
        mediaDetails: { width: 1200, height: 900 }
      }
    },
    productFields: {
      price: 185,
      isFeatured: false,
      badge: 'NATURAL PATINA',
      sku: 'OBS-PAD-BLK',
      stockStatus: 'IN_STOCK',
      shortDescription: 'Full-grain Tuscan vegetable-tanned leather deskpad with merino wool felt base.',
      material: 'Vegetable-Tanned Cowhide, 100% Merino Wool Felt Base',
      shippingInfo: 'Ships rolled in protective canvas storage cylinder.',
      specs: [
        { label: 'Dimensions', value: '900 x 400 mm' },
        { label: 'Leather Thickness', value: '2.2 mm' },
        { label: 'Edge Treatment', value: 'Hand-burnished with natural beeswax' },
        { label: 'Origin', value: 'Florence, Italy' }
      ],
      gallery: [
        {
          id: 'gal_8',
          sourceUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80',
          altText: 'Deskpad texture in ambient light',
          title: 'Leather Texture'
        }
      ]
    },
    productCategories: {
      nodes: [
        { name: 'Workspace', slug: 'workspace' }
      ]
    },
    productTags: {
      nodes: [
        { name: 'Leather', slug: 'leather' },
        { name: 'Desk Setup', slug: 'desk-setup' }
      ]
    }
  },
  {
    id: 'prod_5',
    databaseId: 105,
    title: 'KINESIS-7 Sculpted Ergonomic Trackball',
    slug: 'kinesis-7-sculpted-ergonomic-trackball',
    date: '2026-07-20T11:45:00Z',
    content: `
      <p>Designed with orthopedic physical therapists, the <strong>KINESIS-7</strong> aligns your forearm into a neutral 34-degree posture while providing pixel-perfect 12,000 DPI laser ball tracking.</p>
    `,
    featuredImage: {
      node: {
        sourceUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
        altText: 'Sculpted black ergonomic hardware peripheral',
        mediaDetails: { width: 1200, height: 900 }
      }
    },
    productFields: {
      price: 310,
      originalPrice: 350,
      isFeatured: true,
      badge: 'ERGONOMIC MASTER',
      sku: 'KN7-TRK-01',
      stockStatus: 'IN_STOCK',
      shortDescription: '34-degree natural wrist posture ergonomic optical trackball with titanium bearings.',
      material: 'Recycled Polycarbonate, Synthetic Ruby Bearings, Soft-Touch Matte Coat',
      shippingInfo: 'Includes magnetic angle wedges (-10°, 0°, +20°).',
      specs: [
        { label: 'Sensor', value: 'PixArt PMW3389 Optical' },
        { label: 'DPI Range', value: '200 – 12,000 DPI' },
        { label: 'Battery Life', value: '120 Days via USB-C' },
        { label: 'Angle', value: '34° Anatomical Neutral' }
      ],
      gallery: [
        {
          id: 'gal_9',
          sourceUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
          altText: 'Kinesis trackball in workspace',
          title: 'Grip Profile'
        }
      ]
    },
    productCategories: {
      nodes: [
        { name: 'Peripherals', slug: 'peripherals' },
        { name: 'Ergonomics', slug: 'ergonomics' }
      ]
    },
    productTags: {
      nodes: [
        { name: 'Ergonomic', slug: 'ergonomic' },
        { name: 'Featured', slug: 'featured' }
      ]
    }
  }
];
