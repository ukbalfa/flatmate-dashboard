'use client';
import { useEffect, useState } from 'react';
import { db } from '../../../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';

interface Expense {
  id: string;
  amount: number;
  category: string;
  paidBy: string;
  date: string;
  note?: string;
}

const CATEGORIES = [
  { name: 'Rent', color: 'bg-[#1D9E75]' },
  { name: 'Groceries', color: 'bg-blue-500' },
  { name: 'Utilities', color: 'bg-[#f59e0b]' },
  { name: 'Internet', color: 'bg-purple-500' },
  { name: 'Misc', color: 'bg-gray-400' },
];

function getCategoryColor(category: string) {
  return CATEGORIES.find(c => c.name === category)?.color || 'bg-gray-400';
}

function getMonth(date: string) {
  return date.slice(0, 7);
}

export default function ExpensesPage() {
  const { userProfile } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Rent');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; });

  useEffect(() => {
    const q = query(collection(db, 'expenses'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
        setExpenses(data);
        setLoading(false);
      },
      (error) => {
        console.error('Failed to load expenses:', error);
        toast.error('Failed to load expenses');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const summary = CATEGORIES.map(cat => {
    const total = expenses
      .filter(e => e.category === cat.name && getMonth(e.date) === selectedMonth)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    return { ...cat, total };
  });
  const maxTotal = Math.max(...summary.map(s => s.total), 1);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    try {
      await addDoc(collection(db, 'expenses'), {
        amount: Number(amount),
        category,
        paidBy: userProfile?.username || '',
        date,
        note,
      });
      setAmount('');
      setCategory('Rent');
      setDate(new Date().toISOString().slice(0, 10));
      setNote('');
      toast.success('Expense added');
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const filtered = expenses
    .filter(e => getMonth(e.date) === selectedMonth)
    .filter(e => filter === 'All' || e.category === filter);
  const isAdmin = userProfile?.role === 'admin';

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      await deleteDoc(doc(db, 'expenses', id));
      toast.success('Deleted successfully');
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Card */}
        <div className="bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#0a0a0a] dark:text-gray-100">{selectedMonth}</h3>
          <div className="space-y-3">
            {summary.map((cat) => (
              <div key={cat.name} className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${cat.color}`}>
                  {cat.name}
                </span>
                <div className="flex-1 bg-[#f3f4f6] dark:bg-gray-700 rounded-md h-5 relative overflow-hidden">
                  <div
                    className={`${cat.name === 'Rent' ? 'bg-[#1D9E75]' : cat.color} h-5 rounded-md transition-all duration-500`}
                    style={{ width: `${(cat.total / maxTotal) * 100}%`, minWidth: cat.total ? 24 : 2 }}
                  ></div>
                </div>
                <span className="ml-2 text-[#0a0a0a] dark:text-gray-100 font-semibold min-w-[100px] text-right text-sm">
                  {cat.total.toLocaleString()} UZS
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Expense Form */}
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#0a0a0a] dark:text-gray-100">Add expense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#6b7280] dark:text-gray-400 mb-2">Amount (UZS)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-[#0a0a0a] dark:text-gray-100 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm text-[#6b7280] dark:text-gray-400 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-[#0a0a0a] dark:text-gray-100 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#6b7280] dark:text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-[#0a0a0a] dark:text-gray-100 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-[#6b7280] dark:text-gray-400 mb-2">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 text-[#0a0a0a] dark:text-gray-100 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none"
                placeholder="Optional"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-4 bg-[#0a0a0a] dark:bg-gray-700 text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition"
          >
            Add Expense
          </button>
        </form>

        {/* Transactions Card */}
        <div className="bg-white dark:bg-gray-800 border border-[#e5e7eb] dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#0a0a0a] dark:text-gray-100">Transactions</h3>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 items-center mb-4">
            <button
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                filter === 'All'
                  ? 'bg-[#1D9E75] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-[#6b7280] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setFilter('All')}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition ${
                  filter === cat.name
                    ? cat.color + ' text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-[#6b7280] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                onClick={() => setFilter(cat.name)}
              >
                {cat.name}
              </button>
            ))}
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="ml-auto bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm text-[#0a0a0a] dark:text-gray-100 focus:ring-2 focus:ring-[#1D9E75] focus:border-transparent outline-none"
            />
          </div>

          {/* Transaction List */}
          <div className="space-y-0">
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="py-4 border-b border-[#f3f4f6] dark:border-gray-700 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-[#6b7280] dark:text-gray-400 text-sm">No expenses found.</div>
            ) : (
              filtered.map((e, i) => {
                const isLast = i === filtered.length - 1;
                return (
                  <div
                    key={e.id}
                    className={`flex items-center justify-between py-4 ${
                      !isLast ? 'border-b border-[#f3f4f6] dark:border-gray-700' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-[#6b7280] dark:text-gray-400 min-w-[80px]">{e.date}</div>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getCategoryColor(e.category)}`}>
                        {e.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-[#0a0a0a] dark:text-gray-100">
                        {Number(e.amount).toLocaleString()} UZS
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1D9E75] flex items-center justify-center text-white text-xs font-semibold">
                          {e.paidBy?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="text-sm text-[#6b7280] dark:text-gray-400">{e.note || ''}</div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(e.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Delete expense"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
