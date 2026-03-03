import { PROJECTS, STUDENT_DASHBOARD, ADMIN } from '../constants/messages';

const statusConfig = {
  open: { label: PROJECTS.OPEN, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  closed: { label: PROJECTS.CLOSED, className: 'bg-slate-100 text-slate-600 border-slate-200' },
  pending: { label: STUDENT_DASHBOARD.PENDING, className: 'bg-amber-100 text-amber-800 border-amber-200' },
  approved: { label: ADMIN.APPROVED, className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  rejected: { label: ADMIN.REJECTED, className: 'bg-red-100 text-red-800 border-red-200' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
