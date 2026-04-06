import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import { formatChartAxis, formatMoney } from '../utils/format.js'

export function MonthlyComparison() {
  const { transactions, darkMode } = useApp()

  const bars = useMemo(() => {
    const map = {}
    for (const row of transactions) {
      const label = new Date(`${row.date}T00:00:00`).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
      if (!map[label]) {
        map[label] = { month: label, Income: 0, Expense: 0 }
      }
      map[label][row.type] += row.amount
    }
    return Object.values(map).sort(
      (a, b) => new Date(`1 ${a.month}`).getTime() - new Date(`1 ${b.month}`).getTime(),
    )
  }, [transactions])

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${
        darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-100 bg-white'
      }`}
    >
      <h3 className={`mb-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Monthly income vs expenses
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={bars} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
          <YAxis
            tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }}
            tickFormatter={(v) => formatChartAxis(Number(v))}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value))}
            contentStyle={{
              background: darkMode ? '#1f2937' : '#fff',
              border: 'none',
              borderRadius: 12,
              boxShadow: '0 4px 20px rgba(0,0,0,.1)',
              fontSize: 13,
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
