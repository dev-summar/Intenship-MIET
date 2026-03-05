import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { projectsAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { PROJECTS, ROUTES, COMMON } from '../constants/messages';
import './ProjectDetails.css';

export function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data, isLoading, isError, refetch } = useQuery(
    ['project', id],
    () => projectsAPI.getById(id).then((res) => res.data),
    { enabled: !!id }
  );

  const project = data?.data?.project;

  if (isLoading) {
    return (
      <div className="project-details-page">
        <div className="pd-loading">
          <div className="pd-loading-spinner" />
          <span className="pd-loading-text">{COMMON.LOADING}</span>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="project-details-page">
        <div className="pd-error">
          <p>Project not found</p>
          <Link to={ROUTES.OPEN_PROJECTS}>← {PROJECTS.BACK}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="project-details-page">
      <Link to={ROUTES.OPEN_PROJECTS} className="pd-back">
        ← {PROJECTS.BACK}
      </Link>
      <div className="pd-container">
        <div className="pd-card">
          <div className="pd-header">
            <div>
              <span className="pd-code">{project.projectCode}</span>
              <h1 className="pd-title">{project.title}</h1>
              <p className="pd-domain">{project.domain}</p>
            </div>
            <span className="pd-status">{project.status === 'open' ? PROJECTS.OPEN : PROJECTS.CLOSED}</span>
          </div>

          <hr className="pd-divider" />
          <dl className="pd-meta">
            <div>
              <dt>{PROJECTS.DURATION}</dt>
              <dd>{project.duration}</dd>
            </div>
            {project.createdBy && (
              <div>
                <dt>{PROJECTS.CREATED_BY}</dt>
                <dd>
                  {project.createdBy.name} {project.createdBy.email && `(${project.createdBy.email})`}
                </dd>
              </div>
            )}
          </dl>

          <hr className="pd-divider" />
          <div className="pd-section">
            <h3 className="pd-section-title">{PROJECTS.DESCRIPTION}</h3>
            <p className="pd-description">{project.description}</p>
          </div>

          {Array.isArray(project.requiredSkills) && project.requiredSkills.length > 0 && (
            <>
              <hr className="pd-divider" />
              <div className="pd-section">
                <h3 className="pd-section-title">{PROJECTS.SKILLS}</h3>
                <div className="pd-skills">
                  {project.requiredSkills.map((s, i) => (
                    <span key={i} className="pd-skill-chip">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {user?.role === 'student' && project.status === 'open' && (
            <>
              <hr className="pd-divider" />
              <div className="pd-section pd-apply-wrap">
                <Link to={ROUTES.APPLY_BY_PROJECT(project._id)} className="pd-apply-btn">
                  {PROJECTS.APPLY_NOW}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
