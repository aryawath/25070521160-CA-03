import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiGrid, FiList, FiX } from 'react-icons/fi';
import { getProducts } from '../api/api';
import ProductCard from '../components/products/ProductCard';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'jackets', label: 'Jackets' },
  { value: 'coats', label: 'Coats' },
  { value: 'sweaters', label: 'Sweaters' },
  { value: 'boots', label: 'Boots' },
  { value: 'accessories', label: 'Accessories' },
  { value: "men's wear", label: "Men's Wear" },
  { value: "women's wear", label: "Women's Wear" },
  { value: "kids' wear", label: "Kids' Wear" },
];

const SORTS = [
  { value: 'createdAt-desc', label: 'Latest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [sort, setSort] = useState('createdAt-desc');

  const categoryParam = searchParams.get('category') || '';
  const featuredParam = searchParams.get('featured') || '';
  const newArrivalParam = searchParams.get('newArrival') || '';

  const [activeCategory, setActiveCategory] = useState(categoryParam);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [sortBy, order] = sort.split('-');
      const params = { page, limit: 12, sortBy, order };
      if (activeCategory) params.category = activeCategory;
      if (search) params.search = search;
      if (featuredParam) params.featured = featuredParam;
      if (newArrivalParam) params.newArrival = newArrivalParam;

      const res = await getProducts(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, search, sort, featuredParam, newArrivalParam]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
    const params = {};
    if (cat) params.category = cat;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="page-fade-in">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <h1>
            {activeCategory
              ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
              : newArrivalParam
              ? 'New Arrivals'
              : featuredParam
              ? 'Featured Collection'
              : 'Winter Collection'}
          </h1>
          <p>
            {total > 0 ? `${total} products found` : 'Explore our exclusive winter wear'}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
        {/* Filter Bar */}
        <div className="filter-bar">
          {/* Search */}
          <form className="search-bar" onSubmit={handleSearchSubmit} style={{ flex: 1, minWidth: '200px' }}>
            <FiSearch size={16} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearch(''); }}
                style={{ color: 'var(--text-muted)', background: 'none', fontSize: '0.9rem' }}
              >
                <FiX size={14} />
              </button>
            )}
          </form>

          {/* Categories */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`filter-btn ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => handleCategoryChange(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="spinner-wrapper"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No products found</h3>
            <p>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-sm)',
                      background: page === i + 1 ? 'var(--gradient-primary)' : 'var(--white)',
                      color: page === i + 1 ? 'var(--white)' : 'var(--text-secondary)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      border: '2px solid var(--border-dark)',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
