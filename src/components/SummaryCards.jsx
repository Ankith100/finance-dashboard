import { ArrowDownRight, ArrowUpRight, IndianRupee } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatMoney } from '../utils/format.js'

export function SummaryCards() {
  const { transactions, darkMode } = useApp()

  const totalIncome = transactions
    .filter((row) => row.type === 'Income')
    .reduce((sum, row) => sum + row.amount, 0)
  const totalExpense = transactions
    .filter((row) => row.type === 'Expense')
    .reduce((sum, row) => sum + row.amount, 0)
  const balance = totalIncome - totalExpense

  const metrics = [
    {
      label: 'Total Balance',
      value: balance,
      icon: IndianRupee,
      accent: 'from-blue-500 to-indigo-600',
      iconLight: 'bg-blue-100 text-blue-600',
      iconDark: 'bg-blue-900/40 text-blue-300',
    },
    {
      label: 'Total Income',
      value: totalIncome,
      icon: ArrowUpRight,
      accent: 'from-emerald-500 to-green-600',
      iconLight: 'bg-emerald-100 text-emerald-600',
      iconDark: 'bg-emerald-900/40 text-emerald-300',
    },
    {
      label: 'Total Expenses',
      value: totalExpense,
      icon: ArrowDownRight,
      accent: 'from-rose-500 to-pink-600',
      iconLight: 'bg-rose-100 text-rose-600',
      iconDark: 'bg-rose-900/40 text-rose-300',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className={`relative overflow-hidden rounded-2xl p-5 shadow-sm ${
              darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-100 bg-white'
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {metric.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                  darkMode ? metric.iconDark : metric.iconLight
                }`}
              >
                <Icon size={18} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatMoney(metric.value)}
            </p>
            <div className={`absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r ${metric.accent}`} />
          </div>
        )
      })}
    </div>
  )
}
