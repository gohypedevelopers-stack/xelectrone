export type NavDropdownItem = {
  label: string;
  items: string[];
};

export type CategoryItem = {
  title: string;
  src: string;
  alt: string;
};

export type ProductItem = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
  price: string;
  oldPrice?: string;
  rating: number;
  reviews: string;
};

export type BestSellerItem = {
  title: string;
  price: string;
  compareAt: string;
  discount: string;
  description: string;
  specs: Array<{ label: string; value: string }>;
  image: string;
  alt: string;
  accent: string;
};

export const dropdownItems: NavDropdownItem[] = [
  {
    label: "PRODUCT",
    items: ["New Arrivals", "Best Sellers", "All Products"],
  },
  {
    label: "WARRANTY",
    items: ["Check Coverage", "Register Product", "Service Status"],
  },
  {
    label: "SUPPORT & SERVICE",
    items: ["Contact Support", "Repair Center", "Downloads"],
  },
];

export const flatItems = ["Home", "About Us", "Contact", "My Account"];

export type BannerItem = {
  src: string;
  mobileSrc?: string;
  alt: string;
  title: string;
  category?: string;
  caption?: string;
  cta?: string;
  linkUrl?: string;
};

export const banners: BannerItem[] = [
  {
    src: "/hero-banner-projector-c9.png",
    mobileSrc: "/hero-banner-projector-c9-mobile.jpg",
    alt: "XElectron Android C9 Plus projector banner",
    title: "Android C9 Plus",
    category: "Projector",
    caption: "Smart Cinema • Full HD 1080p",
    cta: "Shop now",
    linkUrl: "/shop",
  },
  {
    src: "/hero-banner-techno-projector.png",
    mobileSrc: "/hero-banner-techno-projector-mobile.jpg",
    alt: "XElectron Techno Android Projector banner",
    title: "Techno Android",
    category: "Projector",
    caption: "Portable • Crystal Clear Display",
    cta: "Explore now",
    linkUrl: "/shop",
  },
  {
    src: "/hero-banner-tv.png",
    mobileSrc: "/hero-banner-tv-mobile.jpg",
    alt: "XElectron 55 Inch LED TV banner",
    title: "55 Inch LED TV",
    category: "Smart TV",
    caption: "Big Screen • Bright Detail",
    cta: "View TV",
    linkUrl: "/shop",
  },
];

export const categories: CategoryItem[] = [
  {
    title: "Smart Projectors",
    src: "/category-projector.png",
    alt: "Smart Projectors category",
  },
  {
    title: "Digital Photo Frames",
    src: "/category-frame.png",
    alt: "Digital Photo Frames category",
  },
  {
    title: "LED Televisions & Smart Displays",
    src: "/category-tv.png",
    alt: "LED Televisions & Smart Displays category",
  },
  {
    title: "Portable Monitors",
    src: "/category-monitor.png",
    alt: "Portable Monitors category",
  },
];

export const products: ProductItem[] = [
  {
    id: "55-smart-tv",
    title: "XElectron 55 Inch LED TV",
    subtitle: "Premium picture. Big screen impact.",
    image: "/product-tv-card.png",
    alt: "XElectron 55 inch LED TV",
    price: "₹29,999.00",
    oldPrice: "₹49,999.00",
    rating: 4.8,
    reviews: "128",
  },
  {
    id: "c9-projector",
    title: "XElectron Android C9 Plus",
    subtitle: "Home cinema made simple.",
    image: "/product-c9-card.png",
    alt: "XElectron Android C9 Plus projector",
    price: "₹10,990.00",
    oldPrice: "₹19,999.00",
    rating: 4.7,
    reviews: "96",
  },
  {
    id: "techno-projector",
    title: "XElectron Techno Android",
    subtitle: "Portable projection anywhere.",
    image: "/product-white-projector-card.png",
    alt: "XElectron white projector",
    price: "₹6,990.00",
    oldPrice: "₹21,999.00",
    rating: 4.6,
    reviews: "74",
  },
  {
    id: "iprojector-2-plus",
    title: "XElectron IProjector 2 Plus",
    subtitle: "Compact power for every room.",
    image: "/product-black-projector-card.png",
    alt: "XElectron black projector",
    price: "₹17,990.00",
    oldPrice: "₹39,999.00",
    rating: 4.9,
    reviews: "142",
  },
];

export const bestSellers: BestSellerItem[] = [
  {
    title: "Lumex Cine",
    price: "₹12,999",
    compareAt: "₹32,999",
    discount: "60% off",
    description:
      "Elevate your cinematic experience with the future of projection technology. Supporting stunning 4K Visuals, Lumex Cine features AI Vision Focus, Auto Keystone, and Obstacle Avoidance.",
    specs: [
      { label: "Supported Resolution", value: "4K HDR" },
      { label: "Brightness", value: "1200 ANSI Lumens" },
      { label: "Projection Size", value: 'Up to 300"' },
    ],
    image:
      "https://crossbeats.com/cdn/shop/files/Flix_Media1_4d7b7073-dd1d-4fa0-a7bd-67fc556b726d.png?v=1782710479",
    alt: "Lumex Cine projector",
    accent: "rgba(10, 122, 230, 0.22)",
  },
  {
    title: "RoadEye DC03",
    price: "₹9,699",
    compareAt: "₹29,999",
    discount: "67% off",
    description:
      "Secure your car and yourself with our incredible 4K dash camera. Integrated with Sony Starvis technology, Advanced ADAS, and stellar Night Vision.",
    specs: [
      { label: "Resolution", value: "1920×1080 (Full HD)" },
      { label: "Projection Size", value: 'Up to 300"' },
      { label: "Brightness", value: "16,000 lumens" },
    ],
    image: "https://crossbeats.com/cdn/shop/files/DC03-Hero_1.png?v=1777540580",
    alt: "RoadEye DC03 dash camera",
    accent: "rgba(10, 122, 230, 0.24)",
  },
  {
    title: "Hertz",
    price: "₹1,799",
    compareAt: "₹6,999",
    discount: "74% off",
    description:
      "Experience next-level sound with Crossbeats Hertz - ultra-lightweight ANC earbuds powered by Bluetooth 5.4, AI Noise Cancellation, and long playtime.",
    specs: [
      { label: "Depth", value: "0.5 in (241 mm)" },
      { label: "Weight", value: "0.008 kg" },
      { label: "IP", value: "68 Standard" },
    ],
    image: "https://crossbeats.com/cdn/shop/files/Hertz_H1.png?v=1765964678",
    alt: "Hertz ANC earbuds",
    accent: "rgba(10, 122, 230, 0.26)",
  },
];
