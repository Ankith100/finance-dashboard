const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })

const axisCurrency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatMoney(value) {
  return currency.format(value)
}

/** Compact rupee labels for chart Y-axes */
export function formatChartAxis(value) {
  return axisCurrency.format(value)
}

export function formatShortDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
