import { Link } from 'react-router-dom';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import HeroSection from '../components/home/HeroSection';
import CategoriesSection from '../components/home/CategoriesSection';
import FeaturedProducts from '../components/home/FeaturedProducts';

const testimonials = [
  {
    text: "Ordered the Alpine Pro Puffer Jacket and I couldn't be happier! The quality is incredible, and it kept me warm during a trek in Himachal. Delivery was super fast too.",
    name: 'Arjun Sharma',
    location: 'Delhi, India',
    rating: 5,
  },
  {
    text: "The Cashmere Blend Overcoat is EVERYTHING. Feels luxurious, looks amazing, and the fit is perfect. I get compliments every single time I wear it.",
    name: 'Priya Mehta',
    location: 'Mumbai, India',
    rating: 5,
  },
  {
    text: "Bought the Nordic Cable Knit Sweater for my mom and she absolutely loves it. Great quality, beautiful pattern. Will definitely order again!",
    name: 'Rahul Verma',
    location: 'Bengaluru, India',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="page-fade-in">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />

      {/* Featured Banner */}
      <section className="featured-banner">
        <div className="container">
          <div className="featured-banner-inner">
            <div className="featured-banner-text">
              <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>Limited Edition</span>
              <h2>The Women's <br />Faux Fur Collection</h2>
              <p>
                Glamour meets warmth. Our exclusive faux fur range is designed for the woman 
                who wants to make a statement every single winter day. Available in bold, 
                statement-making colors — from ivory to leopard print.
              </p>
              <Link to="/shop?category=women's wear" className="btn-primary">
                Explore Collection <FiArrowRight />
              </Link>
            </div>
            <div className="featured-banner-image">
              <img
                src="https://images.unsplash.com/photo-1558171813-6e9eceab8c3e?w=800&auto=format&fit=crop"
                alt="Women's Winter Collection"
              />
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Strip */}
      <section className="products-section" style={{ background: 'var(--white)' }}>
        <div className="container">
          <div className="products-header">
            <div>
              <h2 className="section-title">New <span className="gold-text">Arrivals</span></h2>
              <p className="section-subtitle">Fresh styles just dropped this season</p>
            </div>
            <Link to="/shop?newArrival=true" className="btn-dark">
              View All New <FiArrowRight />
            </Link>
          </div>

          {/* Static showcase cards */}
          <div className="products-grid">
            {[
              {
                img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600',
                name: 'Alpine Pro Puffer',
                price: '₹2,499',
                badge: 'New',
                cat: 'Jackets',
              },
              {
                img: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600',
                name: 'Sherpa Snow Boots',
                price: '₹3,299',
                badge: 'New',
                cat: 'Boots',
              },
              {
                img: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=600',
                name: 'Thermal Base Layer',
                price: '₹1,499',
                badge: 'New',
                cat: "Men's Wear",
              },
              {
                img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
                name: 'Kids Snowsuit',
                price: '₹1,799',
                badge: 'New',
                cat: "Kids' Wear",
              },
            ].map((item) => (
              <Link to="/shop" key={item.name}>
                <div className="product-card">
                  <div className="product-image-wrapper">
                    <img src={item.img} alt={item.name} loading="lazy" />
                    <div className="product-badges">
                      <span className="badge badge-gold">{item.badge}</span>
                    </div>
                  </div>
                  <div className="product-info">
                    <div className="product-category">{item.cat}</div>
                    <h3 className="product-name">{item.name}</h3>
                    <div className="product-price">{item.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What Our <span className="gold-text">Customers Say</span></h2>
            <p className="section-subtitle">Real reviews from real winter warriors</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-location">{t.location}</div>
                    <div className="stars" style={{ marginTop: '3px' }}>
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <FiStar key={i} fill="currentColor" size={12} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2>Get Exclusive ❄️ Winter Deals</h2>
            <p>Subscribe and get 15% off your first order + early access to new arrivals</p>
            <form
              className="newsletter-form"
              onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing! 🎉'); }}
            >
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
