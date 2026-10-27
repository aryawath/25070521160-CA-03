import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiMapPin, FiTruck, FiClock, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { getMyOrders } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getMyOrders()
        .then((res) => {
          if (res.data.success) {
            setOrders(res.data.orders);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>Please Sign In</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Sign in to view your placed orders, delivery tracking, and purchase receipts.
        </p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  return (
    <div className="orders-page page-fade-in">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '0.5rem' }}>
            My Orders
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track and view history for all your WinterEdge orders.
          </p>
        </div>

        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-xl)',
            padding: '4rem 2rem',
            textAlign: 'center',
            border: '1px solid var(--border-dark)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📦</div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', marginBottom: '0.5rem' }}>No Orders Placed Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              You haven't ordered any winter wear yet. Explore our curated coats and jackets!
            </p>
            <Link to="/shop" className="btn-primary">
              <FiShoppingBag style={{ marginRight: '0.5rem' }} /> Explore Winter Shop
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map((order) => {
              const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              const statusClass = {
                processing: 'status-processing',
                confirmed: 'status-confirmed',
                shipped: 'status-shipped',
                delivered: 'status-delivered',
                cancelled: 'status-cancelled',
              }[order.orderStatus || 'processing'];

              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                        ORDER PLACED: <strong style={{ color: 'var(--text-primary)' }}>{dateStr}</strong>
                      </div>
                      <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--primary)', fontWeight: 700 }}>
                        ID: #{order._id}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                      <span className={`status-pill ${statusClass}`}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }} />
                        {order.orderStatus || 'Processing'}
                      </span>
                      <div className="order-total">
                        ₹{order.totalPrice?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div style={{ borderTop: '1px solid var(--border-dark)', borderBottom: '1px solid var(--border-dark)', padding: '1.25rem 0', margin: '1rem 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {order.items?.map((item, idx) => {
                        const imgUrl = item.image || item.product?.images?.[0]?.url || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200';
                        return (
                          <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div className="order-item-thumb">
                              <img src={imgUrl} alt={item.name} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                                {item.name}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                Size: {item.size || 'M'} | Qty: {item.quantity}
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>
                                ₹{item.price?.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Footer & Tracking Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiMapPin style={{ color: 'var(--text-muted)' }} />
                      <span>Delivering to: <strong>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiTruck style={{ color: 'var(--text-muted)' }} />
                      <span>Payment: <strong style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
