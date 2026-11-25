import { useEffect, useState } from 'react';
import api from './api';
import Dashboard from './Dashboard';
import FilterBar from './FilterBar';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const initialFilters = {
  type: 'all',
  category: 'all',
  month: '',
};

function App() {
  const [filters, setFilters] = useState(initialFilters);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const isFiltered =
    filters.type !== 'all' || filters.category !== 'all' || filters.month !== '';

  useEffect(() => {
    let ignore = false;

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {};
        if (filters.type !== 'all') {
          params.type = filters.type;
        }
        if (filters.category !== 'all') {
          params.category = filters.category;
        }
        if (filters.month) {
          params.month = filters.month;
        }

        const response = await api.get('/transactions', { params });
        if (!ignore) {
          setTransactions(response.data);
        }
      } catch (err) {
        if (!ignore) {
          setError(
            err.response?.data?.message ||
              'Could not load transactions. Please check that the backend is running.'
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchTransactions();

    return () => {
      ignore = true;
    };
  }, [filters, refreshKey]);

  const refresh = () => {
    setRefreshKey((key) => key + 1);
  };

  const handleSaved = () => {
    setEditingTransaction(null);
    refresh();
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setEditingTransaction(null);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setEditingTransaction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
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
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Expense Tracker
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Keep track of your income and spending in one place.
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            MERN Stack
          </p>
        </header>

        <main className="space-y-6">
          <Dashboard
            transactions={transactions}
            loading={loading}
            isFiltered={isFiltered}
          />

          <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-start">
            <div className="lg:sticky lg:top-6">
              <TransactionForm
                key={editingTransaction?._id || 'new'}
                editingTransaction={editingTransaction}
                onSaved={handleSaved}
                onCancelEdit={() => setEditingTransaction(null)}
              />
            </div>

            <div className="space-y-4">
              <FilterBar
                filters={filters}
                onChange={handleFilterChange}
                onClear={handleClearFilters}
              />
              <TransactionList
                transactions={transactions}
                loading={loading}
                error={error}
                isFiltered={isFiltered}
                onRetry={refresh}
                onEdit={handleEdit}
                onChanged={refresh}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
