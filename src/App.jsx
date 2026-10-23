
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Search,
  BriefcaseBusiness,
  Bookmark,
  Map,
  Bell,
  ArrowUpRight,
  ArrowRight,
  Code2,
  Palette,
  Heart,
  CheckCircle2,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import './App.css'
import ResumeAnalyzer from './ResumeAnalyzer.jsx'

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechNova',
    type: 'Internship',
    mode: 'Remote',
    icon: Code2,
    color: 'blue',
    description: 'Build beautiful web experiences with React.',
    skills: ['React', 'JavaScript'],
  },
  {
    id: 2,
    title: 'UI/UX Design Intern',
    company: 'Creative Labs',
    type: 'Internship',
    mode: 'Hybrid',
    icon: Palette,
    color: 'purple',
    description: 'Design simple, user-friendly digital products.',
    skills: ['Figma', 'UI Design'],
  },
  {
    id: 3,
    title: 'Junior Web Developer',
    company: 'CloudSpark',
    type: 'Full-time',
    mode: 'Remote',
    icon: BriefcaseBusiness,
    color: 'mint',
    description: 'Help create modern and responsive websites.',
    skills: ['HTML', 'CSS', 'JavaScript'],
  },
]

const initialTasks = [
  { id: 1, title: 'Complete your profile', detail: 'Add your skills and interests', done: true },
  { id: 2, title: 'Update your resume', detail: 'Showcase your best work', done: false },
  { id: 3, title: 'Explore internships', detail: 'Find your next opportunity', done: false },
]

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Explore Jobs', icon: Search },
  { name: 'My Applications', icon: BriefcaseBusiness },
  { name: 'Saved Jobs', icon: Bookmark },
  { name: 'Skill Roadmap', icon: Map },
]

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [savedJobs, setSavedJobs] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('skillbridge-saved-jobs')) ?? [2]
  } catch {
    return [2]
  }
})

const [tasks, setTasks] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem('skillbridge-tasks')) ?? initialTasks
  } catch {
    return initialTasks
  }
})
const [jobType, setJobType] = useState('All')
const [jobMode, setJobMode] = useState('All')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  useEffect(() => {
  localStorage.setItem('skillbridge-saved-jobs', JSON.stringify(savedJobs))
}, [savedJobs])

useEffect(() => {
  localStorage.setItem('skillbridge-tasks', JSON.stringify(tasks))
}, [tasks])

  const completedTasks = tasks.filter((task) => task.done).length

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = `${job.title} ${job.company} ${job.skills.join(' ')}`
      .toLowerCase()
      .includes(search.toLowerCase())
      const matchesType = jobType === 'All' || job.type === jobType
const matchesMode = jobMode === 'All' || job.mode === jobMode

    if (activePage === 'Saved Jobs') {
      return savedJobs.includes(job.id) && matchesSearch
    }

    return matchesSearch
  })

  function toggleSaved(id) {
    setSavedJobs((current) =>
      current.includes(id)
        ? current.filter((jobId) => jobId !== id)
        : [...current, id],
    )
  }

  function changePage(page) {
    setActivePage(page)
    setMobileMenu(false)
    setNotice(
      page === 'My Applications'
        ? 'Your application tracker is ready for your backend connection.'
        : page === 'Skill Roadmap'
          ? 'Complete your learning tasks to keep moving forward.'
          : '',
    )
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    )
  }

  return (
    <div className="app-shell">
      <div className="dashboard">
        <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
          <div className="logo">
            <span className="logo-icon"><Sparkles size={23} /></span>
            <span>SkillBridge<span className="logo-dot">.</span></span>
            <button
              className="mobile-close"
              onClick={() => setMobileMenu(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="profile-mini">
            <div className="profile-avatar">S</div>
            <div>
              <strong>Student Workspace</strong>
              <span>Future professional</span>
            </div>
          </div>

          <p className="nav-label">WORKSPACE</p>
          <nav className="nav-list">
            {menuItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                className={`nav-item ${activePage === name ? 'active' : ''}`}
                onClick={() => changePage(name)}
              >
                <Icon size={19} />
                <span>{name}</span>
                {name === 'Saved Jobs' && savedJobs.length > 0 && (
                  <span className="nav-count">{savedJobs.length}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-illustration"><Sparkles size={25} /></div>
            <h3>Your future is bright.</h3>
            <p>Small steps today. Big opportunities tomorrow.</p>
            <button onClick={() => changePage('Skill Roadmap')}>
              View your roadmap <ArrowRight size={15} />
            </button>
          </div>

          <div className="sidebar-footer">
            <span className="online-dot" />
            Made for your next big step
          </div>
        </aside>

        {mobileMenu && (
          <button
            className="mobile-backdrop"
            aria-label="Close menu"
            onClick={() => setMobileMenu(false)}
          />
        )}

        <main className="main-content">
          <header className="topbar">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={23} />
            </button>

            <div className="breadcrumb">
              <span>Workspace</span>
              <span className="breadcrumb-slash">/</span>
              <strong>{activePage}</strong>
            </div>

            <div className="topbar-actions">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                onClick={() => setNotice('You are all caught up. Keep exploring!')}
              >
                <Bell size={19} />
                <span />
              </button>
              <div className="avatar">S</div>
            </div>
          </header>

          <section className="welcome-heading">
            <div>
              <p className="eyebrow">WEDNESDAY Â· YOUR CAREER SPACE</p>
              <h1>
                Hey, Future Champion <span className="wave">âœ¦</span>
              </h1>
              <p className="page-subtitle">
                Your next big opportunity starts with one small step.
              </p>
            </div>
            <div className="date-pill">
              <span className="date-dot" />
              Your journey starts here
            </div>
          </section>

          <section className="welcome-banner">
            <div className="hero-content">
              <span className="hero-tag"><Sparkles size={14} /> YOUR NEXT CHAPTER</span>
              <h2>Turn your skills into<br />your next opportunity.</h2>
              <p>
                Discover internships, grow your skills and build the future
                you imagine.
              </p>
              <button
                className="primary-button hero-button"
                onClick={() => changePage('Explore Jobs')}
              >
                Explore opportunities <ArrowUpRight size={17} />
              </button>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-circle circle-back" />
              <div className="hero-circle circle-front" />
              <div className="hero-glass-card">
                <div className="hero-rocket">ðŸš€</div>
                <span className="floating-star star-one">âœ¦</span>
                <span className="floating-star star-two">âœ§</span>
              </div>
              <div className="floating-chip"><CheckCircle2 size={16} /> Skills growing!</div>
            </div>
          </section>

          <ResumeAnalyzer jobs={jobs} />

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon blue"><BriefcaseBusiness size={21} /></span>
                <span className="stat-trend">Explore</span>
              </div>
              <p className="stat-label">Opportunities</p>
              <h3 className="stat-value">120<span>+</span></h3>
              <p className="stat-note">Waiting to be discovered</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon purple"><ArrowUpRight size={22} /></span>
                <span className="stat-trend">Your journey</span>
              </div>
              <p className="stat-label">Applications</p>
              <h3 className="stat-value">08</h3>
              <p className="stat-note">Every application counts</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon mint"><CheckCircle2 size={21} /></span>
                <span className="stat-trend">In progress</span>
              </div>
              <p className="stat-label">Tasks completed</p>
              <h3 className="stat-value">{completedTasks}<span>/{tasks.length}</span></h3>
              <p className="stat-note">One step at a time</p>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span className="stat-icon peach"><Heart size={21} /></span>
                <span className="stat-trend">Shortlist</span>
              </div>
              <p className="stat-label">Saved jobs</p>
              <h3 className="stat-value">{String(savedJobs.length).padStart(2, '0')}</h3>
              <p className="stat-note">Opportunities you like</p>
            </div>
          </section>

          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button onClick={() => setNotice('')} aria-label="Dismiss notice">
                <X size={17} />
              </button>
            </div>
          )}

          <section className="content-grid">
            <div className="panel jobs-panel">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">HANDPICKED FOR YOU</p>
                  <h2>
                    {activePage === 'Saved Jobs'
                      ? 'Your saved opportunities'
                      : activePage === 'Explore Jobs'
                        ? 'Explore opportunities'
                        : activePage === 'My Applications'
                          ? 'Your application journey'
                          : activePage === 'Skill Roadmap'
                            ? 'Keep building your skills'
                            : 'Featured opportunities'}
                  </h2>
                </div>
                <span className="live-label"><span /> For you</span>
              </div>

              <label className="search-box">
                <Search size={19} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search roles, skills or companies..."
                />
                {search && (
                  <button
                    className="clear-search"
                    onClick={() => setSearch('')}
                    aria-label="Clear search"
                    type="button"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <div className="job-list">
                {filteredJobs.map((job) => {
                  const Icon = job.icon
                  const isSaved = savedJobs.includes(job.id)

                  return (
                    <article className="job-card" key={job.id}>
                      <div className={`company-logo ${job.color}`}>
                        <Icon size={23} />
                      </div>
                      <div className="job-info">
                        <h3>{job.title}</h3>
                        <p className="job-company">{job.company} <span>Â·</span> {job.mode}</p>
                        <p className="job-description">{job.description}</p>
                        <div className="job-tags">
                          <span className="tag">{job.type}</span>
                          {job.skills.slice(0, 2).map((skill) => (
                            <span className="tag tag-light" key={skill}>{skill}</span>
                          ))}
                        </div>
                      </div>
                      <button
                        className={`save-button ${isSaved ? 'saved' : ''}`}
                        onClick={() => toggleSaved(job.id)}
                        aria-label={isSaved ? 'Remove saved job' : 'Save job'}
                        title={isSaved ? 'Remove saved job' : 'Save job'}
                      >
                        <Bookmark size={19} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </article>
                  )
                })}

                {filteredJobs.length === 0 && (
                  <div className="empty-state">
                    <Search size={27} />
                    <h3>No opportunities found</h3>
                    <p>Try another search or save some jobs from Explore Jobs.</p>
                    <button
                      className="secondary-button"
                      onClick={() => {
                        setSearch('')
                        setActivePage('Explore Jobs')
                      }}
                    >
                      Explore all jobs
                    </button>
                  </div>
                )}
              </div>

              <button className="view-all-button" onClick={() => changePage('Explore Jobs')}>
                View all opportunities <ArrowRight size={17} />
              </button>
            </div>

            <div className="right-column">
              <div className="panel progress-panel">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">YOUR MOMENTUM</p>
                    <h2>Profile progress</h2>
                  </div>
                  <span className="progress-emoji">âœ§</span>
                </div>

                <div className="progress-summary">
                  <div className="progress-ring">
                    <div className="progress-ring-inner">
                      <strong>{Math.round((completedTasks / tasks.length) * 100)}%</strong>
                      <span>complete</span>
                    </div>
                  </div>
                  <div className="progress-copy">
                    <strong>Youâ€™re on your way!</strong>
                    <p>Complete your tasks to get job-ready.</p>
                  </div>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-bar"
                    style={{ width: `${(completedTasks / tasks.length) * 100}%` }}
                  />
                </div>

                <div className="task-list">
                  {tasks.map((task) => (
                    <label className={`task-item ${task.done ? 'task-done' : ''}`} key={task.id}>
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(task.id)}
                      />
                      <span className="custom-checkbox">
                        {task.done && <CheckCircle2 size={18} />}
                      </span>
                      <span className="task-copy">
                        <strong>{task.title}</strong>
                        <small>{task.detail}</small>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="tip-card">
                <div className="tip-icon"><Sparkles size={21} /></div>
                <div>
                  <p className="eyebrow">A LITTLE REMINDER</p>
                  <h3>Progress over perfection.</h3>
                  <p>Every new skill brings you one step closer to your dream role.</p>
                </div>
              </div>
            </div>
          </section>

          <footer className="page-footer">
            <span>Made with care for your future <Heart size={13} /></span>
            <span>SkillBridge Â· Student Career Dashboard</span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App

