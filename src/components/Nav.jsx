import { BarChart3, Eye, IndianRupee, Lightbulb, Moon, Shield, Sun } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'transactions', label: 'Transactions', icon: IndianRupee },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
]

export function Nav() {
  const { darkMode, setDarkMode, role, setRole, activeTab, setActiveTab } = useApp()

  function toggleRole() {
    setRole((current) => (current === 'Admin' ? 'Viewer' : 'Admin'))
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${
        darkMode ? 'border-gray-800 bg-gray-900/95' : 'border-gray-100 bg-white/95'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <IndianRupee size={16} className="text-white" />
          </div>
          <span className={`hidden text-lg font-bold sm:inline ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            FinDash
          </span>
        </div>

        <nav
          className="flex items-center gap-1 rounded-xl p-1"
          style={{
            background: darkMode ? 'rgba(55,65,81,0.5)' : 'rgba(243,244,246,0.8)',
          }}
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            const selected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  selected
                    ? darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-white text-gray-900 shadow-sm'
                    : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleRole}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              role === 'Admin'
                ? 'bg-indigo-100 text-indigo-700'
                : darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {role === 'Admin' ? <Shield size={13} /> : <Eye size={13} />}
            {role}
          </button>
          <button
            type="button"
            onClick={() => setDarkMode((d) => !d)}
            className={`rounded-xl p-2 transition ${
              darkMode
                ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            aria-label={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </header>
  )
}
