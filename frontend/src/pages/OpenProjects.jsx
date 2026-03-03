import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { projectsAPI, alumniAPI, homepageAPI } from '../api/services';
import { ProjectCard } from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { PROJECTS, COMMON, ROUTES } from '../constants/messages';

const CONTAINER = 'max-w-6xl mx-auto px-6';

export function OpenProjects() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [domainFilter, setDomainFilter] = useState('');
  const [currentAlumni, setCurrentAlumni] = useState(0);
  const [alumni, setAlumni] = useState([]);
  const [alumniLoading, setAlumniLoading] = useState(false);
  const [homepage, setHomepage] = useState(null);
  const [homepageLoading, setHomepageLoading] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery(
    ['open-projects'],
    () => projectsAPI.getOpen({ limit: 50 }).then((res) => res.data),
    { staleTime: 60000 }
  );

  const projects = data?.data?.projects || [];
  const domains = [...new Set(projects.map((p) => p.domain).filter(Boolean))].sort();
  const domainCount = domains.length;

  useEffect(() => {
    setAlumniLoading(true);
    alumniAPI
      .getPublic()
      .then((res) => {
        const list = res.data?.data?.alumni || [];
        setAlumni(list);
      })
      .catch(() => {
        setAlumni([]);
      })
      .finally(() => setAlumniLoading(false));
  }, []);

  useEffect(() => {
    setHomepageLoading(true);
    homepageAPI
      .get()
      .then((res) => {
        setHomepage(res.data?.data?.homepage || null);
      })
      .catch(() => {
        setHomepage(null);
      })
      .finally(() => setHomepageLoading(false));
  }, []);

  useEffect(() => {
    if (!alumni.length) return;
    const id = setInterval(() => {
      setCurrentAlumni((prev) => (prev + 1) % alumni.length);
    }, 4000);
    return () => clearInterval(id);
  }, [alumni.length]);

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      (p.title && p.title.toLowerCase().includes(search.toLowerCase())) ||
      (p.projectCode && p.projectCode.toLowerCase().includes(search.toLowerCase())) ||
      (p.domain && p.domain.toLowerCase().includes(search.toLowerCase()));
    const matchDomain = !domainFilter || p.domain === domainFilter;
    return matchSearch && matchDomain;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent" />
        <span className="ml-3 text-slate-600">{COMMON.LOADING}</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass glass-border rounded-2xl p-8 text-center shadow-card-light">
        <p className="text-slate-600 mb-4">{COMMON.ERROR}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-full text-sm font-medium text-blue-600 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-colors duration-300"
        >
          {COMMON.RETRY}
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero + Stats + About + Alumni carousel */}
      <section className={`bg-gradient-to-b from-white to-slate-50 py-20`}>
        <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <p className="text-base font-semibold tracking-wide text-indigo-600">
              {homepage?.centreName ||
                'The Centre for Research, Innovation & Entrepreneurship Lab'}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-600">
              {homepage?.programName || "Director's Internship Program"}
            </p>
            <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-snug mb-4">
              {homepage?.heroTitle || PROJECTS.HERO}
            </h1>
            <p className="text-sm text-slate-500 max-w-xl">
              {homepage?.heroSubtitle || PROJECTS.HERO_SUBTITLE}
            </p>

            {/* Stats grid */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center sm:text-left">
              <div className="transform transition-all duration-300 hover:scale-105">
                <p className="text-4xl font-bold text-indigo-600">
                  {(homepage?.liveProjects ?? projects.length) || 0}+
                </p>
                <p className="mt-2 text-sm tracking-wide text-gray-500 uppercase">
                  Live Projects
                </p>
              </div>
              <div className="transform transition-all duration-300 hover:scale-105">
                <p className="text-4xl font-bold text-indigo-600">
                  {(homepage?.interns ?? 50) || 0}+
                </p>
                <p className="mt-2 text-sm tracking-wide text-gray-500 uppercase">
                  Interns
                </p>
              </div>
              <div className="transform transition-all duration-300 hover:scale-105">
                <p className="text-4xl font-bold text-indigo-600">
                  {homepage?.domains ?? domainCount}
                </p>
                <p className="mt-2 text-sm tracking-wide text-gray-500 uppercase">
                  Domains
                </p>
              </div>
            </div>

            {/* About description */}
            <div className="mt-8 max-w-3xl">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                {homepage?.aboutTitle || PROJECTS.ABOUT_TITLE}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {homepage?.aboutDescription || PROJECTS.ABOUT_DESC}
              </p>
            </div>
          </div>

          {/* Right: Alumni placement carousel */}
          <div className="mt-10 lg:mt-0">
            {alumni.length > 0 && !alumniLoading && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 p-6 transition-all duration-300 space-y-3">
                <div className="flex items-center gap-4">
                  {alumni[currentAlumni]?.imageUrl || alumni[currentAlumni]?.image_url ? (
                    <img
                      src={alumni[currentAlumni].imageUrl || alumni[currentAlumni].image_url}
                      alt={alumni[currentAlumni].name}
                      className="w-16 h-16 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200" />
                  )}
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {alumni[currentAlumni].name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {alumni[currentAlumni].branch}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase">
                    Currently placed at
                  </p>
                  <p className="mt-1 text-sm font-medium text-indigo-600">
                    {alumni[currentAlumni].company}
                  </p>
                </div>

                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  {alumni[currentAlumni].testimonial}
                </p>

                <span className="mt-4 inline-block text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                  Alumni – Director&apos;s Internship Program
                </span>

                {/* Dots */}
                <div className="mt-6 flex justify-center gap-2">
                  {alumni.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentAlumni(index)}
                      className={`h-2 w-2 rounded-full transition-colors ${
                        index === currentAlumni
                          ? 'bg-indigo-600'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Show alumni ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      {/* Open Projects */}
      <section className="py-16 bg-slate-50">
        <div className={CONTAINER}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {PROJECTS.TITLE}
            </h2>
            <p className="text-sm text-slate-500">
              {PROJECTS.SUBTITLE}
            </p>
          </div>

          {/* Not sure which project — general apply card */}
          <div className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-8 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900">
              Not sure which project to choose?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
              You can apply for general consideration and our mentors will help you find the best fit based on your skills and interests.
            </p>
            <Link
              to={user ? ROUTES.APPLY_BY_PROJECT('general') : ROUTES.LOGIN}
              state={!user ? { redirectToApply: 'general' } : undefined}
              className="mt-6 inline-block rounded-xl bg-indigo-600 px-6 py-3 text-white transition-all duration-200 hover:bg-indigo-700"
            >
              Apply Now
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={PROJECTS.SEARCH_PLACEHOLDER}
              className="flex-1 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none transition-all duration-200 text-sm"
            />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-slate-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 outline-none min-w-[160px] transition-all duration-200 text-sm"
            >
              <option value="">{PROJECTS.FILTER_ALL}</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200/80 p-10 text-center">
              <p className="text-slate-800 font-medium">{PROJECTS.NO_PROJECTS}</p>
              <p className="text-slate-500 text-sm mt-1">{PROJECTS.NO_PROJECTS_DESC}</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map((project) => (
                <div key={project._id} className="h-full min-h-[280px]">
                  <ProjectCard
                    project={project}
                    user={user}
                    showApplyButton={true}
                    showAdminControls={false}
                    showStatusBadge={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
