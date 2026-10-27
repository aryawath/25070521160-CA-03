import { useNavigate } from 'react-router-dom';

const categories = [
  { emoji: '🧥', name: 'Jackets', key: 'jackets', count: '50+ styles' },
  { emoji: '🪥', name: 'Coats', key: 'coats', count: '35+ styles' },
  { emoji: '🧶', name: 'Sweaters', key: 'sweaters', count: '80+ styles' },
  { emoji: '👢', name: 'Boots', key: 'boots', count: '40+ styles' },
  { emoji: '🧣', name: 'Accessories', key: 'accessories', count: '60+ items' },
  { emoji: '👔', name: "Men's Wear", key: "men's wear", count: '45+ styles' },
  { emoji: '👗', name: "Women's Wear", key: "women's wear", count: '55+ styles' },
  { emoji: '🧒', name: "Kids' Wear", key: "kids' wear", count: '30+ styles' },
];

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by <span className="gold-text">Category</span></h2>
          <p className="section-subtitle">Find exactly what you need for the winter season</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="category-card"
              onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.key)}`)}
            >
              <span className="category-icon">{cat.emoji}</span>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
