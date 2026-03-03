import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AUTH, ROUTES } from '../constants/messages';
import toast from 'react-hot-toast';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectToApply = location.state?.redirectToApply;

  const getRedirectPath = (user) => {
    if (redirectToApply) return ROUTES.APPLY_BY_PROJECT(redirectToApply);
    if (user?.role === 'student') return ROUTES.STUDENT_DASHBOARD;
    if (user?.role === 'admin' || user?.role === 'faculty') return ROUTES.ADMIN_DASHBOARD;
    return ROUTES.HOME;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register({ name, email, password, role });
      toast.success(AUTH.REGISTER_SUCCESS);
      const path = getRedirectPath(data?.user);
      navigate(path, { replace: true, state: {} });
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-card border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{AUTH.REGISTER_TITLE}</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {AUTH.NAME}
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {AUTH.EMAIL}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {AUTH.PASSWORD}
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                minLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                {AUTH.ROLE}
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              >
                <option value="faculty">Faculty</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : AUTH.REGISTER}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            {AUTH.HAVE_ACCOUNT}{' '}
            <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-700">
              {AUTH.LOGIN}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
