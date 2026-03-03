import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { PROJECTS, ROUTES, ADMIN } from '../constants/messages';

const DOMAIN_STYLES = {
  AI: 'bg-violet-100 text-violet-700 border-violet-200',
  Web: 'bg-blue-100 text-blue-700 border-blue-200',
  IoT: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Infrastructure: 'bg-amber-100 text-amber-700 border-amber-200',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
};

function getDomainStyle(domain) {
  if (!domain) return DOMAIN_STYLES.default;
  const key = Object.keys(DOMAIN_STYLES).find((k) => domain.toLowerCase().includes(k.toLowerCase()));
  return DOMAIN_STYLES[key] || DOMAIN_STYLES.default;
}

const CARD_ROOT_CLASS =
  'h-full flex flex-col glass glass-border rounded-[20px] p-5 shadow-card-light transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-light-hover hover:border-slate-200/80';
const APPLY_BUTTON_CLASS =
  'text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 rounded-full px-4 py-2 shadow-glow-sm hover:shadow-glow hover:scale-105 transition-all duration-300 whitespace-nowrap';

export function ProjectCard({
  project,
  user = null,
  showApplyButton = true,
  showAdminControls = false,
  showStatusBadge = true,
  onEdit,
  onDelete,
}) {
  const detailUrl = ROUTES.PROJECT_DETAILS.replace(':id', project._id);
  const applyUrl = ROUTES.APPLY_BY_PROJECT(project._id);
  const isOpen = project.status === 'open';
  const canShowApply = showApplyButton && isOpen;

  return (
    <div className={CARD_ROOT_CLASS}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold border ${getDomainStyle(project.domain)}`}>
          {project.domain || 'Project'}
        </span>
        {showStatusBadge && <StatusBadge status={project.status} />}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">{project.title}</h3>
      <div className="flex-1 min-h-0 flex flex-col">
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>
        {Array.isArray(project.requiredSkills) && project.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.requiredSkills.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200/80 px-2 py-0.5 text-xs text-slate-600"
              >
                {s}
              </span>
            ))}
            {project.requiredSkills.length > 3 && (
              <span className="text-xs text-slate-500">+{project.requiredSkills.length - 3}</span>
            )}
          </div>
        )}
      </div>
      <div className="mt-auto pt-3 border-t border-slate-200/80 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 border border-slate-200/80 px-3 py-1 text-xs text-slate-600 shrink-0">
          {project.duration}
        </span>
        <div className="flex gap-2 items-center shrink-0">
          <Link
            to={detailUrl}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors duration-300"
          >
            {PROJECTS.VIEW_DETAILS}
          </Link>
          {canShowApply && (
            <Link
              to={user ? applyUrl : ROUTES.LOGIN}
              state={!user ? { redirectToApply: project._id } : undefined}
              className={APPLY_BUTTON_CLASS}
            >
              {PROJECTS.APPLY_NOW}
            </Link>
          )}
          {showAdminControls && (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(project)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {ADMIN.EDIT}
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(project)}
                className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                {ADMIN.DELETE}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
