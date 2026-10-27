const Product = require('../models/Product');

// @desc   Get all products with filters, pagination, search
// @route  GET /api/products
// @access Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      featured,
      newArrival,
      bestSeller,
    } = req.query;

    const query = {};

    if (category) query.category = category.toLowerCase();
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc   Get single product
// @route  GET /api/products/:id
// @access Public
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc   Create product (admin)
// @route  POST /api/products
// @access Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Update product (admin)
// @route  PUT /api/products/:id
// @access Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Delete product (admin)
// @route  DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc   Add review to product
// @route  POST /api/products/:id/reviews
// @access Private
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    product.reviews.push({ user: req.user._id, name: req.user.name, rating, comment });
    product.computeRating();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc   Seed sample products
// @route  POST /api/products/seed
// @access Private/Admin
const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const sampleProducts = getSampleProducts();
    await Product.insertMany(sampleProducts);
    res.status(201).json({ success: true, message: `${sampleProducts.length} products seeded` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function getSampleProducts() {
  return [
    {
      name: 'Alpine Pro Puffer Jacket',
      description: 'Ultra-warm down puffer jacket with water-resistant shell. Perfect for extreme cold conditions. Features include adjustable hood, multiple pockets, and premium insulation for maximum warmth.',
      price: 2499,
      originalPrice: 3999,
      category: 'jackets',
      images: [
        { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', alt: 'Alpine Puffer Jacket' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Navy Blue', 'Olive Green', 'Charcoal'],
      stock: 45,
      tags: ['jacket', 'puffer', 'winter', 'warm'],
      isFeatured: true,
      isNewArrival: true,
      discount: 37,
      material: '90% Down, 10% Feather',
      brand: 'WinterEdge',
    },
    {
      name: 'Cashmere Blend Overcoat',
      description: 'Luxurious cashmere blend long overcoat. Elegant and warm for formal occasions or daily urban style. Tailored fit with classic lapels and premium wool blend fabric.',
      price: 5999,
      originalPrice: 8500,
      category: 'coats',
      images: [
        { url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600', alt: 'Cashmere Overcoat' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Camel', 'Grey', 'Black'],
      stock: 20,
      tags: ['coat', 'cashmere', 'luxury', 'formal'],
      isFeatured: true,
      isBestSeller: true,
      discount: 29,
      material: '70% Cashmere, 30% Wool',
      brand: 'WinterEdge',
    },
    {
      name: 'Nordic Cable Knit Sweater',
      description: 'Handcrafted Nordic pattern cable knit sweater. Extra soft merino wool blend. Classic Scandinavian design with intricate patterns. Perfect for cozy winter evenings.',
      price: 1299,
      originalPrice: 1799,
      category: 'sweaters',
      images: [
        { url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', alt: 'Cable Knit Sweater' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Cream', 'Grey Marl', 'Burgundy'],
      stock: 60,
      tags: ['sweater', 'knit', 'merino', 'nordic'],
      isFeatured: true,
      isBestSeller: true,
      discount: 27,
      material: '80% Merino Wool, 20% Nylon',
      brand: 'WinterEdge',
    },
    {
      name: 'Sherpa Lined Snow Boots',
      description: 'Premium waterproof snow boots with sherpa lining. Anti-slip rubber sole for icy conditions. Keeps your feet warm down to -30°C. Stylish yet functional design.',
      price: 3299,
      originalPrice: 4500,
      category: 'boots',
      images: [
        { url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600', alt: 'Snow Boots' },
      ],
      sizes: ['6', '7', '8', '9', '10', '11'],
      colors: ['Black', 'Brown', 'Navy'],
      stock: 35,
      tags: ['boots', 'snow', 'waterproof', 'sherpa'],
      isNewArrival: true,
      discount: 26,
      material: 'Waterproof Nubuck, Sherpa Lining',
      brand: 'WinterEdge',
    },
    {
      name: 'Merino Wool Beanie',
      description: 'Ultra-soft merino wool beanie with fleece lining. Stretchy fit that suits all head sizes. Available in rich winter colors. Essential winter accessory.',
      price: 499,
      originalPrice: 799,
      category: 'accessories',
      images: [
        { url: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600', alt: 'Wool Beanie' },
      ],
      sizes: ['One Size'],
      colors: ['Forest Green', 'Burgundy', 'Navy', 'Mustard', 'Charcoal'],
      stock: 100,
      tags: ['beanie', 'hat', 'merino', 'accessories'],
      isBestSeller: true,
      discount: 37,
      material: '100% Merino Wool',
      brand: 'WinterEdge',
    },
    {
      name: 'Thermal Base Layer Set',
      description: 'High-performance thermal base layer top and bottom set. Moisture-wicking and quick-dry technology. Ideal for skiing, hiking or daily winter wear under regular clothes.',
      price: 1499,
      originalPrice: 2200,
      category: "men's wear",
      images: [
        { url: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=600', alt: 'Thermal Base Layer' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'White', 'Dark Grey'],
      stock: 80,
      tags: ['thermal', 'base layer', 'men', 'performance'],
      isNewArrival: true,
      discount: 31,
      material: 'Polyester-Spandex Blend',
      brand: 'WinterEdge',
    },
    {
      name: 'Ladies Faux Fur Coat',
      description: 'Glamorous faux fur coat for the fashion-forward winter queen. Plush texture, warm lining, and a silhouette that commands attention. Available in bold statement colors.',
      price: 4499,
      originalPrice: 6500,
      category: "women's wear",
      images: [
        { url: 'https://images.unsplash.com/photo-1558171813-6e9eceab8c3e?w=600', alt: 'Faux Fur Coat' },
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ivory', 'Blush Pink', 'Leopard Print', 'Black'],
      stock: 25,
      tags: ['fur coat', 'women', 'luxury', 'fashion'],
      isFeatured: true,
      isBestSeller: true,
      discount: 30,
      material: 'Premium Faux Fur',
      brand: 'WinterEdge',
    },
    {
      name: 'Kids Snowsuit',
      description: 'Adorable and super warm snowsuit for kids. One-piece design with removable hood. Water resistant outer shell with cozy internal fleece lining. Makes outdoor winter play fun and warm!',
      price: 1799,
      originalPrice: 2500,
      category: "kids' wear",
      images: [
        { url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600', alt: 'Kids Snowsuit' },
      ],
      sizes: ['2Y', '3Y', '4Y', '5Y', '6Y', '7Y', '8Y'],
      colors: ['Electric Blue', 'Hot Pink', 'Orange', 'Red'],
      stock: 40,
      tags: ['kids', 'snowsuit', 'children', 'warm'],
      isNewArrival: true,
      discount: 28,
      material: 'Nylon Shell, Fleece Lining',
      brand: 'WinterEdge',
    },
    {
      name: 'Leather Sherpa Jacket',
      description: 'Classic leather jacket with cozy sherpa collar and lining. The perfect blend of cool and warm. Zip front, multiple pockets, and a rugged aesthetic that never goes out of style.',
      price: 3799,
      originalPrice: 5200,
      category: 'jackets',
      images: [
        { url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', alt: 'Leather Sherpa Jacket' },
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Brown', 'Black'],
      stock: 18,
      tags: ['leather', 'sherpa', 'jacket', 'classic'],
      isFeatured: true,
      discount: 26,
      material: 'Genuine Leather, Sherpa Lining',
      brand: 'WinterEdge',
    },
    {
      name: 'Luxe Cashmere Scarf',
      description: 'Extra soft, extra large pure cashmere scarf. Generous wrap around warmth with a beautifully subtle check pattern. The ultimate luxury winter accessory.',
      price: 1999,
      originalPrice: 3500,
      category: 'accessories',
      images: [
        { url: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600', alt: 'Cashmere Scarf' },
      ],
      sizes: ['One Size'],
      colors: ['Plaid Camel', 'Classic Grey', 'Deep Red'],
      stock: 55,
      tags: ['scarf', 'cashmere', 'luxury', 'accessories'],
      isBestSeller: true,
      discount: 42,
      material: '100% Pure Cashmere',
      brand: 'WinterEdge',
    },
    {
      name: 'Windproof Ski Jacket',
      description: 'Technical ski jacket built for the slopes. Waterproof, windproof, breathable. Features include snow skirt, lift pass pocket, helmet compatible hood, and ventilation zips.',
      price: 6999,
      originalPrice: 9500,
      category: 'jackets',
      images: [
        { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600', alt: 'Ski Jacket' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Electric Blue', 'Neon Orange', 'Black'],
      stock: 12,
      tags: ['ski', 'jacket', 'technical', 'waterproof'],
      isNewArrival: true,
      discount: 26,
      material: 'Gore-Tex Shell, Primaloft Insulation',
      brand: 'WinterEdge',
    },
    {
      name: 'Chunky Knit Blanket Cardigan',
      description: 'Oversized, cozy chunky knit cardigan that doubles as a wearable blanket. Dramatic lapels, deep pockets, and a relaxed silhouette. The ultimate stay-at-home luxury.',
      price: 2299,
      originalPrice: 3200,
      category: "women's wear",
      images: [
        { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600', alt: 'Blanket Cardigan' },
      ],
      sizes: ['XS/S', 'M/L', 'XL/XXL'],
      colors: ['Oatmeal', 'Sage Green', 'Dusty Lilac'],
      stock: 30,
      tags: ['cardigan', 'women', 'cozy', 'oversized'],
      isFeatured: true,
      discount: 28,
      material: 'Chunky Acrylic Blend',
      brand: 'WinterEdge',
    },
  ];
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview, seedProducts };
