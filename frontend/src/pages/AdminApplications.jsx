import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminAPI } from '../api/services';
import { StatusBadge } from '../components/StatusBadge';
import { ADMIN, COMMON } from '../constants/messages';
import toast from 'react-hot-toast';

export function AdminApplications() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [modalApp, setModalApp] = useState(null);
  const [decision, setDecision] = useState({ status: 'approved', remarks: '' });

  const { data, isLoading } = useQuery(
    ['admin-applications', statusFilter],
    () => adminAPI.getApplications(statusFilter ? { status: statusFilter } : {}).then((res) => res.data)
  );
  const applications = data?.data?.applications || [];

  const patchMutation = useMutation(
    ({ id, payload }) => adminAPI.patchApplicationStatus(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-applications']);
        toast.success(ADMIN.APPLICATION_UPDATED);
        setModalApp(null);
      },
      onError: (err) => toast.error(err?.response?.data?.message || COMMON.ERROR),
    }
  );

  const openModal = (app) => {
    setModalApp(app);
    setDecision({
      status: app.status === 'pending' ? 'approved' : app.status,
      remarks: app.remarks || '',
    });
  };

  const handleDecide = (e) => {
    e.preventDefault();
    if (!modalApp) return;
    const payload = { status: decision.status };
    if (decision.remarks.trim()) payload.remarks = decision.remarks.trim();
    patchMutation.mutate({ id: modalApp._id, payload });
  };

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
        <h1 className="text-2xl font-bold text-gray-900">{ADMIN.APPLICATIONS}</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="pending">{ADMIN.PENDING}</option>
          <option value="approved">{ADMIN.APPROVED}</option>
          <option value="rejected">{ADMIN.REJECTED}</option>
        </select>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl bg-white p-12 shadow-card border border-gray-100 text-center">
          <p className="text-gray-900 font-medium">{ADMIN.NO_APPLICATIONS}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="rounded-xl bg-white p-5 shadow-card border border-gray-100 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {app.student?.name} · {app.student?.email}
                </p>
                <p className="text-sm text-gray-500">
                  {app.project?.projectCode} — {app.project?.title}
                </p>
                {app.resumeUrl && (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline mt-1 inline-block"
                  >
                    Resume
                  </a>
                )}
              </div>
              <StatusBadge status={app.status} />
              {app.status === 'pending' && (
                <button
                  onClick={() => openModal(app)}
                  className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
                >
                  {ADMIN.REVIEW}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {modalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{ADMIN.DECISION}</h2>
              <p className="text-sm text-gray-600 mb-2">
                <strong>{modalApp.student?.name}</strong> — {modalApp.student?.email}
              </p>
              <p className="text-sm text-gray-600 mb-4">Project: {modalApp.project?.title}</p>
              {modalApp.resumeUrl && (
                <p className="mb-4">
                  <a
                    href={modalApp.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:underline"
                  >
                    View resume
                  </a>
                </p>
              )}
              {modalApp.sop && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 mb-1">SOP</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{modalApp.sop}</p>
                </div>
              )}
              <form onSubmit={handleDecide} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.DECISION}</label>
                  <select
                    value={decision.status}
                    onChange={(e) => setDecision((d) => ({ ...d, status: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    <option value="approved">{ADMIN.APPROVE}</option>
                    <option value="rejected">{ADMIN.REJECT}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{ADMIN.REMARKS}</label>
                  <textarea
                    value={decision.remarks}
                    onChange={(e) => setDecision((d) => ({ ...d, remarks: e.target.value }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setModalApp(null)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {ADMIN.CANCEL}
                  </button>
                  <button
                    type="submit"
                    disabled={patchMutation.isLoading}
                    className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {ADMIN.SAVE}
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
