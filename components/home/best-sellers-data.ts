export type BestSellerItem = {
  id: string;
  slug?: string;
  name: string;
  price: string;
  oldPrice?: string;
  discount?: string;
  description: string;
  image: string;
  imageAlt: string;
  specs: {
    label: string;
    value: string;
  }[];
};

export const bestSellers: BestSellerItem[] = [
  {
    id: "wireless-headphones",
    name: "Wireless Headphones",
    price: "₹1,799",
    oldPrice: "₹6,999",
    discount: "74% off",
    description:
      "Immersive over-ear wireless headphones with soft cushions, clear vocals, and all-day comfort for music, calls, and entertainment.",
    image: "/category-headphones.png",
    imageAlt: "XElectron wireless headphones",
    specs: [
      { label: "Type", value: "Wireless Headphones" },
      { label: "Connectivity", value: "Bluetooth 5.4" },
      { label: "Playback", value: "All-day Battery" },
    ],
  },
  {
    id: "compact-camera",
    name: "Compact Camera",
    price: "₹9,699",
    oldPrice: "₹29,999",
    discount: "67% off",
    description:
      "A compact camera designed for quick captures with a bright lens, portable body, and smooth everyday shooting.",
    image: "/category-camera.png",
    imageAlt: "XElectron compact camera",
    specs: [
      { label: "Resolution", value: "1920×1080 (Full HD)" },
      { label: "Lens", value: "Zoom Lens" },
      { label: "Focus", value: "Auto Focus" },
    ],
  },
  {
    id: "smartphone",
    name: "Smartphone",
    price: "₹8,499",
    oldPrice: "₹14,999",
    discount: "43% off",
    description:
      "A slim smartphone-style display device with a bright screen, responsive touch experience, and easy sharing for everyday use.",
    image: "/category-smartphone.png",
    imageAlt: "XElectron smartphone",
    specs: [
      { label: "Display", value: '6.5" Full HD' },
      { label: "Connectivity", value: "WiFi + USB" },
      { label: "Touch Screen", value: "Yes" },
    ],
  },
];
