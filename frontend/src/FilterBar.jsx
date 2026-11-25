import { CATEGORIES } from './constants';

const fieldClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200';

function FilterBar({ filters, onChange, onClear }) {
  const isFiltered =
    filters.type !== 'all' || filters.category !== 'all' || filters.month !== '';

  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end">
        <div>
          <label htmlFor="filter-type" className="mb-1.5 block text-xs font-medium text-slate-600">
            Type
          </label>
          <select
            id="filter-type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Category
          </label>
          <select
            id="filter-category"
            name="category"
            value={filters.category}
            onChange={handleChange}
            className={fieldClass}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-month"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            Month / Year
          </label>
          <input
            id="filter-month"
            name="month"
            type="month"
            value={filters.month}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>

        <button
          type="button"
          onClick={onClear}
          disabled={!isFiltered}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
        >
          Clear
        </button>
      </div>
    </section>
  );
}

export default FilterBar;
