import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { alumniAPI } from '../api/services';
import { ADMIN, COMMON } from '../constants/messages';
import toast from 'react-hot-toast';

export function AdminAlumni() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(['admin-alumni'], () =>
    alumniAPI.getAll().then((res) => res.data)
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '',
    branch: '',
    batch: '',
    company: '',
    testimonial: '',
    imageUrl: '',
    isActive: true,
  });

  const alumni = data?.data?.alumni || [];

  const createMutation = useMutation((payload) => alumniAPI.create(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-alumni']);
      toast.success('Alumni testimonial created');
      closeModal();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || COMMON.ERROR),
  });

  const updateMutation = useMutation(
    ({ id, payload }) => alumniAPI.update(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-alumni']);
        toast.success('Alumni testimonial updated');
        closeModal();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || COMMON.ERROR),
    }
  );

  const deleteMutation = useMutation((id) => alumniAPI.remove(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-alumni']);
      toast.success('Alumni testimonial deleted');
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || COMMON.ERROR),
  });

  function openCreate() {
    setEditing(null);
    setForm({
      name: '',
      branch: '',
      batch: '',
      company: '',
      testimonial: '',
      imageUrl: '',
      isActive: true,
    });
    setModalOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name || '',
      branch: item.branch || '',
      batch: item.batch || '',
      company: item.company || '',
      testimonial: item.testimonial || '',
      imageUrl: item.imageUrl || '',
      isActive: item.isActive ?? true,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form };
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function toggleActive(item) {
    updateMutation.mutate({
      id: item._id,
      payload: { isActive: !item.isActive },
    });
  }

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alumni testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage alumni placements shown on the public homepage.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          Add alumni
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-card border border-gray-100 overflow-hidden">
        {alumni.length === 0 ? (
          <p className="text-center text-gray-500 py-10 text-sm">
            No alumni testimonials yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                    Branch / Batch
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                    Active
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {alumni.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 text-gray-900 font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.branch || '-'} {item.batch ? `• ${item.batch}` : ''}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.company}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(item)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium mr-3"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          window.confirm('Delete this testimonial?') &&
                          deleteMutation.mutate(item._id)
                        }
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editing ? 'Edit alumni testimonial' : 'Add alumni testimonial'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Branch
                    </label>
                    <input
                      value={form.branch}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, branch: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch
                    </label>
                    <input
                      value={form.batch}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, batch: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    value={form.company}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonial
                  </label>
                  <textarea
                    rows={4}
                    value={form.testimonial}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, testimonial: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, imageUrl: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="isActive"
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, isActive: e.target.checked }))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm text-gray-700"
                    >
                      Active
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {editing ? 'Save changes' : 'Create'}
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

