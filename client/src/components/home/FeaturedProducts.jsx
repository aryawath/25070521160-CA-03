import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { getProducts } from '../../api/api';
import ProductCard from '../products/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ featured: 'true', limit: 4 })
      .then((res) => setProducts(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="products-section">
        <div className="container">
          <div className="spinner-wrapper"><div className="spinner" /></div>
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        <div className="products-header">
          <div>
            <h2 className="section-title">Featured <span className="gold-text">Collection</span></h2>
            <p className="section-subtitle">Handpicked premium pieces for the season</p>
          </div>
          <Link to="/shop?featured=true" className="btn-dark">
            View All <FiArrowRight />
          </Link>
        </div>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <p>No products yet. <Link to="/shop" style={{ color: 'var(--gold)' }}>Seed products</Link> to get started.</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
