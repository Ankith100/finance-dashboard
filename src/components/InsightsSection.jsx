import { useMemo } from 'react'
import { BarChart3, IndianRupee, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { formatMoney } from '../utils/format.js'

export function InsightsSection() {
  const { transactions, darkMode } = useApp()

  const lines = useMemo(() => {
    const expenses = transactions.filter((row) => row.type === 'Expense')
    const incomeRows = transactions.filter((row) => row.type === 'Income')

    const spendByCategory = {}
    for (const row of expenses) {
      spendByCategory[row.category] = (spendByCategory[row.category] ?? 0) + row.amount
    }
    const topCategory = Object.entries(spendByCategory).sort((a, b) => b[1] - a[1])[0]

    const monthly = {}
    for (const row of transactions) {
      const key = row.date.slice(0, 7)
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 }
      if (row.type === 'Income') monthly[key].income += row.amount
      else monthly[key].expense += row.amount
    }
    const monthKeys = Object.keys(monthly).sort()
    const currentKey = monthKeys[monthKeys.length - 1]
    const previousKey = monthKeys[monthKeys.length - 2]

    let spendDeltaPercent = null
    if (currentKey && previousKey && monthly[previousKey].expense > 0) {
      spendDeltaPercent = Math.round(
        ((monthly[currentKey].expense - monthly[previousKey].expense) / monthly[previousKey].expense) *
          100,
      )
    }

    const totalIncome = incomeRows.reduce((sum, row) => sum + row.amount, 0)
    const totalExpense = expenses.reduce((sum, row) => sum + row.amount, 0)
    const savingsRate =
      totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0

    const out = []

    if (topCategory) {
      out.push({
        icon: TrendingUp,
        color: 'text-amber-500',
        surface: darkMode ? 'bg-amber-900/30' : 'bg-amber-100',
        text: `Highest spending: ${topCategory[0]} at ${formatMoney(topCategory[1])}`,
      })
    }

    if (spendDeltaPercent !== null) {
      const up = spendDeltaPercent > 0
      out.push({
        icon: up ? TrendingUp : TrendingDown,
        color: up ? 'text-rose-500' : 'text-emerald-500',
        surface: up
          ? darkMode
            ? 'bg-rose-900/30'
            : 'bg-rose-100'
          : darkMode
            ? 'bg-emerald-900/30'
            : 'bg-emerald-100',
        text: `Spending ${up ? 'increased' : 'decreased'} by ${Math.abs(spendDeltaPercent)}% vs last month`,
      })
    }

    out.push({
      icon: IndianRupee,
      color: 'text-indigo-500',
      surface: darkMode ? 'bg-indigo-900/30' : 'bg-indigo-100',
      text: `Savings rate: ${savingsRate}% of income`,
    })

    if (expenses.length > 0) {
      const average = totalExpense / expenses.length
      out.push({
        icon: BarChart3,
        color: 'text-cyan-500',
        surface: darkMode ? 'bg-cyan-900/30' : 'bg-cyan-100',
        text: `Average transaction: ${formatMoney(Math.round(average))}`,
      })
    }

    return out
  }, [transactions, darkMode])

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${
        darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-100 bg-white'
      }`}
    >
      <div className="mb-4 flex items-center gap-2">
        <Lightbulb size={16} className="text-amber-500" />
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Insights
        </h3>
      </div>
      <div className="space-y-3">
        {lines.map((line) => {
          const Icon = line.icon
          return (
            <div
              key={line.text}
              className={`flex items-center gap-3 rounded-xl p-3 ${
                darkMode ? 'bg-gray-700/40' : 'bg-gray-50'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${line.surface} ${line.color}`}
              >
                <Icon size={16} />
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{line.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
