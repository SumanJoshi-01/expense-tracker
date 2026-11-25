import { useState } from 'react';
import api from './api';
import { CATEGORIES } from './constants';

const emptyForm = {
  type: 'expense',
  amount: '',
  category: 'Food',
  description: '',
};

const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200';

function TransactionForm({ editingTransaction, onSaved, onCancelEdit }) {
  const [formData, setFormData] = useState(() =>
    editingTransaction
      ? {
          type: editingTransaction.type,
          amount: String(editingTransaction.amount),
          category: editingTransaction.category,
          description: editingTransaction.description || '',
        }
      : emptyForm
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(editingTransaction);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'amount') {
      const cleaned = value.replace(/[^0-9.]/g, '');
      const [whole, ...decimalParts] = cleaned.split('.');
      const decimalPart = decimalParts.join('').slice(0, 2);
      const nextAmount =
        decimalParts.length > 0 ? `${whole}.${decimalPart}` : whole;
      setFormData((previous) => ({ ...previous, amount: nextAmount }));
      return;
    }

    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setError('');
    onCancelEdit();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const amount = Math.round(Number(formData.amount) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Please enter an amount greater than 0.');
      return;
    }

    const payload = {
      type: formData.type,
      amount,
      category: formData.category,
      description: formData.description.trim(),
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        await api.put(`/transactions/${editingTransaction._id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setFormData(emptyForm);
      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Something went wrong. Please check that the backend is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          {isEditing ? 'Edit transaction' : 'Add transaction'}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEditing
            ? 'Update the details below and save your changes.'
            : 'Record a new income or expense.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-slate-700">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-slate-700">
            Amount (NPR)
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            required
            value={formData.amount}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={inputClass}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            placeholder="What was this for?"
            value={formData.description}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200"
          >
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Add transaction'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;
