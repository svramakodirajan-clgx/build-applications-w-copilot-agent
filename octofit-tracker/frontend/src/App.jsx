import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { Activity, Dumbbell, Trophy, UserRound, UsersRound } from 'lucide-react'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

const navigation = [
  { path: '/activities', label: 'Activities', icon: Activity },
  { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { path: '/teams', label: 'Teams', icon: UsersRound },
  { path: '/users', label: 'Users', icon: UserRound },
  { path: '/workouts', label: 'Workouts', icon: Dumbbell },
]

function App() {
  return (
    <>
        <a className="visually-hidden-focusable skip-link" href="#main-content">Skip to content</a>
        <header className="app-header">
          <div className="container app-brand">
            <NavLink to="/activities" className="brand-link">
              <img src={logo} width="44" height="44" alt="" />
              <span>OctoFit Tracker</span>
            </NavLink>
            <span className="school-label">Mergington High</span>
          </div>
          <nav className="app-navigation" aria-label="Main navigation">
            <div className="container navigation-links">
              {navigation.map(({ path, label, icon: Icon }) => (
                <NavLink key={path} to={path} className={({ isActive }) => `navigation-link${isActive ? ' active' : ''}`}>
                  <Icon size={18} aria-hidden="true" /><span>{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </header>
        <main id="main-content" className="container app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/users" element={<Users />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="*" element={<section><h1>Page not found</h1><NavLink to="/activities">Back to activities</NavLink></section>} />
          </Routes>
        </main>
    </>
  )
}

export default App
