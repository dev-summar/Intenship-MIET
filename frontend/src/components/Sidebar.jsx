import { NavLink } from 'react-router-dom';
import { ADMIN, ROUTES } from '../constants/messages';

const links = [
  { to: ROUTES.ADMIN_DASHBOARD, label: ADMIN.DASHBOARD },
  { to: ROUTES.ADMIN_PROJECTS, label: ADMIN.PROJECTS },
  { to: ROUTES.ADMIN_APPLICATIONS, label: ADMIN.APPLICATIONS },
  { to: ROUTES.ADMIN_ALUMNI, label: ADMIN.ALUMNI },
  { to: ROUTES.ADMIN_HOMEPAGE, label: 'Homepage' },
];

export function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 bg-white">
      <nav className="p-4 space-y-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
