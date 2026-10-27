import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop';

function StarRating({ rating = 0 }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          fill={s <= Math.round(rating) ? 'currentColor' : 'none'}
          size={12}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const image = product.images?.[0]?.url || PLACEHOLDER;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    addToCart(product, 1, product.sizes?.[0] || '', product.colors?.[0] || '');
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-image-wrapper">
          <img src={image} alt={product.name} loading="lazy" />

          {/* Badges */}
          <div className="product-badges">
            {product.isNewArrival && <span className="badge badge-gold">New</span>}
            {product.isBestSeller && <span className="badge badge-ice">Best Seller</span>}
            {product.discount > 0 && (
              <span className="badge badge-danger">{product.discount}% OFF</span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="product-actions">
            <button className="product-action-btn" title="Add to Wishlist">
              <FiHeart size={16} />
            </button>
          </div>
        </div>

        <div className="product-info">
          <div className="product-category">{product.category}</div>
          <h3 className="product-name">{product.name}</h3>

          <div className="product-rating">
            <StarRating rating={product.rating} />
            <span className="rating-count">({product.numReviews})</span>
          </div>

          <div className="product-price-row">
            <div>
              <span className="product-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice > product.price && (
                <span className="product-original-price" style={{ marginLeft: '0.5rem' }}>
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="product-discount">{product.discount}% off</span>
            )}
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 1.25rem 1.25rem' }}>
        <button className="add-to-cart-btn" onClick={handleQuickAdd}>
          <FiShoppingBag size={15} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
