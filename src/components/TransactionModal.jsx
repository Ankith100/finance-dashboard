import { useState } from 'react'
import { X } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories.js'
import { useApp } from '../context/AppContext.jsx'

function emptyForm() {
  return {
    date: new Date().toISOString().slice(0, 10),
    amount: '',
    category: 'Food',
    type: 'Expense',
    desc: '',
  }
}

function formFromTransaction(row) {
  return {
    date: row.date,
    amount: String(row.amount),
    category: row.category,
    type: row.type,
    desc: row.desc,
  }
}

export function TransactionModal({ open, onClose, editing }) {
  const { dispatch, darkMode } = useApp()
  const [form, setForm] = useState(() => (editing ? formFromTransaction(editing) : emptyForm()))

  function save() {
    if (!form.amount.trim() || !form.date || !form.desc.trim()) return
    const amount = Number(form.amount)
    if (Number.isNaN(amount) || amount <= 0) return

    if (editing) {
      dispatch({
        type: 'EDIT',
        payload: {
          id: editing.id,
          date: form.date,
          amount,
          category: form.category,
          type: form.type,
          desc: form.desc.trim(),
        },
      })
    } else {
      dispatch({
        type: 'ADD',
        payload: {
          date: form.date,
          amount,
          category: form.category,
          type: form.type,
          desc: form.desc.trim(),
        },
      })
    }
    onClose()
  }

  if (!open) return null

  const categoryOptions = form.type === 'Income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition ${
    darkMode
      ? 'border-gray-600 bg-gray-700 text-white focus:border-indigo-400'
      : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500'
  }`

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.45)' }}
      onClick={onClose}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md cursor-default rounded-2xl p-6 shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tx-modal-title"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            id="tx-modal-title"
            className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            {editing ? 'Edit transaction' : 'Add transaction'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-lg p-1.5 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            {['Expense', 'Income'].map((flow) => (
              <button
                key={flow}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    type: flow,
                    category: flow === 'Income' ? 'Salary' : 'Food',
                  }))
                }
                className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                  form.type === flow
                    ? flow === 'Income'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-rose-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {flow}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm((prev) => ({ ...prev, desc: e.target.value }))}
            className={inputClass}
          />
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            className={inputClass}
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className={`${inputClass} flex-1`}
            />
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className={`${inputClass} flex-1`}
            >
              {categoryOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={save}
            className="mt-2 w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
          >
            {editing ? 'Save changes' : 'Add transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
