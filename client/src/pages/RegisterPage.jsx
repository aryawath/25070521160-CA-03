import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiCheck, FiShield, FiTruck, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { registerUser } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please complete all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (!agreed) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success(`Account created! Welcome to WinterEdge, ${res.data.user.name}! ❄️`);
        navigate('/shop');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try a different email.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Visual Left Side */}
      <div className="auth-visual">
        <div className="auth-visual-bg">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200"
            alt="Winter Collection"
            className="auth-visual-img"
          />
          <div className="auth-visual-overlay" />
        </div>

        <div className="auth-visual-content">
          <div className="logo-icon" style={{ margin: '0 auto 1.5rem', width: '56px', height: '56px', fontSize: '1.75rem' }}>
            W
          </div>
          <h2>Join the Winter Circle</h2>
          <p>
            Create your profile to unlock priority access to seasonal drops, customized sizing, and instant order tracking.
          </p>

          <div className="auth-perks">
            <div className="auth-perk">
              <div className="perk-icon"><FiAward /></div>
              <span>Earn 100 Reward Points on Signup</span>
            </div>
            <div className="auth-perk">
              <div className="perk-icon"><FiTruck /></div>
              <span>Free Express Delivery on Orders over ₹1999</span>
            </div>
            <div className="auth-perk">
              <div className="perk-icon"><FiShield /></div>
              <span>Hassle-Free 14-Day Winter Trial & Returns</span>
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
            <h1>Create Account</h1>
            <p>Enter your details to create your WinterEdge membership.</p>
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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full Name</label>
              <div className="form-input-wrapper">
                <FiUser className="form-icon" />
                <input
                  id="name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Arya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
              <label className="form-label" htmlFor="password">Password (min. 6 characters)</label>
              <div className="form-input-wrapper">
                <FiLock className="form-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Create a secure password"
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

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="form-input-wrapper">
                <FiLock className="form-icon" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span style={{ fontSize: '0.85rem' }}>
                  I agree to the <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Terms of Service</a> & <a href="#" style={{ color: 'var(--primary)', fontWeight: 600 }}>Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating Membership...' : 'Create WinterEdge Account'}
            </button>
          </form>

          <div className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
