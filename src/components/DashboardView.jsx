import { BalanceChart } from './BalanceChart.jsx'
import { ExpensePieChart } from './ExpensePieChart.jsx'
import { InsightsSection } from './InsightsSection.jsx'
import { MonthlyComparison } from './MonthlyComparison.jsx'
import { SummaryCards } from './SummaryCards.jsx'

export function DashboardView() {
  return (
    <div className="space-y-4">
      <SummaryCards />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BalanceChart />
        <ExpensePieChart />
      </div>
      <MonthlyComparison />
      <InsightsSection />
    </div>
  )
}
