import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import { formatMoney } from '../utils/format.js'

const SLICE_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899']

export function ExpensePieChart() {
  const { transactions, darkMode } = useApp()

  const slices = useMemo(() => {
    const totals = {}
    for (const row of transactions) {
      if (row.type !== 'Expense') continue
      totals[row.category] = (totals[row.category] ?? 0) + row.amount
    }
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${
        darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-100 bg-white'
      }`}
    >
      <h3 className={`mb-4 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Expenses by category
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={slices}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            dataKey="value"
            paddingAngle={3}
            cornerRadius={4}
          >
            {slices.map((_, index) => (
              <Cell key={slices[index].name} fill={SLICE_COLORS[index % SLICE_COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {slices.map((slice, index) => (
          <span
            key={slice.name}
            className={`flex items-center gap-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: SLICE_COLORS[index % SLICE_COLORS.length] }}
            />
            {slice.name}
          </span>
        ))}
      </div>
    </div>
  )
}
