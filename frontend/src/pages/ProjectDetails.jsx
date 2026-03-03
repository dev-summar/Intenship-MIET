import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { projectsAPI } from '../api/services';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { PROJECTS, ROUTES, COMMON } from '../constants/messages';

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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
        <span className="ml-3 text-slate-600">{COMMON.LOADING}</span>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="glass glass-border rounded-2xl p-8 text-center shadow-card-light">
        <p className="text-slate-600 mb-4">Project not found</p>
        <Link
          to={ROUTES.OPEN_PROJECTS}
          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          {PROJECTS.BACK}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        to={ROUTES.OPEN_PROJECTS}
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6 transition-colors"
      >
        ← {PROJECTS.BACK}
      </Link>
      <div className="glass glass-border rounded-2xl p-6 sm:p-8 shadow-card-light">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              {project.projectCode}
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{project.title}</h1>
            <p className="text-slate-600 mt-1">{project.domain}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <dl className="grid gap-4 sm:grid-cols-2 border-t border-slate-200 pt-6">
          <div>
            <dt className="text-sm font-medium text-slate-500">{PROJECTS.DURATION}</dt>
            <dd className="mt-1 text-slate-800">{project.duration}</dd>
          </div>
          {project.createdBy && (
            <div>
              <dt className="text-sm font-medium text-slate-500">{PROJECTS.CREATED_BY}</dt>
              <dd className="mt-1 text-slate-800">
                {project.createdBy.name} {project.createdBy.email && `(${project.createdBy.email})`}
              </dd>
            </div>
          )}
        </dl>
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-medium text-slate-500 mb-2">{PROJECTS.DESCRIPTION}</h3>
          <p className="text-slate-700 whitespace-pre-wrap">{project.description}</p>
        </div>
        {Array.isArray(project.requiredSkills) && project.requiredSkills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-2">{PROJECTS.SKILLS}</h3>
            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 px-3 py-1 text-sm text-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {user?.role === 'student' && project.status === 'open' && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <Link
              to={ROUTES.APPLY_BY_PROJECT(project._id)}
              className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-400 hover:to-violet-400 px-5 py-2.5 text-sm font-semibold text-white shadow-glow-sm hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              {PROJECTS.APPLY_NOW}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
