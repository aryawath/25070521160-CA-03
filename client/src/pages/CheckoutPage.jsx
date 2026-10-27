import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiShoppingBag, FiTruck, FiShield, FiCreditCard, FiDollarSign, FiSmartphone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/api';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullName: user?.name || '',
    address: '104 High Street, Mall Road',
    city: 'Shimla',
    postalCode: '171001',
    country: 'India',
    phone: '+91 98765 43210',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountApplied, setDiscountApplied] = useState('');
  const [loading, setLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Calculations
  const shippingPrice = cartTotal > 1999 || cartTotal === 0 ? 0 : 149;
  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const taxableBase = cartTotal - discountAmount;
  const taxPrice = Math.round(taxableBase * 0.12); // 12% GST
  const totalPrice = taxableBase + shippingPrice + taxPrice;

  const handleInputChange = (e) => {
    setShippingData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = discountCode.trim().toUpperCase();
    if (code === 'WINTER20' || code === 'WINTEREDGE') {
      setDiscountPercent(20);
      setDiscountApplied(code);
      toast.success('🎉 20% Winter Special discount applied!');
    } else if (code === 'SNOW10' || code === 'FIRST10') {
      setDiscountPercent(10);
      setDiscountApplied(code);
      toast.success('🎉 10% discount applied!');
    } else {
      toast.error('Invalid coupon code. Try WINTER20');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to place your order.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }

    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!shippingData.address || !shippingData.city || !shippingData.postalCode || !shippingData.phone) {
      toast.error('Please fill in complete shipping information.');
      return;
    }

    try {
      setLoading(true);
      const orderPayload = {
        items: cart.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size || 'M',
          color: item.color || 'Standard',
          image: item.images?.[0]?.url || '',
        })),
        shippingAddress: {
          address: `${shippingData.fullName} - ${shippingData.address}`,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
          country: shippingData.country,
          phone: shippingData.phone,
        },
        paymentMethod,
        itemsPrice: cartTotal - discountAmount,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res = await createOrder(orderPayload);
      if (res.data.success) {
        setPlacedOrder(res.data.order);
        clearCart();
        toast.success('Order placed successfully! ❄️');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container" style={{ padding: '6rem 1rem', maxWidth: '650px', textAlign: 'center' }}>
        <div style={{
          background: 'var(--white)',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-dark)',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(56, 161, 105, 0.12)',
            color: 'var(--success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.5rem',
          }}>
            <FiCheck />
          </div>

          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>
            Thank You for Your Order!
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Your winter gear is being prepared with extreme care and warmth.
          </p>

          <div style={{
            background: 'var(--snow)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '2rem',
            textAlign: 'left',
            border: '1px solid var(--border-dark)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
              <strong style={{ fontFamily: 'monospace', color: 'var(--primary)' }}>{placedOrder._id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Payment Mode:</span>
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{placedOrder.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
              <span>Total Paid:</span>
              <span style={{ color: 'var(--primary)' }}>₹{placedOrder.totalPrice?.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn-primary">
              View My Orders
            </Link>
            <Link to="/shop" className="btn-dark">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '0.75rem' }}>Your Bag is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Explore our handcrafted jackets, cozy sweaters, and thermal accessories before heading to checkout.
        </p>
        <Link to="/shop" className="btn-primary">
          Explore Winter Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="page-fade-in" style={{ padding: '3rem 0 6rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            <FiArrowLeft /> Back to Shop
          </Link>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)' }}>
            Checkout & Delivery
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review your items and complete your order securely.</p>
        </div>

        {!user && (
          <div style={{
            background: 'var(--frost)',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-dark)',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <strong>Already have a WinterEdge account?</strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sign in to use your saved addresses and earn reward points.</div>
            </div>
            <Link to="/login" state={{ from: { pathname: '/checkout' } }} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
              Sign In
            </Link>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          {/* Shipping Form & Payment */}
          <div>
            {/* 1. Delivery Address */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              border: '1px solid var(--border-dark)',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--white)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem'
                }}>1</span>
                Shipping Address
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    value={shippingData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Street Address / House No.</label>
                  <input
                    type="text"
                    name="address"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    value={shippingData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">PIN / Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    value={shippingData.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    name="country"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    value={shippingData.country}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    value={shippingData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              border: '1px solid var(--border-dark)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'var(--white)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem'
                }}>2</span>
                Payment Method
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border-dark)'}`,
                  background: paymentMethod === 'cod' ? 'var(--frost)' : 'var(--white)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <FiDollarSign style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Cash on Delivery (COD)</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pay with cash or UPI upon package arrival at your doorstep</span>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${paymentMethod === 'card' ? 'var(--primary)' : 'var(--border-dark)'}`,
                  background: paymentMethod === 'card' ? 'var(--frost)' : 'var(--white)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <FiCreditCard style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Credit / Debit Card</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visa, MasterCard, RuPay, American Express (Encrypted 256-bit)</span>
                  </div>
                </label>

                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${paymentMethod === 'upi' ? 'var(--primary)' : 'var(--border-dark)'}`,
                  background: paymentMethod === 'upi' ? 'var(--frost)' : 'var(--white)',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <FiSmartphone style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem' }}>Instant UPI / Net Banking</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Google Pay, PhonePe, Paytm, BHIM, Net Banking</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary Right Side */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border-dark)',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} items)
            </h3>

            {/* Items scroll */}
            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.5rem' }}>
              {cart.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100'}
                    alt={item.name}
                    style={{ width: '50px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Size: {item.size || 'M'} | Qty: {item.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    ₹{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Promo Code (try WINTER20)"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.85rem',
                  border: '1px solid var(--border-dark)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--white)',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                Apply
              </button>
            </form>

            {discountApplied && (
              <div style={{
                background: 'rgba(56, 161, 105, 0.1)',
                border: '1px solid var(--success)',
                color: 'var(--success)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Code <strong>{discountApplied}</strong> ({discountPercent}% OFF) applied</span>
                <button
                  type="button"
                  onClick={() => { setDiscountPercent(0); setDiscountApplied(''); }}
                  style={{ background: 'none', color: 'var(--danger)', fontWeight: 700, fontSize: '0.75rem' }}
                >
                  Remove
                </button>
              </div>
            )}

            {/* Price lines */}
            <div style={{ borderTop: '1px solid var(--border-dark)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>

              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span>{shippingPrice === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `₹${shippingPrice}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Estimated GST (12%)</span>
                <span>₹{taxPrice.toLocaleString()}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.25rem',
                fontWeight: 900,
                color: 'var(--primary)',
                borderTop: '1px solid var(--border-dark)',
                paddingTop: '0.75rem',
                marginTop: '0.5rem'
              }}>
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="checkout-btn"
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? 'Processing Order...' : `Complete Order • ₹${totalPrice.toLocaleString()}`}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiShield /> 100% Secure Checkout</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FiTruck /> 14-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
