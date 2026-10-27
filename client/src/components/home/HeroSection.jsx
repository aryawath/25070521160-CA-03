import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiStar, FiZap } from 'react-icons/fi';

// Snowflake generator
function Snowflakes() {
  return (
    <div className="hero-snowflakes">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${6 + Math.random() * 8}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="hero-shape hero-shape-1" />
        <div className="hero-shape hero-shape-2" />
        <div className="hero-shape hero-shape-3" />
      </div>
      <Snowflakes />

      <div className="container" style={{ width: '100%' }}>
        <div className="hero-content">
          {/* Text Side */}
          <div className="hero-text">
            <div className="eyebrow">
              <FiZap size={14} />
              ❄️ Winter 2024 Collection is Here
            </div>

            <h1 className="hero-title">
              Stay Warm,
              <span className="highlight">Stay Iconic.</span>
              Winter Redefined.
            </h1>

            <p className="hero-desc">
              Discover our exclusive collection of premium winter wear — crafted for those who 
              refuse to compromise on style even in the coldest season.
            </p>

            <div className="hero-ctas">
              <Link to="/shop" className="btn-primary">
                Shop Collection <FiArrowRight />
              </Link>
              <Link to="/shop?newArrival=true" className="btn-secondary">
                New Arrivals
              </Link>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="number">500+</div>
                <div className="label">Products</div>
              </div>
              <div className="hero-stat">
                <div className="number">50K+</div>
                <div className="label">Happy Customers</div>
              </div>
              <div className="hero-stat">
                <div className="number">4.9★</div>
                <div className="label">Rating</div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="hero-image-area">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&auto=format&fit=crop"
                alt="WinterEdge Premium Collection"
              />
              <div className="hero-image-overlay" />
            </div>

            {/* Floating Cards */}
            <div className="hero-floating-card card-1">
              <div className="floating-icon">
                <FiStar fill="currentColor" />
              </div>
              <div className="floating-text">
                <strong>Premium Quality</strong>
                <span>Cashmere & Merino Wool</span>
              </div>
            </div>

            <div className="hero-floating-card card-2">
              <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem', marginBottom: '2px' }}>
                ₹499+
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Starting from</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '1rem 0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: FiTruck, text: 'Free Shipping above ₹999' },
              { icon: FiShield, text: '100% Genuine Products' },
              { icon: FiStar, text: 'Premium Winter Materials' },
              { icon: FiZap, text: 'Express 2-Day Delivery' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                <Icon size={16} color="var(--gold)" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
