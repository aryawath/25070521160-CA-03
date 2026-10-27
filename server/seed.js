require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const sampleProducts = [
  {
    name: 'Alpine Pro Puffer Jacket',
    description: 'Ultra-warm down puffer jacket with water-resistant shell. Engineered for extreme sub-zero conditions with premium down filling, high thermal loft, storm hood, and fleece-lined storm pockets.',
    price: 2499,
    originalPrice: 3999,
    category: 'jackets',
    images: [
      { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', alt: 'Alpine Puffer Jacket' },
      { url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800', alt: 'Side View' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy Blue', 'Olive Green', 'Charcoal', 'Arctic White'],
    stock: 45,
    tags: ['jacket', 'puffer', 'winter', 'down', 'waterproof'],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    rating: 4.9,
    numReviews: 48,
    discount: 37,
    material: '90% Goose Down, 10% Feather, Ripstop Nylon',
    brand: 'WinterEdge',
  },
  {
    name: 'Cashmere Blend Tailored Overcoat',
    description: 'Sophisticated single-breasted overcoat tailored from a luxurious cashmere-wool blend. Features notched lapels, horn buttons, full satin lining, and interior pocket for elegance in city winters.',
    price: 4999,
    originalPrice: 6999,
    category: 'coats',
    images: [
      { url: 'https://images.unsplash.com/photo-1539533018447-63fcce667823?w=800', alt: 'Cashmere Overcoat' },
      { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', alt: 'Overcoat detail' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Slate Grey', 'Midnight Black'],
    stock: 25,
    tags: ['coat', 'cashmere', 'luxury', 'formal', 'wool'],
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    numReviews: 32,
    discount: 29,
    material: '70% Mongolian Cashmere, 30% Virgin Wool',
    brand: 'WinterEdge Luxury',
  },
  {
    name: 'Nordic Cable Knit Sweater',
    description: 'Handcrafted Scandinavian cable knit sweater crafted from ultra-soft merino wool. Timeless winter pattern that pairs effortlessly with denim or tailored trousers for chilly evenings by the fire.',
    price: 1299,
    originalPrice: 1799,
    category: 'sweaters',
    images: [
      { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', alt: 'Nordic Knit Sweater' },
      { url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800', alt: 'Sweater detail' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Grey Marl', 'Deep Burgundy', 'Pine Green'],
    stock: 60,
    tags: ['sweater', 'knit', 'merino', 'nordic', 'cozy'],
    isFeatured: true,
    isBestSeller: true,
    rating: 4.8,
    numReviews: 64,
    discount: 27,
    material: '85% Merino Wool, 15% Cashmere-Touch Acrylic',
    brand: 'WinterEdge',
  },
  {
    name: 'Sherpa Lined All-Weather Snow Boots',
    description: 'High-traction waterproof winter boots lined with genuine shearling fleece. Tested for temperatures down to -30°C with anti-freeze rubber tread and reinforced toe guard for icy sidewalks or mountain paths.',
    price: 3299,
    originalPrice: 4500,
    category: 'boots',
    images: [
      { url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800', alt: 'Snow Boots' },
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', alt: 'Boots side view' },
    ],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Cognac Brown', 'Matte Black', 'Dark Olive'],
    stock: 35,
    tags: ['boots', 'snow', 'waterproof', 'sherpa', 'winter'],
    isNewArrival: true,
    isFeatured: true,
    rating: 4.7,
    numReviews: 29,
    discount: 26,
    material: 'Waterproof Oiled Nubuck, Genuine Sherpa',
    brand: 'WinterEdge Trek',
  },
  {
    name: 'Merino Wool Ribbed Beanie',
    description: 'Ultra-soft, itch-free merino wool cuff beanie with a snug, comfortable stretch fit. Thermoregulating natural fibers keep you cozy without overheating during active winter commutes.',
    price: 499,
    originalPrice: 799,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=800', alt: 'Merino Beanie' },
    ],
    sizes: ['One Size'],
    colors: ['Mustard Gold', 'Charcoal', 'Oatmeal', 'Navy Blue', 'Wine'],
    stock: 80,
    tags: ['beanie', 'hat', 'merino', 'accessories'],
    isBestSeller: true,
    rating: 4.9,
    numReviews: 87,
    discount: 37,
    material: '100% Fine Merino Wool',
    brand: 'WinterEdge',
  },
  {
    name: 'Vintage Aviator Sherpa Leather Jacket',
    description: 'Rugged vintage B-3 aviator jacket crafted from durable distressed leather with a thick shearling collar and plush interior. Dual collar buckle straps and heavy-duty antique brass zippers.',
    price: 3799,
    originalPrice: 5200,
    category: 'jackets',
    images: [
      { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', alt: 'Leather Sherpa Jacket' },
      { url: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800', alt: 'Jacket details' },
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Brown', 'Classic Black'],
    stock: 18,
    tags: ['leather', 'sherpa', 'jacket', 'aviator', 'bomber'],
    isFeatured: true,
    isNewArrival: true,
    rating: 4.9,
    numReviews: 41,
    discount: 26,
    material: 'Full Grain Leather & High-Pile Shearling',
    brand: 'WinterEdge Heritage',
  },
  {
    name: 'Luxe Pure Cashmere Wrap Scarf',
    description: 'Oversized luxury scarf woven from pure cashmere fibers. Generous dimensions (200cm x 70cm) provide cloud-like softness, enveloping warmth, and fluid drape for effortless winter styling.',
    price: 1999,
    originalPrice: 3500,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800', alt: 'Cashmere Scarf' },
    ],
    sizes: ['One Size'],
    colors: ['Plaid Camel', 'Classic Grey', 'Ruby Red', 'Cream'],
    stock: 55,
    tags: ['scarf', 'cashmere', 'luxury', 'wrap', 'accessories'],
    isBestSeller: true,
    rating: 5.0,
    numReviews: 53,
    discount: 42,
    material: '100% Mongolian Cashmere',
    brand: 'WinterEdge Luxury',
  },
  {
    name: 'Technical Stormproof Ski Jacket',
    description: 'High-performance ski and snowboard jacket engineered with a 20,000mm waterproof rating and breathable membrane. Complete with detachable snow skirt, lift pass sleeve pocket, and RECCO reflector.',
    price: 6999,
    originalPrice: 9500,
    category: 'jackets',
    images: [
      { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', alt: 'Ski Jacket' },
      { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', alt: 'Ski jacket slope' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Glacier Cyan', 'Flame Orange', 'Stealth Black'],
    stock: 15,
    tags: ['ski', 'snowboard', 'technical', 'waterproof', 'goretex'],
    isNewArrival: true,
    rating: 4.9,
    numReviews: 19,
    discount: 26,
    material: '3-Layer WeatherShield Gore-Tex, PrimaLoft Gold',
    brand: 'WinterEdge Alpine Lab',
  },
  {
    name: 'Oversized Chunky Knit Cardigan',
    description: 'Sumptuously soft cocoon cardigan knit with voluminous ribbed stitches and dropped shoulders. Features deep horn button closures and patch pockets for the ultimate cozy aesthetic.',
    price: 2299,
    originalPrice: 3200,
    category: "women's wear",
    images: [
      { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', alt: 'Chunky Cardigan' },
      { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800', alt: 'Cardigan style' },
    ],
    sizes: ['XS/S', 'M/L', 'XL/XXL'],
    colors: ['Oatmeal', 'Sage Mist', 'Dusty Lilac', 'Espresso'],
    stock: 30,
    tags: ['cardigan', 'women', 'cozy', 'oversized', 'knit'],
    isFeatured: true,
    rating: 4.8,
    numReviews: 38,
    discount: 28,
    material: 'Wool-Mohair Blend',
    brand: 'WinterEdge',
  },
  {
    name: 'Glacier Down Winter Parka',
    description: 'Full-length insulated winter parka with removable faux-fur trim hood. Water-repellent Teflon coating protects from sleet, slush, and biting blizzards while keeping your core thoroughly insulated.',
    price: 5499,
    originalPrice: 7999,
    category: "men's wear",
    images: [
      { url: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=800', alt: 'Down Parka' },
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Military Green', 'Midnight Navy', 'Arctic Graphite'],
    stock: 22,
    tags: ['parka', 'down', 'men', 'extreme winter', 'fur'],
    isBestSeller: true,
    rating: 4.9,
    numReviews: 44,
    discount: 31,
    material: '700-Fill Power Goose Down, Cordura Shell',
    brand: 'WinterEdge',
  },
  {
    name: 'Fleece Lined Kids Snowsuit',
    description: 'All-in-one winter snowsuit for little explorers. 100% waterproof exterior with cozy polar fleece lining, reflective safety piping, reinforced knees, and removable hood with safety snap-off.',
    price: 1899,
    originalPrice: 2699,
    category: "kids' wear",
    images: [
      { url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800', alt: 'Kids Snowsuit' },
    ],
    sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y'],
    colors: ['Bright Cobalt', 'Berry Coral', 'Sunny Yellow'],
    stock: 40,
    tags: ['kids', 'snowsuit', 'fleece', 'waterproof', 'children'],
    isNewArrival: true,
    rating: 5.0,
    numReviews: 21,
    discount: 29,
    material: 'Waterproof HydroTex, Micro-Polar Fleece',
    brand: 'WinterEdge Kids',
  },
  {
    name: 'Thermal Touchscreen Leather Gloves',
    description: 'Precision-crafted from supple lambskin leather with conductive fingertips for smartphone interaction. Lined with 100% cashmere to keep fingers nimble and toasty in freezing weather.',
    price: 899,
    originalPrice: 1499,
    category: 'accessories',
    images: [
      { url: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800', alt: 'Leather Gloves' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Espresso Brown', 'Jet Black', 'Tan'],
    stock: 65,
    tags: ['gloves', 'leather', 'touchscreen', 'cashmere', 'accessories'],
    isFeatured: true,
    rating: 4.8,
    numReviews: 76,
    discount: 40,
    material: 'Nappa Lambskin Leather, Cashmere Lining',
    brand: 'WinterEdge',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/winteredge');
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products.');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✨ Successfully seeded ${createdProducts.length} winter products!`);

    // Create demo admin and demo user
    const existingAdmin = await User.findOne({ email: 'admin@winteredge.com' });
    if (!existingAdmin) {
      await User.create({
        name: 'WinterEdge Admin',
        email: 'admin@winteredge.com',
        password: 'admin123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      });
      console.log('👑 Admin user created: admin@winteredge.com / admin123');
    }

    const existingUser = await User.findOne({ email: 'demo@winteredge.com' });
    if (!existingUser) {
      await User.create({
        name: 'Arya Customer',
        email: 'demo@winteredge.com',
        password: 'demo123',
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      });
      console.log('👤 Demo user created: demo@winteredge.com / demo123');
    }

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
