import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { homepageAPI } from '../api/services';
import { COMMON } from '../constants/messages';
import toast from 'react-hot-toast';

export function AdminHomepage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['homepage-content'], () =>
    homepageAPI.get().then((res) => res.data)
  );

  const existing = data?.data?.homepage || {};

  const [form, setForm] = useState({
    centreName: '',
    programName: '',
    heroTitle: '',
    heroSubtitle: '',
    liveProjects: '',
    interns: '',
    domains: '',
    aboutTitle: '',
    aboutDescription: '',
  });

  const mutation = useMutation((payload) => homepageAPI.update(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(['homepage-content']);
      toast.success('Homepage content updated');
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || COMMON.ERROR),
  });

  // Initialize form when data loads
  if (!isLoading && existing && !form.centreName && form.centreName !== '') {
    form.centreName = existing.centreName || '';
    form.programName = existing.programName || '';
    form.heroTitle = existing.heroTitle || '';
    form.heroSubtitle = existing.heroSubtitle || '';
    form.liveProjects =
      existing.liveProjects !== undefined ? String(existing.liveProjects) : '';
    form.interns =
      existing.interns !== undefined ? String(existing.interns) : '';
    form.domains =
      existing.domains !== undefined ? String(existing.domains) : '';
    form.aboutTitle = existing.aboutTitle || '';
    form.aboutDescription = existing.aboutDescription || '';
  }

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      centreName: form.centreName,
      programName: form.programName,
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      liveProjects: form.liveProjects ? Number(form.liveProjects) : 0,
      interns: form.interns ? Number(form.interns) : 0,
      domains: form.domains ? Number(form.domains) : 0,
      aboutTitle: form.aboutTitle,
      aboutDescription: form.aboutDescription,
    };
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-10 w-10 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
        <span className="ml-3 text-gray-600">{COMMON.LOADING}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Homepage content
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage landing page branding, hero content, stats, and about section.
      </p>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-card border border-gray-100 space-y-6 max-w-3xl"
      >
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Branding
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centre name
              </label>
              <input
                value={form.centreName}
                onChange={handleChange('centreName')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Program name
              </label>
              <input
                value={form.programName}
                onChange={handleChange('programName')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Hero</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero title
              </label>
              <input
                value={form.heroTitle}
                onChange={handleChange('heroTitle')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero subtitle
              </label>
              <input
                value={form.heroSubtitle}
                onChange={handleChange('heroSubtitle')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Live projects
              </label>
              <input
                type="number"
                min="0"
                value={form.liveProjects}
                onChange={handleChange('liveProjects')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interns
              </label>
              <input
                type="number"
                min="0"
                value={form.interns}
                onChange={handleChange('interns')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domains
              </label>
              <input
                type="number"
                min="0"
                value={form.domains}
                onChange={handleChange('domains')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-2">About</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About title
              </label>
              <input
                value={form.aboutTitle}
                onChange={handleChange('aboutTitle')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About description
              </label>
              <textarea
                rows={4}
                value={form.aboutDescription}
                onChange={handleChange('aboutDescription')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {mutation.isLoading ? COMMON.LOADING : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

