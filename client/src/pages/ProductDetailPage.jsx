import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiStar, FiTruck, FiShield, FiArrowLeft } from 'react-icons/fi';
import { getProduct } from '../api/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

function Stars({ rating }) {
  return (
    <div className="stars" style={{ fontSize: '1rem' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar key={s} fill={s <= Math.round(rating) ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct(id)
      .then((res) => {
        setProduct(res.data.product);
        setSelectedSize(res.data.product.sizes?.[0] || '');
        setSelectedColor(res.data.product.colors?.[0] || '');
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  if (loading) return <div className="spinner-wrapper"><div className="spinner" /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '5rem' }}>Product not found</div>;

  const image = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800';
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="page-fade-in" style={{ paddingTop: '80px' }}>
      <div className="container" style={{ padding: '2rem 1.5rem 6rem' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <Link to="/shop" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            <FiArrowLeft size={14} /> Back to Shop
          </Link>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{product.category}</span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 600 }}>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Image */}
          <div className="product-detail-images">
            <div className="main-image">
              <img src={image} alt={product.name} />
            </div>
          </div>

          {/* Info */}
          <div className="product-detail-info">
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {product.isNewArrival && <span className="badge badge-gold">New Arrival</span>}
              {product.isBestSeller && <span className="badge badge-ice">Best Seller</span>}
              {product.isFeatured && <span className="badge" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>Featured</span>}
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.5rem' }}>
              {product.brand} · {product.category}
            </p>

            <h1>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1rem 0' }}>
              <Stars rating={product.rating} />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{product.rating.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'Playfair Display' }}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="badge badge-danger">{discount}% OFF</span>
                </>
              )}
            </div>

            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {product.description}
            </p>

            {/* Material */}
            {product.material && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'var(--frost)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem' }}>
                <strong>Material:</strong> <span style={{ color: 'var(--text-secondary)' }}>{product.material}</span>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  Select Size: <span style={{ color: 'var(--gold)', fontWeight: 800 }}>{selectedSize}</span>
                </div>
                <div className="size-selector">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSize === s ? 'selected' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.875rem' }}>
                  Color: <span style={{ color: 'var(--gold)', fontWeight: 800 }}>{selectedColor}</span>
                </div>
                <div className="color-selector">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      className={`color-chip ${selectedColor === c ? 'selected' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--frost)', borderRadius: 'var(--radius-md)', padding: '0.4rem' }}>
                <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="qty-num" style={{ minWidth: '30px', textAlign: 'center', fontWeight: 800 }}>{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                {product.stock > 0 ? (
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>✓ In Stock ({product.stock} left)</span>
                ) : (
                  <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Out of Stock</span>
                )}
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                style={{ flex: 1, padding: '1rem' }}
              >
                <FiShoppingBag /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                className="nav-icon-btn"
                style={{ width: '52px', height: '52px', background: 'var(--frost)', border: '2px solid var(--border-dark)' }}
                title="Add to Wishlist"
              >
                <FiHeart />
              </button>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1.25rem', background: 'var(--frost)', borderRadius: 'var(--radius-md)' }}>
              {[
                { icon: FiTruck, text: 'Free shipping above ₹999' },
                { icon: FiShield, text: '100% Genuine Product' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  <Icon size={16} color="var(--gold)" /> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
