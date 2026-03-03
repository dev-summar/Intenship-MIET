import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { projectsAPI } from '../api/services';
import { ProjectCard } from '../components/ProjectCard';
import { ADMIN, COMMON } from '../constants/messages';
import toast from 'react-hot-toast';

export function AdminProjects() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    projectCode: '',
    title: '',
    description: '',
    domain: '',
    requiredSkills: '',
    duration: '',
    status: 'open',
  });

  const { data, isLoading } = useQuery(
    ['admin-projects'],
    () => projectsAPI.getAll({ limit: 100 }).then((res) => res.data)
  );
  const projects = data?.data?.projects || [];

  const createMutation = useMutation(
    (payload) => projectsAPI.create(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-projects']);
        toast.success(ADMIN.PROJECT_CREATED);
        closeModal();
      },
      onError: (err) => toast.error(err?.response?.data?.message || COMMON.ERROR),
    }
  );

  const updateMutation = useMutation(
    ({ id, payload }) => projectsAPI.update(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-projects']);
        toast.success(ADMIN.PROJECT_UPDATED);
        closeModal();
      },
      onError: (err) => toast.error(err?.response?.data?.message || COMMON.ERROR),
    }
  );

  const deleteMutation = useMutation(
    (id) => projectsAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-projects']);
        toast.success(ADMIN.PROJECT_DELETED);
      },
      onError: (err) => toast.error(err?.response?.data?.message || COMMON.ERROR),
    }
  );

  function openCreate() {
    setEditing(null);
    setForm({
      projectCode: '',
      title: '',
      description: '',
      domain: '',
      requiredSkills: '',
      duration: '',
      status: 'open',
    });
    setModalOpen(true);
  }

  function openEdit(p) {
    setEditing(p);
    setForm({
      projectCode: p.projectCode || '',
      title: p.title || '',
      description: p.description || '',
      domain: p.domain || '',
      requiredSkills: Array.isArray(p.requiredSkills) ? p.requiredSkills.join(', ') : '',
      duration: p.duration || '',
      status: p.status || 'open',
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      requiredSkills: form.requiredSkills ? form.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleDelete(project) {
    if (window.confirm('Delete this project?')) deleteMutation.mutate(project._id);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
        <span className="ml-3 text-gray-600">{COMMON.LOADING}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{ADMIN.PROJECTS}</h1>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          {ADMIN.ADD_PROJECT}
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl bg-white p-12 shadow-card border border-gray-100 text-center">
          <p className="text-gray-900 font-medium">{ADMIN.NO_PROJECTS}</p>
          <button
            onClick={openCreate}
            className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {ADMIN.CREATE_PROJECT}
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project._id} className="h-full min-h-[280px]">
              <ProjectCard
                project={project}
                showApplyButton={false}
                showAdminControls={true}
                showStatusBadge={true}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editing ? ADMIN.EDIT : ADMIN.CREATE_PROJECT}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.PROJECT_CODE}</label>
                  <input
                    value={form.projectCode}
                    onChange={(e) => setForm((f) => ({ ...f, projectCode: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                    disabled={!!editing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.TITLE}</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.DESCRIPTION}</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.DOMAIN}</label>
                  <input
                    value={form.domain}
                    onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.REQUIRED_SKILLS}</label>
                  <input
                    value={form.requiredSkills}
                    onChange={(e) => setForm((f) => ({ ...f, requiredSkills: e.target.value }))}
                    placeholder="Comma separated"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.DURATION}</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.STATUS}</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {ADMIN.CANCEL}
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {editing ? ADMIN.SAVE : ADMIN.CREATE_PROJECT}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
