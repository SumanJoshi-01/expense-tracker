import { useState } from 'react';
import api from './api';
import { formatCurrency, formatDate } from './utils/format';

function TransactionList({
  transactions,
  loading,
  error,
  isFiltered,
  onRetry,
  onEdit,
  onChanged,
}) {
  const [deletingId, setDeletingId] = useState(null);
  const [actionError, setActionError] = useState('');

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this transaction? This cannot be undone.');
    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setActionError('');
      await api.delete(`/transactions/${id}`);
      onChanged();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete the transaction.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Transactions</h2>
          <p className="text-xs text-slate-500">
            {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>
        <button
          type="button"
          onClick={onChanged}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="m-5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          <p>{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-semibold underline underline-offset-2 hover:text-rose-900"
          >
            Try again
          </button>
        </div>
      )}

      {actionError && (
        <div className="mx-5 mt-5 flex items-start justify-between gap-3 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
          <p>{actionError}</p>
          <button
            type="button"
            onClick={() => setActionError('')}
            className="font-semibold underline underline-offset-2 hover:text-rose-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center gap-3 text-sm text-slate-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center gap-2 px-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
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
                d="M9 14h6m-6-4h6m-9 9h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9L5.5 5H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z"
              />
            </svg>
          </span>
          <p className="text-sm font-medium text-slate-700">
            {isFiltered ? 'No matching transactions' : 'No transactions yet'}
          </p>
          <p className="text-xs text-slate-500">
            {isFiltered
              ? 'Try changing or clearing the filters above.'
              : 'Add your first income or expense using the form.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === 'income';

            return (
              <li
                key={transaction._id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                      isIncome
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '−'}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {transaction.category}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {transaction.description || 'No description'}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pl-12 sm:justify-end sm:pl-0">
                  <p
                    className={`whitespace-nowrap text-sm font-semibold ${
                      isIncome ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {isIncome ? '+' : '−'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(transaction._id)}
                      disabled={deletingId === transaction._id}
                      className="rounded-lg border border-rose-200 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === transaction._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default TransactionList;
