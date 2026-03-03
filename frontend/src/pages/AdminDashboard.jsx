import { useQuery } from 'react-query';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { projectsAPI, adminAPI } from '../api/services';
import { ADMIN, COMMON } from '../constants/messages';

const CHART_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export function AdminDashboard() {
  const { data: projectsData } = useQuery(
    ['admin-projects'],
    () => projectsAPI.getAll({ limit: 100 }).then((res) => res.data)
  );
  const { data: applicationsData } = useQuery(
    ['admin-applications'],
    () => adminAPI.getApplications().then((res) => res.data)
  );

  const projects = projectsData?.data?.projects || [];
  const applications = applicationsData?.data?.applications || [];

  const openCount = projects.filter((p) => p.status === 'open').length;
  const closedCount = projects.filter((p) => p.status === 'closed').length;
  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  const statusData = [
    { name: ADMIN.PENDING, value: pendingCount, color: CHART_COLORS[2] },
    { name: ADMIN.APPROVED, value: approvedCount, color: CHART_COLORS[1] },
    { name: ADMIN.REJECTED, value: rejectedCount, color: CHART_COLORS[3] },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: ADMIN.OPEN_PROJECTS, count: openCount },
    { name: 'Closed', count: closedCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{ADMIN.DASHBOARD}</h1>
      <p className="text-gray-500 mt-1">{ADMIN.ANALYTICS}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{ADMIN.TOTAL_PROJECTS}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{projects.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{ADMIN.OPEN_PROJECTS}</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{openCount}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{ADMIN.TOTAL_APPLICATIONS}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <p className="text-sm font-medium text-gray-500">{ADMIN.PENDING_APPLICATIONS}</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Projects by status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-card border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Applications by status</h3>
          {statusData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-500 py-12 text-center">No application data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
