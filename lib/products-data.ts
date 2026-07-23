export type ProductColor = {
  name: string;
  bg: string;
  border?: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductDetailItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  rating: number;
  reviewsCount: string;
  description: string;
  colors: ProductColor[];
  features: string[];
  specs: ProductSpec[];
  shippingNotice: string;
  mainImage: string;
};

export const productsCatalog: Record<string, ProductDetailItem> = {
  "yuqos-neosound-flex": {
    id: "yuqos-neosound-flex",
    slug: "yuqos-neosound-flex",
    name: "Yuqos Neosound Flex",
    category: "Home Speaker",
    categorySlug: "speakers",
    price: "₹54,200",
    oldPrice: "₹69,999",
    discount: "23% off",
    rating: 4.9,
    reviewsCount: "9.2K Reviews",
    description:
      "A true masterpiece in audio innovation and design. Crafted with precision, it seamlessly blends cutting-edge technology with exceptional aesthetics. Immerse yourself in rich, pure sound, elevating your audio experience.",
    colors: [
      { name: "Black Wood", bg: "#1e1e24" },
      { name: "Deep Violet", bg: "#362b53" },
      { name: "Soft Silver", bg: "#d2d5dc" },
    ],
    features: [
      "Connect with Google Assistance & Siri",
      "Dolby Atmos Engine",
      "Aesthetics Wood Design",
    ],
    specs: [
      { label: "Audio Output", value: "80W RMS Studio Sound" },
      { label: "Connectivity", value: "WiFi 6 + Bluetooth 5.4" },
      { label: "Battery Life", value: "18 Hours Playback" },
      { label: "Material", value: "Precision Dark Oak & Mesh" },
    ],
    shippingNotice: "Free 2-day shipping and 90 day risk free trial",
    mainImage: "/category-speaker.png",
  },
  "wireless-headphones": {
    id: "wireless-headphones",
    slug: "wireless-headphones",
    name: "Wireless Headphones",
    category: "Audio",
    categorySlug: "headphones",
    price: "₹1,799",
    oldPrice: "₹6,999",
    discount: "74% off",
    rating: 4.8,
    reviewsCount: "4.5K Reviews",
    description:
      "Immersive over-ear wireless headphones with ultra-soft memory foam cushions, crystal-clear vocal reproduction, and active noise cancellation for music, gaming, and calls.",
    colors: [
      { name: "Saddle Brown", bg: "#6d4c41" },
      { name: "Matte Black", bg: "#1a1a1a" },
      { name: "Silver Metal", bg: "#b0bec5" },
    ],
    features: [
      "Active Noise Cancellation (ANC)",
      "40 Hours Continuous Playback",
      "Ergonomic Memory Foam Earcups",
    ],
    specs: [
      { label: "Driver Size", value: "40mm Dynamic Neodymium" },
      { label: "Connectivity", value: "Bluetooth 5.4 + 3.5mm Aux" },
      { label: "Fast Charging", value: "10 min charge = 5 hours" },
    ],
    shippingNotice: "Free express shipping across India & 1-Year Warranty",
    mainImage: "/category-headphones.png",
  },
  "compact-camera": {
    id: "compact-camera",
    slug: "compact-camera",
    name: "Compact Camera",
    category: "Cameras",
    categorySlug: "cameras",
    price: "₹9,699",
    oldPrice: "₹29,999",
    discount: "67% off",
    rating: 4.7,
    reviewsCount: "3.1K Reviews",
    description:
      "A portable compact camera designed for creators and travelers. Featuring a bright f/1.8 optical zoom lens, tactile metallic control dials, and 4K video recording.",
    colors: [
      { name: "Silver & Black", bg: "#424242" },
      { name: "Midnight Onyx", bg: "#212121" },
    ],
    features: [
      "4K Ultra HD Video at 60fps",
      "Sony STARVIS CMOS Sensor",
      "Fast AI Autofocus & Face Detect",
    ],
    specs: [
      { label: "Sensor", value: '1.0" Stacked CMOS' },
      { label: "Lens", value: "24-70mm f/1.8-2.8 Zoom" },
      { label: "Screen", value: '3.0" Flip-touch LCD' },
    ],
    shippingNotice: "Free 2-day delivery with protective case included",
    mainImage: "/category-camera.png",
  },
  "smartphone": {
    id: "smartphone",
    slug: "smartphone",
    name: "Smartphone",
    category: "Smartphones",
    categorySlug: "smartphones",
    price: "₹8,499",
    oldPrice: "₹14,999",
    discount: "43% off",
    rating: 4.6,
    reviewsCount: "6.8K Reviews",
    description:
      "A sleek flagship smartphone featuring an edge-to-edge AMOLED display, multi-lens AI camera array, and all-day fast-charging battery performance.",
    colors: [
      { name: "Titanium Silver", bg: "#cfd8dc" },
      { name: "Graphite Gray", bg: "#37474f" },
      { name: "Deep Cobalt", bg: "#1a237e" },
    ],
    features: [
      '6.5" 120Hz Fluid AMOLED Display',
      "50MP OIS AI Triple Camera",
      "5000mAh Battery with 67W Super Charge",
    ],
    specs: [
      { label: "Processor", value: "Octa-core 4nm Processor" },
      { label: "RAM / Storage", value: "8GB RAM + 128GB Storage" },
      { label: "OS", value: "Android 14 with Custom UI" },
    ],
    shippingNotice: "Includes free screen protector and 1-year brand warranty",
    mainImage: "/category-smartphone.png",
  },
  "55-smart-tv": {
    id: "55-smart-tv",
    slug: "55-smart-tv",
    name: "XElectron 55 Inch LED TV",
    category: "Smart TVs",
    categorySlug: "tv",
    price: "₹29,999",
    oldPrice: "₹49,999",
    discount: "40% off",
    rating: 4.8,
    reviewsCount: "1.2K Reviews",
    description:
      "Immerse yourself in breathtaking 4K HDR entertainment with ultra-thin bezels, Dolby Vision color accuracy, and built-in Smart Android TV apps.",
    colors: [{ name: "Metallic Black", bg: "#111111" }],
    features: [
      "4K Ultra HD Resolution (3840×2160)",
      "Dolby Audio 30W Sound Output",
      "Official Android TV with Google Assistant",
    ],
    specs: [
      { label: "Display Size", value: '55 Inch (139 cm)' },
      { label: "Refresh Rate", value: "60Hz Motion Clarity" },
      { label: "Ports", value: "3 HDMI + 2 USB + Optical" },
    ],
    shippingNotice: "Free home delivery & professional wall-mount installation",
    mainImage: "/product-tv-card.png",
  },
  "c9-projector": {
    id: "c9-projector",
    slug: "c9-projector",
    name: "XElectron Android C9 Plus",
    category: "Projectors",
    categorySlug: "projectors",
    price: "₹10,990",
    oldPrice: "₹19,999",
    discount: "45% off",
    rating: 4.7,
    reviewsCount: "960 Reviews",
    description:
      "Transform your living room into a private theater with the Android C9 Plus home projector. Full HD native resolution, Android apps, and high contrast brightness.",
    colors: [{ name: "Midnight Black", bg: "#1e1e1e" }],
    features: [
      "Native 1080p Full HD Resolution",
      "Built-in Android OS with Netflix & Prime",
      "Automatic Keystone & Electric Focus",
    ],
    specs: [
      { label: "Brightness", value: "4800 Lumens" },
      { label: "Max Screen", value: 'Up to 200" Screen' },
      { label: "Lamp Life", value: "50,000 Hours LED" },
    ],
    shippingNotice: "Free 2-day delivery & 1-Year replacement warranty",
    mainImage: "/product-c9-card.png",
  },
  "techno-projector": {
    id: "techno-projector",
    slug: "techno-projector",
    name: "XElectron Techno Android",
    category: "Projectors",
    categorySlug: "projectors",
    price: "₹6,990",
    oldPrice: "₹21,999",
    discount: "68% off",
    rating: 4.6,
    reviewsCount: "740 Reviews",
    description:
      "Compact portable Android projector designed for easy mobility, ceiling projection, and wireless smartphone screen mirroring.",
    colors: [{ name: "Pure White", bg: "#f5f5f5" }],
    features: [
      "180° Rotating Gimbal Stand",
      "WiFi 6 Screen Mirroring",
      "Quiet Cooling & Low Noise",
    ],
    specs: [
      { label: "Resolution", value: "720p HD Native (1080p Support)" },
      { label: "Speaker", value: "Dual 5W Surround Speaker" },
      { label: "Weight", value: "0.9 kg Portable" },
    ],
    shippingNotice: "Free delivery with remote control & power adapter",
    mainImage: "/product-white-projector-card.png",
  },
  "iprojector-2-plus": {
    id: "iprojector-2-plus",
    slug: "iprojector-2-plus",
    name: "XElectron IProjector 2 Plus",
    category: "Projectors",
    categorySlug: "projectors",
    price: "₹17,990",
    oldPrice: "₹39,999",
    discount: "55% off",
    rating: 4.9,
    reviewsCount: "1.4K Reviews",
    description:
      "Premium 4K-supported smart projector featuring ultra-bright LED optics, Harman-tuned speakers, and dual-band 5G Wi-Fi connectivity.",
    colors: [{ name: "Space Gray", bg: "#373737" }],
    features: [
      "Real 1080p Native (4K Playback Support)",
      "Auto Focus & Obstacle Avoidance",
      "HiFi 10W Stereo Sound System",
    ],
    specs: [
      { label: "Lumens", value: "7500 LED Lumens" },
      { label: "Aspect Ratio", value: "16:9 / 4:3 Native" },
      { label: "Connectivity", value: "HDMI 2.0, USB, Audio Out" },
    ],
    shippingNotice: "Free express delivery & 2-Year warranty included",
    mainImage: "/product-black-projector-card.png",
  },
  "24stv": {
    id: "24stv",
    slug: "24stv",
    name: "XElectron 24 Inch HD Ready LED TV",
    category: "LED TVs",
    categorySlug: "tv",
    price: "₹6,499",
    oldPrice: "₹12,999",
    discount: "50% off",
    rating: 4.2,
    reviewsCount: "94 Reviews",
    description:
      "A compact HD ready LED TV for bedrooms, study rooms, and small living spaces with a clean picture and easy daily viewing.",
    colors: [{ name: "Matte Black", bg: "#111111" }],
    features: [
      "HD Ready Display",
      "Energy Efficient Panel",
      "Simple Plug-and-Play Setup",
    ],
    specs: [
      { label: "Display Size", value: '24 Inch (61 cm)' },
      { label: "Panel Type", value: "LED" },
      { label: "Ports", value: "HDMI + USB" },
    ],
    shippingNotice: "Free delivery with standard installation support",
    mainImage: "https://www.xelectron.com/wp-content/uploads/2023/04/Untitled-1-600x600.jpg",
  },
  "15-dpf": {
    id: "15-dpf",
    slug: "15-dpf",
    name: "XElectron 15.6 Inch Digital Photo Frame",
    category: "Digital Photo Frames",
    categorySlug: "digital-photo-frames",
    price: "₹8,499",
    oldPrice: "₹14,999",
    discount: "43% off",
    rating: 4.4,
    reviewsCount: "76 Reviews",
    description:
      "A bright WiFi-enabled digital photo frame for showcasing memories, artwork, and slideshows in a clean tabletop format.",
    colors: [
      { name: "Classic Black", bg: "#1a1a1a" },
      { name: "Soft White", bg: "#f5f5f5" },
    ],
    features: [
      "WiFi Photo Sync",
      "Touch Screen Navigation",
      "Auto Slideshow Mode",
    ],
    specs: [
      { label: "Screen", value: '15.6 Inch Full HD' },
      { label: "Connectivity", value: "WiFi + USB" },
      { label: "Orientation", value: "Portrait / Landscape" },
    ],
    shippingNotice: "Free shipping with power adapter included",
    mainImage: "https://www.xelectron.com/wp-content/uploads/2025/06/15.6-inch-DPF-600x600.jpg",
  },
  "32-tv": {
    id: "32-tv",
    slug: "32-tv",
    name: "XElectron 32 Inch HD Ready Smart LED TV",
    category: "LED TVs",
    categorySlug: "tv",
    price: "₹8,999",
    oldPrice: "₹18,999",
    discount: "53% off",
    rating: 4.3,
    reviewsCount: "157 Reviews",
    description:
      "A smart LED TV that balances size and clarity for everyday streaming, TV shows, and casual gaming.",
    colors: [{ name: "Black", bg: "#101010" }],
    features: [
      "Smart TV Interface",
      "HD Ready Panel",
      "Multiple HDMI and USB Ports",
    ],
    specs: [
      { label: "Display Size", value: '32 Inch (81 cm)' },
      { label: "Resolution", value: "HD Ready" },
      { label: "Speaker", value: "Stereo Sound" },
    ],
    shippingNotice: "Free home delivery and basic installation support",
    mainImage: "https://www.xelectron.com/wp-content/uploads/2023/04/XElectron-32-inch-TVWDa-79IuL._SL1500_-600x600.jpg",
  },
  "8-dpf": {
    id: "8-dpf",
    slug: "8-dpf",
    name: "XElectron 8 Inch IPS Digital Photo Frame",
    category: "Digital Photo Frames",
    categorySlug: "digital-photo-frames",
    price: "₹2,999",
    oldPrice: "₹5,999",
    discount: "50% off",
    rating: 4.0,
    reviewsCount: "203 Reviews",
    description:
      "A compact white digital photo frame for desks, shelves, and bedside tables with crisp image playback.",
    colors: [
      { name: "White", bg: "#f4f4f4" },
      { name: "Beige", bg: "#d9d0c2" },
    ],
    features: [
      "IPS Display",
      "Compact Tabletop Design",
      "Easy Image Playback",
    ],
    specs: [
      { label: "Screen", value: '8 Inch IPS' },
      { label: "Connectivity", value: "USB + Memory Card" },
      { label: "Use Case", value: "Photo Display" },
    ],
    shippingNotice: "Free delivery with desktop stand included",
    mainImage: "https://www.xelectron.com/wp-content/uploads/2023/01/8-inch-DPF-W-600x600.jpg",
  },
};

export type SimilarProductCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  image: string;
  alt: string;
  swatches: string[];
};

const DEFAULT_SIMILAR_ORDER = [
  "55-smart-tv",
  "c9-projector",
  "techno-projector",
  "iprojector-2-plus",
  "wireless-headphones",
  "compact-camera",
  "smartphone",
  "yuqos-neosound-flex",
];

export function getSimilarProducts(currentId?: string, limit = 4): SimilarProductCard[] {
  const values = Object.values(productsCatalog);
  const current = currentId ? productsCatalog[currentId] : undefined;

  const ordered = [
    ...values.filter((product) => product.id !== current?.id && product.categorySlug === current?.categorySlug),
    ...DEFAULT_SIMILAR_ORDER.map((id) => productsCatalog[id]).filter(Boolean),
    ...values,
  ];

  const seen = new Set<string>();
  return ordered
    .filter((product): product is ProductDetailItem => Boolean(product))
    .filter((product) => {
      if (product.id === current?.id) return false;
      if (seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    })
    .slice(0, limit)
    .map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.mainImage,
      alt: product.name,
      swatches: product.colors.map((color) => color.bg).slice(0, 3),
    }));
}

export const defaultProduct = productsCatalog["yuqos-neosound-flex"];

export function getProductById(idOrSlug?: string | null): ProductDetailItem {
  if (!idOrSlug) return defaultProduct;

  const key = idOrSlug.toLowerCase().trim();
  if (productsCatalog[key]) {
    return productsCatalog[key];
  }

  const found = Object.values(productsCatalog).find(
    (p) => p.id.includes(key) || p.slug.includes(key) || p.categorySlug.includes(key)
  );

  return found || defaultProduct;
}
