import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ─── Category Mappings ───────────────────────────────────────────────────────

const CATEGORIES = [
  { title: "Home Speaker", slug: "speakers", description: "Premium Wireless Speakers", image: "/category-speaker.png" },
  { title: "Audio", slug: "headphones", description: "Wireless Earbuds, Soundbars & Headphones", image: "/category-headphones.png" },
  { title: "Cameras", slug: "cameras", description: "Smart 4K Dash Cameras & Action Cams", image: "/category-camera.png" },
  { title: "Smartphones", slug: "smartphones", description: "Flagship Smartphones", image: "/category-smartphone.png" },
  { title: "Smart TVs", slug: "tv", description: "High definition 4K and Smart LED Televisions", image: "/category-tv.png" },
  { title: "Projectors", slug: "projectors", description: "Portable Android & HD Cinema Projectors", image: "/category-projector.png" },
  { title: "Digital Photo Frames", slug: "digital-photo-frames", description: "WiFi & IPS Digital Photo Frames", image: "/category-frame.png" },
];

// ─── Product Data (from existing products-data.ts) ───────────────────────────

const PRODUCTS = [
  {
    slug: "yuqos-neosound-flex",
    name: "Yuqos Neosound Flex",
    categorySlug: "speakers",
    price: "₹54,200",
    oldPrice: "₹69,999",
    discount: "23% off",
    rating: 4.9,
    reviewsCount: "9.2K Reviews",
    description: "A true masterpiece in audio innovation and design. Crafted with precision, it seamlessly blends cutting-edge technology with exceptional aesthetics.",
    mainImage: "/category-speaker.png",
    shippingNotice: "Free 2-day shipping and 90 day risk free trial",
    colors: [
      { name: "Black Wood", bgHex: "#1e1e24" },
      { name: "Deep Violet", bgHex: "#362b53" },
      { name: "Soft Silver", bgHex: "#d2d5dc" },
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
  },
  {
    slug: "wireless-headphones",
    name: "Wireless Headphones",
    categorySlug: "headphones",
    price: "₹1,799",
    oldPrice: "₹6,999",
    discount: "74% off",
    rating: 4.8,
    reviewsCount: "4.5K Reviews",
    description: "Immersive over-ear wireless headphones with ultra-soft memory foam cushions, crystal-clear vocal reproduction, and active noise cancellation.",
    mainImage: "/category-headphones.png",
    shippingNotice: "Free express shipping across India & 1-Year Warranty",
    colors: [
      { name: "Saddle Brown", bgHex: "#6d4c41" },
      { name: "Matte Black", bgHex: "#1a1a1a" },
      { name: "Silver Metal", bgHex: "#b0bec5" },
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
  },
  {
    slug: "compact-camera",
    name: "Compact Camera",
    categorySlug: "cameras",
    price: "₹9,699",
    oldPrice: "₹29,999",
    discount: "67% off",
    rating: 4.7,
    reviewsCount: "3.1K Reviews",
    description: "A portable compact camera designed for creators and travelers. Featuring a bright f/1.8 optical zoom lens, tactile metallic control dials, and 4K video recording.",
    mainImage: "/category-camera.png",
    shippingNotice: "Free 2-day delivery with protective case included",
    colors: [
      { name: "Silver & Black", bgHex: "#424242" },
      { name: "Midnight Onyx", bgHex: "#212121" },
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
  },
  {
    slug: "smartphone",
    name: "Smartphone",
    categorySlug: "smartphones",
    price: "₹8,499",
    oldPrice: "₹14,999",
    discount: "43% off",
    rating: 4.6,
    reviewsCount: "6.8K Reviews",
    description: "A sleek flagship smartphone featuring an edge-to-edge AMOLED display, multi-lens AI camera array, and all-day fast-charging battery performance.",
    mainImage: "/category-smartphone.png",
    shippingNotice: "Includes free screen protector and 1-year brand warranty",
    colors: [
      { name: "Titanium Silver", bgHex: "#cfd8dc" },
      { name: "Graphite Gray", bgHex: "#37474f" },
      { name: "Deep Cobalt", bgHex: "#1a237e" },
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
  },
  {
    slug: "55-smart-tv",
    name: "XElectron 55 Inch LED TV",
    categorySlug: "tv",
    price: "₹29,999",
    oldPrice: "₹49,999",
    discount: "40% off",
    rating: 4.8,
    reviewsCount: "1.2K Reviews",
    description: "Immerse yourself in breathtaking 4K HDR entertainment with ultra-thin bezels, Dolby Vision color accuracy, and built-in Smart Android TV apps.",
    mainImage: "/product-tv-card.png",
    shippingNotice: "Free home delivery & professional wall-mount installation",
    colors: [{ name: "Metallic Black", bgHex: "#111111" }],
    features: [
      "4K Ultra HD Resolution (3840×2160)",
      "Dolby Audio 30W Sound Output",
      "Official Android TV with Google Assistant",
    ],
    specs: [
      { label: "Display Size", value: "55 Inch (139 cm)" },
      { label: "Refresh Rate", value: "60Hz Motion Clarity" },
      { label: "Ports", value: "3 HDMI + 2 USB + Optical" },
    ],
  },
  {
    slug: "c9-projector",
    name: "XElectron Android C9 Plus",
    categorySlug: "projectors",
    price: "₹10,990",
    oldPrice: "₹19,999",
    discount: "45% off",
    rating: 4.7,
    reviewsCount: "960 Reviews",
    description: "Transform your living room into a private theater with the Android C9 Plus home projector.",
    mainImage: "/product-c9-card.png",
    shippingNotice: "Free 2-day delivery & 1-Year replacement warranty",
    colors: [{ name: "Midnight Black", bgHex: "#1e1e1e" }],
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
  },
  {
    slug: "techno-projector",
    name: "XElectron Techno Android",
    categorySlug: "projectors",
    price: "₹6,990",
    oldPrice: "₹21,999",
    discount: "68% off",
    rating: 4.6,
    reviewsCount: "740 Reviews",
    description: "Compact portable Android projector designed for easy mobility, ceiling projection, and wireless smartphone screen mirroring.",
    mainImage: "/product-white-projector-card.png",
    shippingNotice: "Free delivery with remote control & power adapter",
    colors: [{ name: "Pure White", bgHex: "#f5f5f5" }],
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
  },
  {
    slug: "iprojector-2-plus",
    name: "XElectron IProjector 2 Plus",
    categorySlug: "projectors",
    price: "₹17,990",
    oldPrice: "₹39,999",
    discount: "55% off",
    rating: 4.9,
    reviewsCount: "1.4K Reviews",
    description: "Premium 4K-supported smart projector featuring ultra-bright LED optics, Harman-tuned speakers, and dual-band 5G Wi-Fi connectivity.",
    mainImage: "/product-black-projector-card.png",
    shippingNotice: "Free express delivery & 2-Year warranty included",
    colors: [{ name: "Space Gray", bgHex: "#373737" }],
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
  },
  {
    slug: "24stv",
    name: "XElectron 24 Inch HD Ready LED TV",
    categorySlug: "tv",
    price: "₹6,499",
    oldPrice: "₹12,999",
    discount: "50% off",
    rating: 4.2,
    reviewsCount: "94 Reviews",
    description: "A compact HD ready LED TV for bedrooms, study rooms, and small living spaces.",
    mainImage: "/category-tv.png",
    shippingNotice: "Free delivery with standard installation support",
    colors: [{ name: "Matte Black", bgHex: "#111111" }],
    features: ["HD Ready Display", "Energy Efficient Panel", "Simple Plug-and-Play Setup"],
    specs: [
      { label: "Display Size", value: "24 Inch (61 cm)" },
      { label: "Panel Type", value: "LED" },
      { label: "Ports", value: "HDMI + USB" },
    ],
  },
  {
    slug: "15-dpf",
    name: "XElectron 15.6 Inch Digital Photo Frame",
    categorySlug: "digital-photo-frames",
    price: "₹8,499",
    oldPrice: "₹14,999",
    discount: "43% off",
    rating: 4.4,
    reviewsCount: "76 Reviews",
    description: "A bright WiFi-enabled digital photo frame for showcasing memories, artwork, and slideshows.",
    mainImage: "/category-frame.png",
    shippingNotice: "Free shipping with power adapter included",
    colors: [
      { name: "Classic Black", bgHex: "#1a1a1a" },
      { name: "Soft White", bgHex: "#f5f5f5" },
    ],
    features: ["WiFi Photo Sync", "Touch Screen Navigation", "Auto Slideshow Mode"],
    specs: [
      { label: "Screen", value: "15.6 Inch Full HD" },
      { label: "Connectivity", value: "WiFi + USB" },
      { label: "Orientation", value: "Portrait / Landscape" },
    ],
  },
  {
    slug: "32-tv",
    name: "XElectron 32 Inch HD Ready Smart LED TV",
    categorySlug: "tv",
    price: "₹8,999",
    oldPrice: "₹18,999",
    discount: "53% off",
    rating: 4.3,
    reviewsCount: "157 Reviews",
    description: "A smart LED TV that balances size and clarity for everyday streaming, TV shows, and casual gaming.",
    mainImage: "/product-tv-card.png",
    shippingNotice: "Free home delivery and basic installation support",
    colors: [{ name: "Black", bgHex: "#101010" }],
    features: ["Smart TV Interface", "HD Ready Panel", "Multiple HDMI and USB Ports"],
    specs: [
      { label: "Display Size", value: "32 Inch (81 cm)" },
      { label: "Resolution", value: "HD Ready" },
      { label: "Speaker", value: "Stereo Sound" },
    ],
  },
  {
    slug: "8-dpf",
    name: "XElectron 8 Inch IPS Digital Photo Frame",
    categorySlug: "digital-photo-frames",
    price: "₹2,999",
    oldPrice: "₹5,999",
    discount: "50% off",
    rating: 4.0,
    reviewsCount: "203 Reviews",
    description: "A compact white digital photo frame for desks, shelves, and bedside tables with crisp image playback.",
    mainImage: "/category-frame.png",
    shippingNotice: "Free delivery with desktop stand included",
    colors: [
      { name: "White", bgHex: "#f4f4f4" },
      { name: "Beige", bgHex: "#d9d0c2" },
    ],
    features: ["IPS Display", "Compact Tabletop Design", "Easy Image Playback"],
    specs: [
      { label: "Screen", value: "8 Inch IPS" },
      { label: "Connectivity", value: "USB + Memory Card" },
      { label: "Use Case", value: "Photo Display" },
    ],
  },
];

// ─── Seed ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed...\n");

  // 1. Create categories
  console.log("📁 Creating categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { title: cat.title, description: cat.description, image: cat.image },
      create: { title: cat.title, slug: cat.slug, description: cat.description, image: cat.image, visible: true },
    });
    categoryMap.set(cat.slug, created.id);
    console.log(`  ✅ ${cat.title} (${cat.slug})`);
  }

  // 2. Create products with relations
  console.log("\n📦 Creating products...");

  for (const product of PRODUCTS) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) {
      console.log(`  ⚠️  Skipping ${product.name} — category "${product.categorySlug}" not found`);
      continue;
    }

    const { categorySlug, colors, features, specs, ...productData } = product;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        categoryId,
      },
      create: {
        ...productData,
        categoryId,
        colors: { create: colors },
        features: { create: features.map((f) => ({ featureText: f })) },
        specs: { create: specs },
      },
    });

    console.log(`  ✅ ${product.name}`);
  }

  // 3. Update category product counts
  console.log("\n📊 Updating category product counts...");
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const count = await prisma.product.count({ where: { categoryId: cat.id } });
    await prisma.category.update({ where: { id: cat.id }, data: { productCount: count } });
    console.log(`  ✅ ${cat.title}: ${count} products`);
  }

  // 4. Create default users (Admin & Customer)
  console.log("\n👤 Creating default users...");
  const adminPasswordHash = await bcrypt.hash("adminpassword123", 10);
  const customerPasswordHash = await bcrypt.hash("userpassword123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@xelectron.com" },
    update: { role: UserRole.ADMIN },
    create: {
      name: "Admin User",
      email: "admin@xelectron.com",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`  ✅ Admin User: ${adminUser.email} (Role: ${adminUser.role})`);

  // 5. Seed Brand Platforms Marquee
  console.log("\n🚀 Seeding Brand Platforms Marquee...");
  const BRAND_PLATFORMS = [
    { name: "Amazon", logoUrl: "/brands/amazon.svg", color: "#FF9900", linkUrl: "https://www.amazon.in", sortOrder: 0, isActive: true },
    { name: "Flipkart", logoUrl: "/brands/flipkart.svg", color: "#2874F0", linkUrl: "https://www.flipkart.com", sortOrder: 1, isActive: true },
    { name: "Myntra", logoUrl: "/brands/myntra.svg", color: "#FF3F6C", linkUrl: "https://www.myntra.com", sortOrder: 2, isActive: true },
    { name: "Croma", logoUrl: "/brands/croma.svg", color: "#0F7C4F", linkUrl: "https://www.croma.com", sortOrder: 3, isActive: true },
    { name: "Reliance Digital", logoUrl: "/brands/reliance-digital.svg", color: "#0033A0", linkUrl: "https://www.reliancedigital.in", sortOrder: 4, isActive: true },
    { name: "JioMart", logoUrl: "/brands/jiomart.svg", color: "#0A3D8F", linkUrl: "https://www.jiomart.com", sortOrder: 5, isActive: true },
    { name: "Meesho", logoUrl: "/brands/meesho.svg", color: "#570A57", linkUrl: "https://www.meesho.com", sortOrder: 6, isActive: true },
    { name: "Snapdeal", logoUrl: "/brands/snapdeal.svg", color: "#E40046", linkUrl: "https://www.snapdeal.com", sortOrder: 7, isActive: true },
    { name: "Tata CLiQ", logoUrl: "/brands/tata-cliq.svg", color: "#5C2D91", linkUrl: "https://www.tatacliq.com", sortOrder: 8, isActive: true },
    { name: "Nykaa", logoUrl: "/brands/nykaa.svg", color: "#FC2779", linkUrl: "https://www.nykaa.com", sortOrder: 9, isActive: true },
  ];

  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "brand_marquee_items" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "logo_url" TEXT,
        "color" TEXT NOT NULL DEFAULT '#000000',
        "link_url" TEXT,
        "sort_order" INTEGER NOT NULL DEFAULT 0,
        "is_active" BOOLEAN NOT NULL DEFAULT true,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`ALTER TABLE "brand_marquee_items" ADD COLUMN IF NOT EXISTS "logo_url" TEXT;`);
    await prisma.$executeRawUnsafe(`DELETE FROM "brand_marquee_items"`);

    for (const b of BRAND_PLATFORMS) {
      await (prisma as any).brandMarqueeItem.create({
        data: b,
      });
    }
    console.log(`  ✅ Seeded ${BRAND_PLATFORMS.length} brand platforms`);
  } catch (err: any) {
    console.log(`  ⚠️ Brand platforms seed notice: ${err?.message || err}`);
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
