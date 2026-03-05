import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { projectsAPI, alumniAPI, homepageAPI } from '../api/services';
import { ProjectCard } from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { PROJECTS, COMMON, ROUTES } from '../constants/messages';
import './OpenProjects.css';

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

  const heroTitle = homepage?.heroTitle || PROJECTS.HERO;
  const heroTitleParts = heroTitle.split(/(Internship)/i);

  if (isLoading) {
    return (
      <div className="open-projects-editorial">
        <div className="editorial-loading">
          <div className="editorial-spinner" />
          <span className="editorial-loading-text">{COMMON.LOADING}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="open-projects-editorial">
        <div className="editorial-error">
          <p>{COMMON.ERROR}</p>
          <button type="button" onClick={() => refetch()}>
            {COMMON.RETRY}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="open-projects-editorial relative">
      <section className="hero-section">
        <span className="hero-ghost" aria-hidden="true">
          DIP
        </span>
        <div className="hero-grid">
          <div>
            <p className="hero-institution-title">
              The Centre for Research, Innovation and Entrepreneurship (CRIE)
            </p>
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-line" />
              <span className="hero-eyebrow-label">
                {homepage?.programName || PROJECTS.HERO_LABEL}
              </span>
            </div>
            <h1 className="hero-h1">
              {heroTitleParts.map((part, i) =>
                part.toLowerCase() === 'internship' ? (
                  <em key={i}>{part}</em>
                ) : (
                  part
                )
              )}
            </h1>
            <p className="hero-subtitle">
              {homepage?.heroSubtitle || PROJECTS.HERO_SUBTITLE}
            </p>
            <div className="hero-stats">
              <div className="hero-stat">
                <p className="hero-stat-value">
                  {(homepage?.liveProjects ?? projects.length) || 0}
                  <sup>+</sup>
                </p>
                <p className="hero-stat-label">Live Projects</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-value">
                  {(homepage?.interns ?? 50) || 0}
                  <sup>+</sup>
                </p>
                <p className="hero-stat-label">Interns</p>
              </div>
              <div className="hero-stat">
                <p className="hero-stat-value">{homepage?.domains ?? domainCount}</p>
                <p className="hero-stat-label">Domains</p>
              </div>
            </div>
          </div>

          <div>
            {alumni.length > 0 && !alumniLoading && (
              <div className="alumni-card">
                <span className="alumni-card-quote" aria-hidden="true">
                  &ldquo;
                </span>
                <div className="alumni-header">
                  {alumni[currentAlumni]?.imageUrl || alumni[currentAlumni]?.image_url ? (
                    <img
                      src={
                        alumni[currentAlumni].imageUrl || alumni[currentAlumni].image_url
                      }
                      alt={alumni[currentAlumni].name}
                      className="alumni-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className="alumni-avatar-initials">
                      {(alumni[currentAlumni].name || 'A')
                        .split(/\s+/)
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="alumni-name">{alumni[currentAlumni].name}</p>
                    <p className="alumni-branch">{alumni[currentAlumni].branch}</p>
                  </div>
                </div>
                <p className="alumni-placement-label">Currently placed at</p>
                <p className="alumni-company">{alumni[currentAlumni].company}</p>
                <p className="alumni-testimonial">
                  &ldquo;{alumni[currentAlumni].testimonial}&rdquo;
                </p>
                <span className="alumni-tag">
                  Alumni – Director&apos;s Internship Program
                </span>
                <div className="alumni-dots">
                  {alumni.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentAlumni(index)}
                      className={`alumni-dot ${index === currentAlumni ? 'active' : ''}`}
                      aria-label={`Show alumni ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="editorial-divider" />

      <section id="open-projects" className="projects-section">
        <div className="projects-section-inner">
          <h2 className="projects-section-title">{PROJECTS.TITLE}</h2>
          <p className="projects-section-subtitle">{PROJECTS.SUBTITLE}</p>

          <div className="filters-row">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={PROJECTS.SEARCH_PLACEHOLDER}
              className="filter-input"
            />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">{PROJECTS.FILTER_ALL}</option>
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="general-apply-banner">
            <h3 className="general-apply-title">Not sure which project to choose?</h3>
            <p className="general-apply-desc">
              You can apply for general consideration and our mentors will help you
              find the best fit based on your skills and interests.
            </p>
            <Link
              to={user ? ROUTES.APPLY_BY_PROJECT('general') : ROUTES.LOGIN}
              state={!user ? { redirectToApply: 'general' } : undefined}
              className="general-apply-cta"
            >
              Apply Now
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>{PROJECTS.NO_PROJECTS}</p>
              <p>{PROJECTS.NO_PROJECTS_DESC}</p>
            </div>
          ) : (
            <div className="projects-grid-wrap">
              {filtered.map((project) => (
                <div key={project._id} className="projects-grid-cell">
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
