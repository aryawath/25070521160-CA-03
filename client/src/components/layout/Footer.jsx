import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="navbar-logo" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon">W</div>
              <span className="logo-text">Winter<span>Edge</span></span>
            </div>
            <p>
              Premium winter wear crafted for the bold and the cold. Explore our exclusive collection 
              of jackets, coats, sweaters, and accessories — designed to keep you warm in style.
            </p>
            <div className="footer-socials">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a key={i} href="#" className="social-btn"><Icon /></a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="footer-heading">Shop</h4>
            <ul className="footer-links">
              {[
                { to: '/shop?category=jackets', label: 'Jackets' },
                { to: '/shop?category=coats', label: 'Coats' },
                { to: '/shop?category=sweaters', label: 'Sweaters' },
                { to: "/shop?category=boots", label: 'Boots' },
                { to: '/shop?category=accessories', label: 'Accessories' },
                { to: '/shop?newArrival=true', label: 'New Arrivals' },
              ].map((link) => (
                <li key={link.to}><Link to={link.to}>{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="footer-heading">Company</h4>
            <ul className="footer-links">
              {['About Us', 'Careers', 'Press', 'Blog', 'Affiliates', 'Gift Cards'].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links" style={{ marginBottom: '1.5rem' }}>
              {['Shipping Info', 'Returns & Exchanges', 'Size Guide', 'Track Order', 'FAQs', 'Contact Us'].map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                <FiMail size={14} /> support@winteredge.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                <FiPhone size={14} /> +91 98765 43210
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
                <FiMapPin size={14} /> Delhi, India
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {year} WinterEdge. All rights reserved. Made with ❄️ in India</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
