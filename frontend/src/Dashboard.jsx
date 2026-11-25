import { formatCurrency } from './utils/format';

function SummaryCard({ label, value, gradient, icon }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-sm`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
          {icon}
        </span>
      </div>
    </div>
  );
}

function WalletIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V8.25A2.25 2.25 0 0 0 18.75 6H5.25A2.25 2.25 0 0 0 3 8.25V12m4.5 3.75h.008v.008H7.5v-.008ZM12 15.75h4.5"
      />
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0-6 6m6-6 6 6" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0 6-6m-6 6-6-6" />
    </svg>
  );
}

function Dashboard({ transactions, loading, isFiltered }) {
  const income = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const expenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const balance = income - expenses;

  const displayedValue = (value) => (loading ? '—' : formatCurrency(value));

  return (
    <section aria-busy={loading} aria-label="Financial overview">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Overview</h2>
        {isFiltered && (
          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Filtered
          </span>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total Balance"
          value={displayedValue(balance)}
          gradient="from-blue-600 to-blue-500"
          icon={<WalletIcon />}
        />
        <SummaryCard
          label="Total Income"
          value={displayedValue(income)}
          gradient="from-emerald-600 to-emerald-500"
          icon={<TrendUpIcon />}
        />
        <SummaryCard
          label="Total Expenses"
          value={displayedValue(expenses)}
          gradient="from-rose-600 to-rose-500"
          icon={<TrendDownIcon />}
        />
      </div>
    </section>
  );
}

export default Dashboard;
