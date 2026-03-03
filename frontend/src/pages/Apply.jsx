import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { projectsAPI, applicationsAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { TagsInput } from '../components/TagsInput';
import { APPLY, ROUTES, PROJECTS, COMMON, AUTH } from '../constants/messages';
import toast from 'react-hot-toast';

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
      <div className="flex items-center justify-center py-20">
        <span className="text-gray-600">{COMMON.LOADING}</span>
      </div>
    );
  }

  if (!isGeneralApply && (projectLoading || !project)) {
    if (projectLoading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
          <span className="ml-3 text-gray-600">{COMMON.LOADING}</span>
        </div>
      );
    }
    return (
      <div className="rounded-xl bg-white p-8 shadow-card border border-gray-100 text-center">
        <p className="text-gray-600">Project not found</p>
        <Link to={ROUTES.HOME} className="mt-4 inline-block text-primary-600 font-medium">
          {PROJECTS.BACK}
        </Link>
      </div>
    );
  }

  if (!isGeneralApply && project && project.status !== 'open') {
    return (
      <div className="rounded-xl bg-white p-8 shadow-card border border-gray-100 text-center">
        <p className="text-gray-600">{APPLY.PROJECT_CLOSED}</p>
        <Link to={ROUTES.HOME} className="mt-4 inline-block text-primary-600 font-medium">
          {PROJECTS.BACK}
        </Link>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitMutation.mutate();
  };

  return (
    <div>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 mb-6"
      >
        ← {PROJECTS.BACK}
      </Link>

      <div className="max-w-2xl space-y-6">
        {isGeneralApply && (
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center">
            <p className="text-sm font-medium text-indigo-900">
              You are applying for General Consideration.
            </p>
            <p className="mt-1 text-sm text-indigo-700">
              Our team will assign you to a suitable project after review.
            </p>
          </div>
        )}

        {!isGeneralApply && project && (
          <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{APPLY.SUMMARY}</h3>
            <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{project.domain} · {project.duration}</p>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
          </div>
        )}

        <div className="rounded-xl bg-white p-6 sm:p-8 shadow-card border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">{APPLY.TITLE}</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {user && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{AUTH.NAME}</label>
                  <input
                    type="text"
                    readOnly
                    value={user.name || ''}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{AUTH.EMAIL}</label>
                  <input
                    type="email"
                    readOnly
                    value={user.email || ''}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700"
                  />
                </div>
              </>
            )}
            <div>
              <label htmlFor="sop" className="block text-sm font-medium text-gray-700 mb-1">
                {APPLY.SOP_LABEL}
              </label>
              <textarea
                id="sop"
                rows={5}
                value={sop}
                onChange={(e) => setSop(e.target.value)}
                placeholder={APPLY.SOP_PLACEHOLDER}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {APPLY.SKILLS_LABEL}
              </label>
              <TagsInput
                value={skills}
                onChange={setSkills}
                placeholder={APPLY.SKILLS_PLACEHOLDER}
              />
            </div>
            <div>
              <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                {APPLY.RESUME_URL}
              </label>
              <input
                id="resumeUrl"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder={APPLY.RESUME_PLACEHOLDER}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitMutation.isLoading}
              className="w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {submitMutation.isLoading ? COMMON.LOADING : APPLY.CONFIRM_SUBMIT}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
