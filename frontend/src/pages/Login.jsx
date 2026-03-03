import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH, ROUTES } from '../constants/messages';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Branding */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Director&apos;s Internship
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Login with your PI360 credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email or username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Institute email or username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              {AUTH.PASSWORD}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Signing in...' : AUTH.LOGIN}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400 text-center">
          By signing in, you agree to our Privacy Policy &amp; Terms of Use
        </p>

        <p className="mt-6 text-center text-sm text-gray-500">
          <span>{AUTH.ADMIN_PROMPT}</span>
          <br />
          <Link
            to={ROUTES.ADMIN_LOGIN}
            className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}
