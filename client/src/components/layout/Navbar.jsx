import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiSearch, FiUser, FiMenu, FiX, FiHeart, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartSidebar from './CartSidebar';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=jackets', label: 'Jackets' },
    { to: '/shop?category=sweaters', label: 'Sweaters' },
    { to: '/shop?newArrival=true', label: 'New Arrivals' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-inner">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <div className="logo-icon">W</div>
              <span className="logo-text">Winter<span>Edge</span></span>
            </Link>

            {/* Desktop Links */}
            <ul className="navbar-links">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.to === '/'}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="navbar-actions">
              <button className="nav-icon-btn" onClick={() => navigate('/shop')}>
                <FiSearch />
              </button>

              <button className="nav-icon-btn" onClick={() => setCartOpen(true)}>
                <FiShoppingBag />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              {user ? (
                <div
                  className={`user-dropdown ${dropdownOpen ? 'open' : ''}`}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button className="nav-icon-btn">
                    <FiUser />
                  </button>
                  <div className="user-dropdown-menu">
                    <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-dark)' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {user.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiSettings size={15} /> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiPackage size={15} /> My Orders
                    </Link>
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>
                  Sign In
                </Link>
              )}

              {/* Hamburger */}
              <button className="hamburger" onClick={() => setMobileOpen(true)}>
                <span /><span /><span />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>
          <FiX />
        </button>
        {navLinks.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
            {link.label}
          </Link>
        ))}
        {user ? (
          <button
            onClick={handleLogout}
            style={{ color: '#e2b96f', fontFamily: 'Playfair Display', fontSize: '2rem', fontWeight: 700, background: 'none' }}
          >
            Sign Out
          </button>
        ) : (
          <Link to="/login" onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold)' }}>
            Sign In
          </Link>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
