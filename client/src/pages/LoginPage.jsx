import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheck, FiShield, FiTruck, FiGift } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { loginUser } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await loginUser(formData);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(`Welcome back, ${res.data.user.name}! ❄️`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'admin') {
      setFormData({ email: 'admin@winteredge.com', password: 'admin123' });
    } else {
      setFormData({ email: 'demo@winteredge.com', password: 'demo123' });
    }
    setError('');
  };

  return (
    <div className="auth-page">
      {/* Visual Left Side */}
      <div className="auth-visual">
        <div className="auth-visual-bg">
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200"
            alt="Winter Luxury"
            className="auth-visual-img"
          />
          <div className="auth-visual-overlay" />
        </div>

        <div className="auth-visual-content">
          <div className="logo-icon" style={{ margin: '0 auto 1.5rem', width: '56px', height: '56px', fontSize: '1.75rem' }}>
            W
          </div>
          <h2>Step Into Warmth</h2>
          <p>
            Experience handpicked winter couture, exclusive releases, and member-only privilege pricing.
          </p>

          <div className="auth-perks">
            <div className="auth-perk">
              <div className="perk-icon"><FiShield /></div>
              <span>100% Authentic Cashmere & Down Insulation</span>
            </div>
            <div className="auth-perk">
              <div className="perk-icon"><FiTruck /></div>
              <span>Express Insured Shipping Across India</span>
            </div>
            <div className="auth-perk">
              <div className="perk-icon"><FiGift /></div>
              <span>10% Welcome Discount on First Order</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Right Side */}
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          <div className="auth-form-header">
            <Link to="/" className="back-link">
              <FiArrowLeft /> Back to WinterEdge
            </Link>
            <h1>Welcome Back</h1>
            <p>Enter your details to sign in to your WinterEdge account.</p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(229,62,62,0.1)',
              border: '1px solid var(--danger)',
              color: 'var(--danger)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          {/* Quick Demo Login Chips */}
          <div style={{
            background: 'var(--frost)',
            padding: '0.85rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-dark)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
              ⚡ Quick One-Click Demo Credentials:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => fillDemoAccount('demo')}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-dark)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  cursor: 'pointer'
                }}
              >
                👤 Customer (demo@winteredge.com)
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                style={{
                  background: 'var(--primary)',
                  border: '1px solid var(--primary)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  cursor: 'pointer'
                }}
              >
                👑 Admin (admin@winteredge.com)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="form-input-wrapper">
                <FiMail className="form-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <FiLock className="form-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="form-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="remember-forgot">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <a href="#forgot" onClick={(e) => { e.preventDefault(); toast('Password reset link has been dispatched to your email.', { icon: '📧' }); }} className="forgot-link">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>Signing In...</>
              ) : (
                <>Sign In to Account</>
              )}
            </button>
          </form>

          <div className="auth-footer-text">
            Don't have an account yet?{' '}
            <Link to="/register">Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
