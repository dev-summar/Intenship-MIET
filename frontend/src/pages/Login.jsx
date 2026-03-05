import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH, ROUTES } from '../constants/messages';
import toast from 'react-hot-toast';
import './Login.css';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectToApply = location.state?.redirectToApply;

  const getRedirectPath = (user) => {
    if (redirectToApply) return ROUTES.APPLY_BY_PROJECT(redirectToApply);
    if (location.state?.from?.pathname) return location.state.from.pathname;
    if (user?.role === 'student') return ROUTES.STUDENT_DASHBOARD;
    return ROUTES.HOME;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(username, password);
      toast.success(AUTH.LOGIN_SUCCESS);
      const path = getRedirectPath(data?.user);
      navigate(path, { replace: true, state: {} });
    } catch (err) {
      toast.error(err?.message || AUTH.INVALID_CREDENTIALS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <header>
          <h1 className="login-title">Director&apos;s Internship</h1>
          <p className="login-subtitle">Login with your PI360 credentials</p>
          <img
            src="https://pi360.net/pi360_website/wordpress/wp-content/uploads/2025/12/icon-pi360.png"
            alt="PI360"
            className="login-logo"
          />
        </header>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="username" className="login-label">
              Email or username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              placeholder="Institute email or username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password" className="login-label">
              {AUTH.PASSWORD}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
            <div className="login-forgot-wrap">
              <button type="button" className="login-forgot">
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit"
          >
            {loading ? 'Signing in...' : AUTH.LOGIN}
          </button>
        </form>

        <p className="login-footer">
          By signing in, you agree to our Privacy Policy &amp; Terms of Use
        </p>

        <p className="login-admin-wrap">
          <span className="login-admin-text">{AUTH.ADMIN_PROMPT}</span>
          <br />
          <Link to={ROUTES.ADMIN_LOGIN} className="login-admin-link">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}
