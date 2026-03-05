import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH, ROUTES } from '../constants/messages';
import toast from 'react-hot-toast';
import './AdminLogin.css';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await adminLogin(email, password);
      toast.success(AUTH.LOGIN_SUCCESS);
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true, state: {} });
    } catch (err) {
      toast.error(err?.message || AUTH.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Admin sign in</h1>
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="email" className="admin-login-label">
              {AUTH.EMAIL}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">
              {AUTH.PASSWORD}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="admin-login-submit"
          >
            {loading ? 'Signing in...' : AUTH.LOGIN}
          </button>
        </form>
        <p className="admin-login-footer">
          <Link to={ROUTES.LOGIN}>Student login</Link>
        </p>
      </div>
    </div>
  );
}
