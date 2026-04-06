import { createContext, useContext, useMemo, useReducer, useState } from 'react'
import { initialTransactions } from '../data/initialTransactions.js'

function transactionReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { ...action.payload, id: Date.now() }]
    case 'EDIT':
      return state.map((row) => (row.id === action.payload.id ? action.payload : row))
    case 'DELETE':
      return state.filter((row) => row.id !== action.payload)
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [transactions, dispatch] = useReducer(transactionReducer, initialTransactions)
  const [role, setRole] = useState('Admin')
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterFlow, setFilterFlow] = useState('All')
  const [filterCategory, setFilterCategory] = useState('All')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [activeTab, setActiveTab] = useState('dashboard')

  const value = useMemo(
    () => ({
      transactions,
      dispatch,
      role,
      setRole,
      darkMode,
      setDarkMode,
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
      activeTab,
      setActiveTab,
      isAdmin: role === 'Admin',
    }),
    [
      transactions,
      role,
      darkMode,
      searchQuery,
      filterFlow,
      filterCategory,
      sortField,
      sortDirection,
      activeTab,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with AppProvider
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}
