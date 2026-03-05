import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { projectsAPI, applicationsAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { TagsInput } from '../components/TagsInput';
import { APPLY, ROUTES, PROJECTS, COMMON, AUTH } from '../constants/messages';
import toast from 'react-hot-toast';
import './Apply.css';

export function Apply() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isGeneralApply = projectId === 'general';

  const [sop, setSop] = useState('');
  const [skills, setSkills] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');

  const { data: projectData, isLoading: projectLoading } = useQuery(
    ['project', projectId],
    () => projectsAPI.getById(projectId).then((res) => res.data),
    { enabled: !!projectId && !isGeneralApply }
  );

  const project = projectData?.data?.project;

  const submitMutation = useMutation(
    async () =>
      applicationsAPI.apply({
        project: isGeneralApply ? null : projectId,
        sop,
        skills,
        resumeUrl: resumeUrl || undefined,
      }),
    {
      onSuccess: (res) => {
        if (res?.data?.success) {
          toast.success(APPLY.SUCCESS);
          queryClient.invalidateQueries(['my-applications']);
          navigate(ROUTES.STUDENT_DASHBOARD);
        }
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || err?.message || COMMON.ERROR);
      },
    }
  );

  if (!projectId) {
    return (
      <div className="apply-page">
        <div className="apply-loading-wrap">
          <span>{COMMON.LOADING}</span>
        </div>
      </div>
    );
  }

  if (!isGeneralApply && (projectLoading || !project)) {
    if (projectLoading) {
      return (
        <div className="apply-page">
          <div className="apply-loading-wrap">
            <div className="apply-loading-spinner" />
            <span>{COMMON.LOADING}</span>
          </div>
        </div>
      );
    }
    return (
      <div className="apply-page">
        <div className="apply-loading-wrap">
          <div className="apply-error-card">
            <p>Project not found</p>
            <Link to={ROUTES.HOME}>{PROJECTS.BACK}</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isGeneralApply && project && project.status !== 'open') {
    return (
      <div className="apply-page">
        <div className="apply-loading-wrap">
          <div className="apply-error-card">
            <p>{APPLY.PROJECT_CLOSED}</p>
            <Link to={ROUTES.HOME}>{PROJECTS.BACK}</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <div className="apply-page">
      <Link to={ROUTES.HOME} className="apply-back-link">
        ← {PROJECTS.BACK}
      </Link>

      <div className="apply-container">
        {isGeneralApply && (
          <div className="apply-general-notice" style={{ gridColumn: '1 / -1' }}>
            <p>You are applying for General Consideration.</p>
            <p>Our team will assign you to a suitable project after review.</p>
          </div>
        )}

        <div className="apply-form-card">
          <h1 className="apply-form-title">{APPLY.TITLE}</h1>
          <form onSubmit={handleSubmit} className="apply-form">
            {user && (
              <>
                <div className="apply-field">
                  <label>{AUTH.NAME}</label>
                  <input
                    type="text"
                    readOnly
                    value={user.name || ''}
                    className="apply-input apply-input-disabled"
                  />
                </div>
                <div className="apply-field">
                  <label>{AUTH.EMAIL}</label>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ''}
                    className="apply-input apply-input-disabled"
                  />
                </div>
              </>
            )}
            <div className="apply-field">
              <label htmlFor="sop">{APPLY.SOP_LABEL}</label>
              <textarea
                id="sop"
                rows={5}
                value={sop}
                onChange={(e) => setSop(e.target.value)}
                placeholder={APPLY.SOP_PLACEHOLDER}
                className="apply-textarea"
                required
              />
            </div>
            <div className="apply-field">
              <label>{APPLY.SKILLS_LABEL}</label>
              <div className="apply-tags-wrap">
                <TagsInput
                  value={skills}
                  onChange={setSkills}
                  placeholder={APPLY.SKILLS_PLACEHOLDER}
                />
              </div>
            </div>
            <div className="apply-field">
              <label htmlFor="resumeUrl">{APPLY.RESUME_URL}</label>
              <input
                id="resumeUrl"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder={APPLY.RESUME_PLACEHOLDER}
                className="apply-input"
              />
            </div>
            <button
              type="submit"
              disabled={submitMutation.isLoading}
              className="apply-submit"
            >
              {submitMutation.isLoading ? COMMON.LOADING : APPLY.CONFIRM_SUBMIT}
            </button>
          </form>
        </div>

        {!isGeneralApply && project && (
          <div className="apply-summary-card apply-summary-first">
            <div className="apply-summary-label">{APPLY.SUMMARY}</div>
            <h2 className="apply-summary-title">{project.title}</h2>
            <p className="apply-summary-meta">{project.domain} · {project.duration}</p>
            {project.description && (
              <>
                <hr className="apply-summary-divider" />
                <p className="apply-summary-desc">{project.description}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
