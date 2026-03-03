import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { applicationsAPI } from '../api/services';
import { StatusBadge } from '../components/StatusBadge';
import { STUDENT_DASHBOARD, ROUTES, PROJECTS, COMMON } from '../constants/messages';

export function StudentDashboard() {
  const { data, isLoading, isError, refetch } = useQuery(
    ['my-applications'],
    () => applicationsAPI.getMy().then((res) => res.data)
  );

  const applications = data?.data?.applications || [];
  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'pending').length;
  const approved = applications.filter((a) => a.status === 'approved').length;
  const rejected = applications.filter((a) => a.status === 'rejected').length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-500 border-t-transparent" />
        <span className="ml-3 text-gray-600">{COMMON.LOADING}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-white p-8 shadow-card border border-gray-100 text-center">
        <p className="text-gray-600 mb-4">{COMMON.ERROR}</p>
        <button onClick={() => refetch()} className="text-primary-600 font-medium">
          {COMMON.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{STUDENT_DASHBOARD.TITLE}</h1>
      <p className="text-gray-500 mt-1">{STUDENT_DASHBOARD.MY_APPLICATIONS}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{STUDENT_DASHBOARD.TOTAL_APPLICATIONS}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{STUDENT_DASHBOARD.PENDING}</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pending}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{STUDENT_DASHBOARD.APPROVED}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{approved}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{STUDENT_DASHBOARD.REJECTED}</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{rejected}</p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 rounded-xl bg-white p-12 shadow-card border border-gray-100 text-center">
          <p className="text-gray-900 font-medium">{STUDENT_DASHBOARD.NO_APPLICATIONS}</p>
          <p className="text-gray-500 mt-1">{STUDENT_DASHBOARD.NO_APPLICATIONS_DESC}</p>
          <Link
            to={ROUTES.HOME}
            className="mt-4 inline-block rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            {PROJECTS.TITLE}
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {STUDENT_DASHBOARD.PROJECT}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {STUDENT_DASHBOARD.STATUS}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {STUDENT_DASHBOARD.VIEW_PROJECT}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{app.project?.title || '—'}</p>
                      <p className="text-sm text-gray-500">
                        {app.project?.projectCode} · {app.project?.domain}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={ROUTES.PROJECT_DETAILS.replace(':id', app.project?._id)}
                        className="text-sm font-medium text-primary-600 hover:text-primary-700"
                      >
                        {STUDENT_DASHBOARD.VIEW_PROJECT}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
