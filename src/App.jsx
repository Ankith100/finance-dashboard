import { AppProvider, useApp } from './context/AppContext.jsx'
import { DashboardView } from './components/DashboardView.jsx'
import { ExpensePieChart } from './components/ExpensePieChart.jsx'
import { InsightsSection } from './components/InsightsSection.jsx'
import { MonthlyComparison } from './components/MonthlyComparison.jsx'
import { Nav } from './components/Nav.jsx'
import { TransactionsSection } from './components/TransactionsSection.jsx'

function Shell() {
  const { darkMode, activeTab } = useApp()

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      <Nav />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'transactions' && <TransactionsSection />}
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <InsightsSection />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <MonthlyComparison />
              <ExpensePieChart />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
