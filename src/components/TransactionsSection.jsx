import { useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  IndianRupee,
  Download,
  Edit3,
  Filter,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { ALL_CATEGORIES } from '../data/categories.js'
import { useApp } from '../context/AppContext.jsx'
import { formatMoney, formatShortDate } from '../utils/format.js'
import { TransactionModal } from './TransactionModal.jsx'

const CATEGORY_BADGE_LIGHT = {
  Food: 'bg-amber-100 text-amber-700',
  Transport: 'bg-blue-100 text-blue-700',
  Entertainment: 'bg-purple-100 text-purple-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Health: 'bg-red-100 text-red-700',
  Utilities: 'bg-cyan-100 text-cyan-700',
  Salary: 'bg-emerald-100 text-emerald-700',
  Freelance: 'bg-teal-100 text-teal-700',
  Investment: 'bg-indigo-100 text-indigo-700',
}

const CATEGORY_BADGE_DARK = {
  Food: 'bg-amber-900/30 text-amber-300',
  Transport: 'bg-blue-900/30 text-blue-300',
  Entertainment: 'bg-purple-900/30 text-purple-300',
  Shopping: 'bg-pink-900/30 text-pink-300',
  Health: 'bg-red-900/30 text-red-300',
  Utilities: 'bg-cyan-900/30 text-cyan-300',
  Salary: 'bg-emerald-900/30 text-emerald-300',
  Freelance: 'bg-teal-900/30 text-teal-300',
  Investment: 'bg-indigo-900/30 text-indigo-300',
}

function categoryBadge(category, darkMode) {
  if (darkMode) {
    return CATEGORY_BADGE_DARK[category] ?? 'bg-gray-700 text-gray-300'
  }
  return CATEGORY_BADGE_LIGHT[category] ?? 'bg-gray-100 text-gray-600'
}

export function TransactionsSection() {
  const {
    transactions,
    dispatch,
    darkMode,
    isAdmin,
    searchQuery,
    setSearchQuery,
    filterFlow,
    setFilterFlow,
    filterCategory,
    setFilterCategory,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
  } = useApp()

  const [dialog, setDialog] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const visibleRows = useMemo(() => {
    let rows = [...transactions]
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      rows = rows.filter(
        (row) =>
          row.desc.toLowerCase().includes(q) || row.category.toLowerCase().includes(q),
      )
    }
    if (filterFlow !== 'All') {
      rows = rows.filter((row) => row.type === filterFlow)
    }
    if (filterCategory !== 'All') {
      rows = rows.filter((row) => row.category === filterCategory)
    }
    rows.sort((a, b) => {
      const primary =
        sortField === 'date' ? a.date.localeCompare(b.date) : a.amount - b.amount
      return sortDirection === 'desc' ? -primary : primary
    })
    return rows
  }, [
    transactions,
    searchQuery,
    filterFlow,
    filterCategory,
    sortField,
    sortDirection,
  ])

  function exportCsv() {
    const header = 'Date,Description,Category,Type,Amount\n'
    const body = visibleRows
      .map(
        (row) =>
          `${row.date},"${row.desc.replace(/"/g, '""')}",${row.category},${row.type},${row.amount}`,
      )
      .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'transactions.csv'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const selectClass = `rounded-xl border px-3 py-2 text-sm outline-none transition ${
    darkMode
      ? 'border-gray-600 bg-gray-700 text-gray-200'
      : 'border-gray-200 bg-gray-50 text-gray-700'
  }`

  const editingRow = dialog !== null && dialog !== 'add' ? dialog : null

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm ${
        darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-100 bg-white'
      }`}
    >
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Transactions
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
              darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <Search size={14} className="text-gray-400" />
            <input
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-32 bg-transparent text-sm outline-none ${
                darkMode
                  ? 'text-white placeholder:text-gray-500'
                  : 'text-gray-900 placeholder:text-gray-400'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className={`rounded-xl border p-2 transition ${
              filtersOpen
                ? 'border-indigo-500 bg-indigo-500 text-white'
                : darkMode
                  ? 'border-gray-600 bg-gray-700 text-gray-300'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
            aria-expanded={filtersOpen}
            aria-label="Filters"
          >
            <Filter size={16} />
          </button>
          <button
            type="button"
            onClick={exportCsv}
            className={`rounded-xl border p-2 transition ${
              darkMode
                ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
            aria-label="Download CSV"
          >
            <Download size={16} />
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setDialog('add')}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
            >
              <Plus size={15} /> Add
            </button>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="mb-4 flex flex-wrap gap-2">
          <select
            value={filterFlow}
            onChange={(e) => setFilterFlow(e.target.value)}
            className={selectClass}
          >
            <option value="All">All</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={selectClass}
          >
            <option value="All">All</option>
            {ALL_CATEGORIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-')
              setSortField(field)
              setSortDirection(dir)
            }}
            className={selectClass}
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
      )}

      {visibleRows.length === 0 ? (
        <div className={`py-12 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <IndianRupee size={36} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="max-h-96 space-y-2 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
          {visibleRows.map((row) => (
            <div
              key={row.id}
              className={`flex items-center justify-between rounded-xl p-3 transition ${
                darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                    row.type === 'Income'
                      ? darkMode
                        ? 'bg-emerald-900/30 text-emerald-400'
                        : 'bg-emerald-100 text-emerald-600'
                      : darkMode
                        ? 'bg-rose-900/30 text-rose-400'
                        : 'bg-rose-100 text-rose-600'
                  }`}
                >
                  {row.type === 'Income' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div className="min-w-0">
                  <p className={`truncate text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {row.desc}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {formatShortDate(row.date)}
                    </span>
                    <span className={`rounded-lg px-2 py-0.5 text-xs ${categoryBadge(row.category, darkMode)}`}>
                      {row.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`whitespace-nowrap text-sm font-semibold ${
                    row.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {row.type === 'Income' ? '+' : '-'}
                  {formatMoney(row.amount)}
                </span>
                {isAdmin && (
                  <div className="ml-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setDialog(row)}
                      className={`rounded-lg p-1.5 transition ${
                        darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-400 hover:bg-gray-200'
                      }`}
                      aria-label="Edit"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'DELETE', payload: row.id })}
                      className={`rounded-lg p-1.5 transition ${
                        darkMode ? 'text-gray-400 hover:bg-gray-600' : 'text-gray-400 hover:bg-gray-200'
                      }`}
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <TransactionModal
        key={
          dialog === null ? 'closed' : dialog === 'add' ? 'add' : String(dialog.id)
        }
        open={dialog !== null}
        onClose={() => setDialog(null)}
        editing={editingRow}
      />
    </div>
  )
}
