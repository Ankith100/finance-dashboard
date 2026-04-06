import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import { formatChartAxis, formatMoney } from '../utils/format.js'

export function BalanceChart() {
  const { transactions, darkMode } = useApp()

  const series = useMemo(() => {
    const ordered = [...transactions].sort((a, b) => a.date.localeCompare(b.date))
    let running = 0
    const byDay = {}
    for (const row of ordered) {
      running += row.type === 'Income' ? row.amount : -row.amount
      byDay[row.date] = running
    }
    return Object.entries(byDay).map(([iso, balance]) => ({
      date: new Date(`${iso}T00:00:00`).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      balance,
    }))
  }, [transactions])

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${
        darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-100 bg-white'
      }`}
    >
      <h3 className={`mb-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Balance over time
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
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
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#6366f1"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#6366f1' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
