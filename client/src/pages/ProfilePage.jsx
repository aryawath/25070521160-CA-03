import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPackage, FiShield, FiLogOut, FiCheck, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword } from '../api/api';

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);

  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passLoading, setPassLoading] = useState(false);

  if (!user) {
    return (
      <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔒</div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', marginBottom: '1rem' }}>Please Sign In</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Sign in to access your personal profile and account preferences.
        </p>
        <Link to="/login" className="btn-primary">Sign In</Link>
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Name cannot be empty');

    try {
      setProfileLoading(true);
      const res = await updateProfile({ name });
      if (res.data.success) {
        setUser((prev) => ({ ...prev, name }));
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters');
    }
    if (passData.newPassword !== passData.confirmNewPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setPassLoading(true);
      const res = await changePassword({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully! 🔐');
        setPassData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password. Check current password.');
    } finally {
      setPassLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully.');
    navigate('/');
  };

  return (
    <div className="page-fade-in" style={{ padding: '3rem 0 6rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Profile Header */}
        <div style={{
          background: 'var(--gradient-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '2.5rem',
          color: 'var(--white)',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--gradient-gold)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'Playfair Display, serif'
            }}>
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.85rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                {user.name}
              </h1>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                {user.email} • <span style={{ textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>{user.role} Member</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/orders" className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}>
              <FiPackage style={{ marginRight: '0.4rem' }} /> My Orders
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--white)',
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <FiLogOut /> Sign Out
            </button>
          </div>
        </div>

        {/* 2-Column Forms: Personal Info & Security */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {/* Personal Info */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border-dark)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiUser style={{ color: 'var(--primary)' }} /> Personal Details
            </h3>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <FiUser className="form-icon" />
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <div className="form-input-wrapper">
                  <FiMail className="form-icon" />
                  <input
                    type="email"
                    className="form-input"
                    value={user.email}
                    disabled
                    style={{ background: 'var(--frost)', cursor: 'not-allowed', opacity: 0.8 }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Membership Tier</label>
                <div style={{
                  background: 'var(--snow)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <FiShield style={{ color: 'var(--gold)' }} />
                  <strong>WinterEdge VIP {user.role === 'admin' ? '(Admin Access)' : 'Member'}</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="btn-dark"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FiSave /> {profileLoading ? 'Saving Changes...' : 'Save Profile Details'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            border: '1px solid var(--border-dark)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiLock style={{ color: 'var(--primary)' }} /> Security & Password
            </h3>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <div className="form-input-wrapper">
                  <FiLock className="form-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Enter current password"
                    value={passData.currentPassword}
                    onChange={(e) => setPassData((p) => ({ ...p, currentPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <div className="form-input-wrapper">
                  <FiLock className="form-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 6 characters"
                    value={passData.newPassword}
                    onChange={(e) => setPassData((p) => ({ ...p, newPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <div className="form-input-wrapper">
                  <FiLock className="form-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Repeat new password"
                    value={passData.confirmNewPassword}
                    onChange={(e) => setPassData((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="btn-primary"
                style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <FiCheck /> {passLoading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
