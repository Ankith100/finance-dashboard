# Finance Dashboard (FinDash)

A single-page **personal finance dashboard** built with **React** and **Vite**. It tracks income and expenses with sample data stored in the browser (no backend). Amounts are formatted in **Indian Rupees (₹)**.

## Features

- **Dashboard** — Summary cards, balance-over-time chart, expense breakdown (pie chart), month-over-month comparison, and auto-generated insights (e.g. top spending category, savings rate, spend vs last month).
- **Transactions** — Search, filter by income/expense and category, sort by date or amount. **Admin** can add, edit, and delete rows; **Viewer** is read-only. Export the list as **CSV**.
- **Insights** — Dedicated view with the same insight cards plus monthly comparison and expense pie chart.
- **UI** — Dark / light mode, responsive layout, **Recharts** for charts, **Tailwind CSS** for styling.

## How to run

From the repository root:

```bash
npm install
```

**Development** (hot reload; default [http://localhost:5173](http://localhost:5173)):

```bash
npm run dev
```

**Production build**:

```bash
npm run build
```

**Preview the production build** (after `npm run build`):

```bash
npm run preview
```

**Lint**:

```bash
npm run lint
```
