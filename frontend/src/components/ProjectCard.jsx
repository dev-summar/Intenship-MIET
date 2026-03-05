import { Link } from 'react-router-dom';
import { PROJECTS, ROUTES, ADMIN } from '../constants/messages';
import './ProjectCard.css';

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
  const skills = Array.isArray(project.requiredSkills) ? project.requiredSkills : [];
  const statusLabel = project.status === 'open' ? PROJECTS.OPEN : PROJECTS.CLOSED;

  return (
    <div className="project-card">
      <div className="project-card__domain">
        {project.domain || 'Project'}
      </div>
      <h3 className="project-card__title">{project.title}</h3>
      <div className="project-card__description-wrap">
        <p className="project-card__description">{project.description}</p>
        <div className="project-card__spacer" aria-hidden />
        {skills.length > 0 && (
          <div className="project-card__skills">
            {skills.slice(0, 3).map((s, i) => (
              <span key={i} className="project-card__skill-chip">
                {s}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="project-card__skill-more">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
      <hr className="project-card__divider" />
      <div className="project-card__footer-row1">
        <span className="project-card__duration">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M6 3.5V6l2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          {project.duration}
        </span>
        {showStatusBadge && (
          <span
            className={`project-card__status ${
              project.status === 'closed' ? 'project-card__status--closed' : ''
            }`}
          >
            <span className="project-card__status-dot" />
            {statusLabel}
          </span>
        )}
      </div>
      <div className="project-card__footer-row2">
        <div className="project-card__footer-left">
          <Link to={detailUrl} className="project-card__view-details">
            {PROJECTS.VIEW_DETAILS}
          </Link>
          {showAdminControls && (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(project)}
                className="project-card__admin-btn project-card__admin-btn--edit"
              >
                {ADMIN.EDIT}
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(project)}
                className="project-card__admin-btn project-card__admin-btn--delete"
              >
                {ADMIN.DELETE}
              </button>
            </>
          )}
        </div>
        <div className="project-card__actions-right">
          {canShowApply && (
            <Link
              to={user ? applyUrl : ROUTES.LOGIN}
              state={!user ? { redirectToApply: project._id } : undefined}
              className="project-card__apply-btn"
            >
              {PROJECTS.APPLY_NOW}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
