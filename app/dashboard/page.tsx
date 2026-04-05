'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, where, addDoc, deleteDoc, doc, getDoc, setDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Pin, X, Megaphone, Clock, Calendar, Receipt, CheckCircle2, Sparkles, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

interface Expense {
  id: string;
  amount: number;
  category: string;
  paidBy: string;
  date: string;
  note?: string;
}

interface CleaningTask {
  id: string;
  task: string;
  assignedTo: string;
  dayOfWeek: string;
  weekStart: string;
  done: boolean;
}

interface Task {
  id: string;
  text: string;
  done: boolean;
  assignedTo: string;
  dueDate: string;
  createdBy: string;
}

interface Announcement {
  id: string;
  text: string;
  createdBy: string;
  createdAt: Timestamp;
  pinned: boolean;
}

interface ActivityEvent {
  user: string;
  text: string;
  date: Date;
}

function timeAgo(val: Timestamp | Date | string) {
  if (!val) return '';
  const d = val instanceof Timestamp ? val.toDate() : new Date(val);
  const now = new Date();
  const ms = now.getTime() - d.getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(d).toLocaleDateString();
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

function SkeletonCard() {
  return <div className="animate-pulse bg-[#1a1d27] border border-white/5 rounded-xl h-[100px] w-full" />;
}

export default function DashboardPage() {
  const router = useRouter();
  const { userProfile, loading: authLoading } = useAuth();

  const [rentDue, setRentDue] = useState<number | null>(null);
  const [rentDays, setRentDays] = useState<string>('—');
  const [rentDueDay, setRentDueDay] = useState(10);
  const [expensesMonth, setExpensesMonth] = useState<number | null>(null);
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [marketOpen, setMarketOpen] = useState<boolean>(true);
  const [openTasks, setOpenTasks] = useState<number | null>(null);
  const [overdueTasks, setOverdueTasks] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [nextCleaning, setNextCleaning] = useState<CleaningTask | null>(null);
  const [lastExpense, setLastExpense] = useState<Expense | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annText, setAnnText] = useState('');
  const [annPinned, setAnnPinned] = useState(false);
  const [annLoading, setAnnLoading] = useState(true);
  const [annFormOpen, setAnnFormOpen] = useState(false);

  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !userProfile) {
      router.replace('/login');
    }
  }, [authLoading, userProfile, router]);

  useEffect(() => {
    const fetchRent = async () => {
      const q = query(collection(db, 'expenses'), where('category', '==', 'Rent'), orderBy('date', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0].data();
        setRentDue(d.amount);
        const today = new Date();
        const dueDate = new Date(today.getFullYear(), today.getMonth(), rentDueDay);
        const diff = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (diff > 0) setRentDays(`${diff} days left`);
        else if (diff === 0) setRentDays('Due today');
        else setRentDays('overdue');
      } else {
        setRentDue(null);
        setRentDays('—');
      }
    };
    const fetchSettings = async () => {
      const settingsSnap = await getDoc(doc(db, 'settings', 'general'));
      if (settingsSnap.exists() && settingsSnap.data().rentDueDay) {
        setRentDueDay(settingsSnap.data().rentDueDay);
      }
    };
    const fetchExpenses = async () => {
      const q = query(collection(db, 'expenses'));
      const snap = await getDocs(q);
      const nowMonth = new Date().toISOString().slice(0, 7);
      let total = 0;
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.date && d.date.slice(0, 7) === nowMonth) {
          total += Number(d.amount) || 0;
        }
      });
      setExpensesMonth(total);
    };
    const fetchRate = async () => {
      try {
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        setUsdRate(data.rates?.UZS || null);
        const now = new Date();
        const day = now.getUTCDay();
        const hour = now.getUTCHours();
        setMarketOpen(day >= 1 && day <= 5 && hour >= 4 && hour < 13);
      } catch {
        setUsdRate(null);
        setMarketOpen(false);
      }
    };
    
    const unsubscribeTasks = onSnapshot(
      collection(db, 'tasks'),
      (snapshot) => {
        let open = 0, overdue = 0;
        const today = new Date().toISOString().slice(0, 10);
        snapshot.docs.forEach(doc => {
          const d = doc.data();
          if (!d.done) {
            open++;
            if (d.dueDate && d.dueDate < today) overdue++;
          }
        });
        setOpenTasks(open);
        setOverdueTasks(overdue);
      },
      (error) => {
        console.error('Failed to load task stats:', error);
        toast.error('Failed to load task stats');
      }
    );
    
    Promise.all([fetchRent(), fetchExpenses(), fetchRate(), fetchSettings()]).then(() => setLoading(false));
    
    return () => {
      unsubscribeTasks();
    };
  }, [rentDueDay]);

  useEffect(() => {
    const fetchQuickStats = async () => {
      const today = new Date();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = dayNames[today.getDay()];
      const cleaningQ = query(collection(db, 'cleaning'), where('dayOfWeek', '>=', todayName));
      const cleaningSnap = await getDocs(cleaningQ);
      if (!cleaningSnap.empty) setNextCleaning({ id: cleaningSnap.docs[0].id, ...cleaningSnap.docs[0].data() } as CleaningTask);

      const expQ = query(collection(db, 'expenses'), orderBy('date', 'desc'));
      const expSnap = await getDocs(expQ);
      if (!expSnap.empty) setLastExpense({ id: expSnap.docs[0].id, ...expSnap.docs[0].data() } as Expense);

      const taskQ = query(collection(db, 'tasks'), where('done', '==', false), orderBy('dueDate'));
      const taskSnap = await getDocs(taskQ);
      if (!taskSnap.empty) {
        const todayISO = new Date().toISOString().slice(0, 10);
        const upcoming = taskSnap.docs.find(d => d.data().dueDate >= todayISO);
        if (upcoming) setNextTask({ id: upcoming.id, ...upcoming.data() } as Task);
      }
      setIsLoading(false);
    };
    fetchQuickStats();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Announcement[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Announcement));
        const pinned = items.filter(a => a.pinned);
        const normal = items.filter(a => !a.pinned);
        setAnnouncements([...pinned, ...normal]);
        setAnnLoading(false);
      },
      (error) => {
        console.error('Failed to load announcements:', error);
        toast.error('Failed to load announcements');
        setAnnLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const postAnnouncement = async () => {
    if (!annText.trim() || !userProfile) return;
    try {
      await addDoc(collection(db, 'announcements'), {
        text: annText.trim(),
        createdBy: userProfile.username,
        createdAt: Timestamp.now(),
        pinned: annPinned,
      });
      setAnnText('');
      setAnnPinned(false);
      setAnnFormOpen(false);
      toast.success('Announcement posted');
    } catch (error) {
      console.error('Failed to post announcement:', error);
      toast.error('Failed to post');
    }
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, 'announcements', id));
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateRentDay = async () => {
    if (userProfile?.role !== 'admin') return;
    const newDay = window.prompt('Enter the day of the month rent is due (1-31):', rentDueDay.toString());
    if (!newDay) return;
    const day = parseInt(newDay);
    if (isNaN(day) || day < 1 || day > 31) {
      toast.error('Please enter a valid day between 1 and 31');
      return;
    }
    try {
      await setDoc(doc(db, 'settings', 'general'), { rentDueDay: day }, { merge: true });
      setRentDueDay(day);
      toast.success('Rent due date updated');
    } catch (error) {
      console.error('Failed to update rent due date:', error);
      toast.error('Failed to update rent due date');
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const events: ActivityEvent[] = [];
      const expSnap = await getDocs(query(collection(db, 'expenses'), orderBy('date', 'desc')));
      expSnap.docs.slice(0, 3).forEach(d => {
        const data = d.data();
        events.push({ user: data.paidBy, text: `added an expense · ${data.category} · ${Number(data.amount).toLocaleString()} UZS`, date: new Date(data.date) });
      });
      const taskSnap = await getDocs(query(collection(db, 'tasks'), orderBy('dueDate')));
      taskSnap.docs.filter(d => d.data().done).slice(0, 3).forEach(d => {
        const data = d.data();
        events.push({ user: data.assignedTo, text: `completed task · ${data.text}`, date: new Date(data.dueDate) });
      });
      const cleanSnap = await getDocs(query(collection(db, 'cleaning')));
      cleanSnap.docs.filter(d => d.data().done).slice(0, 2).forEach(d => {
        const data = d.data();
        events.push({ user: data.assignedTo, text: `completed cleaning · ${data.task}`, date: new Date() });
      });
      events.sort((a, b) => b.date.getTime() - a.date.getTime());
      setActivity(events.slice(0, 8));
      setActivityLoading(false);
    };
    fetchActivity();
  }, []);

  const metrics = [
    { label: 'Expenses this month', value: expensesMonth !== null ? `${Number(expensesMonth).toLocaleString()} UZS` : '—', sub: '', subColor: '' },
    { label: 'USD/UZS rate', value: usdRate !== null ? usdRate.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—', sub: marketOpen ? 'Market open' : 'Market closed', subColor: marketOpen ? 'text-[#1D9E75]' : 'text-gray-400' },
    { label: 'Open tasks', value: openTasks !== null ? String(openTasks) : '—', sub: overdueTasks !== null && overdueTasks > 0 ? `${overdueTasks} overdue` : '', subColor: overdueTasks !== null && overdueTasks > 0 ? 'text-red-500' : 'text-gray-400' },
  ];

  function MetricCard({ m, i, children }: { m: { label: string; value: string; sub: string; subColor: string }; i: number; children?: React.ReactNode }) {
    return (
      <motion.div
        key={m.label}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className={`bg-white dark:bg-[#1a1d27] border border-[#e5e7eb] dark:border-white/[0.08] rounded-xl p-6 transition-shadow hover:shadow-md ${loading ? 'animate-pulse-teal' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-gray-400 dark:text-[#6b7280]">{m.label}</span>
          {children}
        </div>
        <span className="mt-2 block text-3xl font-bold text-gray-900 dark:text-[#f1f5f9]">{m.value}</span>
        {m.sub && <span className={`mt-1 block text-xs font-semibold ${m.subColor}`}>{m.sub}</span>}
      </motion.div>
    );
  }

  function Avatar({ username: un }: { username: string }) {
    const initial = un?.[0]?.toUpperCase() || '?';
    return (
      <span className="w-7 h-7 rounded-full bg-[#1D9E75]/10 text-[#1D9E75] flex items-center justify-center text-xs font-bold flex-shrink-0">
        {initial}
      </span>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard m={{ label: 'Rent due', value: rentDue !== null ? `${Number(rentDue).toLocaleString()} UZS` : '—', sub: rentDays, subColor: rentDays === 'overdue' ? 'text-red-500' : 'text-gray-400' }} i={0}>
          {userProfile?.role === 'admin' && (
            <button
              onClick={handleUpdateRentDay}
              className="text-gray-400 hover:text-[#1D9E75] transition-colors"
              aria-label="Edit rent due date"
            >
              <Edit2 size={14} />
            </button>
          )}
        </MetricCard>
        {metrics.map((m, i) => (
          <MetricCard key={m.label} m={m} i={i + 1} />
        ))}
      </div>

      {/* Quick info row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <motion.div custom={0} initial="hidden" animate="visible" variants={cardVariants} className="bg-white dark:bg-[#1a1d27] border border-[#e5e7eb] dark:border-white/[0.08] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-400">Next cleaning</span>
              </div>
              {nextCleaning ? (
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{nextCleaning.task}</div>
                  <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">{nextCleaning.assignedTo} · {nextCleaning.dayOfWeek}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">No tasks scheduled</div>
              )}
            </motion.div>
            <motion.div custom={1} initial="hidden" animate="visible" variants={cardVariants} className="bg-white dark:bg-[#1a1d27] border border-[#e5e7eb] dark:border-white/[0.08] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-400">Last expense</span>
              </div>
              {lastExpense ? (
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{lastExpense.category}</div>
                  <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">{Number(lastExpense.amount).toLocaleString()} UZS · {lastExpense.date}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">No expenses yet</div>
              )}
            </motion.div>
            <motion.div custom={2} initial="hidden" animate="visible" variants={cardVariants} className="bg-white dark:bg-[#1a1d27] border border-[#e5e7eb] dark:border-white/[0.08] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-xs uppercase tracking-wider text-gray-400">Next task due</span>
              </div>
              {nextTask ? (
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{nextTask.text}</div>
                  <div className="text-xs text-gray-500 dark:text-[#94a3b8] mt-0.5">Due {nextTask.dueDate}</div>
                </div>
              ) : (
                <div className="text-sm text-gray-400">No upcoming tasks</div>
              )}
            </motion.div>
          </>
        )}
      </div>

      {/* Announcements */}
      <div className="bg-white dark:bg-[#1a1d27] border border-[#e5e7eb] dark:border-white/[0.08] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9] flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-[#1D9E75]" />
            Announcements
          </h3>
          {userProfile?.role === 'admin' && (
            <button onClick={() => setAnnFormOpen(!annFormOpen)} className="fm-btn fm-btn-primary px-3 py-1.5 text-xs font-medium">
              {annFormOpen ? 'Cancel' : 'Post'}
            </button>
          )}
        </div>
        {userProfile?.role === 'admin' && annFormOpen && (
          <div className="mb-4 p-3 rounded-lg bg-[#f9fafb] dark:bg-white/[0.03] border border-[#e5e7eb] dark:border-white/[0.06]">
            <textarea
              value={annText}
              onChange={e => setAnnText(e.target.value)}
              placeholder="Write an announcement..."
              className="fm-input w-full resize-none text-sm"
              rows={2}
            />
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-[#94a3b8] cursor-pointer">
                <input type="checkbox" checked={annPinned} onChange={e => setAnnPinned(e.target.checked)} className="fm-checkbox" />
                Pin this?
              </label>
              <button onClick={postAnnouncement} className="fm-btn fm-btn-primary px-4 py-1.5 text-xs font-medium" disabled={!annText.trim()}>
                Post
              </button>
            </div>
          </div>
        )}
        {annLoading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <div className="text-sm">No announcements yet</div>
          </div>
        ) : (
          <div className="space-y-3">
            {announcements.slice(0, 5).map((ann, i) => (
              <motion.div key={ann.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="flex gap-3">
                <Avatar username={ann.createdBy} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-[#f1f5f9]">{ann.createdBy}</span>
                    {ann.pinned && <Pin className="w-3 h-3 text-[#1D9E75]" />}
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(ann.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-[#94a3b8] mt-0.5 break-words">{ann.text}</p>
                </div>
                {userProfile?.role === 'admin' && (
                  <button onClick={() => deleteAnnouncement(ann.id)} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-[#1a1d27] border border-[#e5e7eb] dark:border-white/[0.08] rounded-xl p-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-[#f1f5f9] mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1D9E75]" />
          Recent activity
        </h3>
        {activityLoading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : activity.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <div className="text-sm">No recent activity</div>
          </div>
        ) : (
          <div className="space-y-3">
            {activity.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
                <Avatar username={a.user} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-900 dark:text-[#f1f5f9]">{a.user}</span>
                  <span className="text-sm text-gray-500 dark:text-[#94a3b8]"> {a.text}</span>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{timeAgo(a.date)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
