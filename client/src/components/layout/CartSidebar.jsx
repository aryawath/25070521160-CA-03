import { FiX, FiShoppingBag, FiArrowRight, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <h3>
            <FiShoppingBag style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            My Cart
            {cartCount > 0 && (
              <span
                className="badge badge-gold"
                style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}
              >
                {cartCount} items
              </span>
            )}
          </h3>
          <button className="cart-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* Items */}
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛍️</div>
            <h4>Your cart is empty</h4>
            <p>Add some premium winter wear to get started!</p>
            <button className="btn-dark" style={{ marginTop: '1rem' }} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map((item, i) => (
                <div className="cart-item" key={`${item._id}-${item.size}-${item.color}-${i}`}>
                  <div className="cart-item-img">
                    <img
                      src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200'}
                      alt={item.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="cart-item-details">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-meta">
                      {item.size && `Size: ${item.size}`}
                      {item.size && item.color && ' · '}
                      {item.color && `${item.color}`}
                    </div>
                    <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                    <div className="cart-item-actions">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity - 1)}
                      >
                        <FiMinus size={12} />
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item._id, item.size, item.color, item.quantity + 1)}
                      >
                        <FiPlus size={12} />
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item._id, item.size, item.color)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="cart-footer">
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({cartCount} items)</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>{cartTotal > 999 ? 'FREE' : '₹99'}</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-dark)', margin: '0.75rem 0' }} />
              </div>
              <div className="cart-total-row">
                <span className="cart-total-label">Total Amount</span>
                <span className="cart-total-amount">
                  ₹{(cartTotal + (cartTotal > 999 ? 0 : 99)).toLocaleString()}
                </span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout <FiArrowRight />
              </button>
              <button
                onClick={clearCart}
                style={{
                  width: '100%',
                  marginTop: '0.75rem',
                  padding: '0.6rem',
                  background: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.825rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--danger)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
              >
                <FiTrash2 size={13} /> Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
