'use client';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import {
  TrendingUp,
  Receipt,
  Sparkles,
  CheckSquare,
  Users,
  ArrowRight,
  DollarSign,
  Calendar,
  ChevronRight,
  Star,
} from 'lucide-react';

const FEATURES = [
  {
    icon: DollarSign,
    title: 'Rent Tracking',
    description: 'Never chase rent again — automatic reminders and countdowns',
    color: 'text-[#1D9E75]',
  },
  {
    icon: Receipt,
    title: 'Expense Splitting',
    description: 'Split costs instantly by category. See totals in real time.',
    color: 'text-[#1D9E75]',
  },
  {
    icon: Sparkles,
    title: 'Cleaning Schedule',
    description: 'Auto-rotating weekly tasks. Everyone does their part.',
    color: 'text-[#1D9E75]',
  },
  {
    icon: TrendingUp,
    title: 'Live Exchange Rates',
    description: 'Currency-proof your budget — USD/UZS/EUR updated every 10 minutes',
    color: 'text-[#1D9E75]',
  },
  {
    icon: CheckSquare,
    title: 'Task Manager',
    description: 'Shared to-do list with due dates and smart assignments',
    color: 'text-[#1D9E75]',
  },
  {
    icon: Users,
    title: 'Roommate Profiles',
    description: 'Contact info, Telegram links and roles for everyone',
    color: 'text-[#1D9E75]',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Finally an app that actually helps us manage the flat without any confusion.',
    author: "Ulug'bek",
    role: 'Admin, Tashkent',
    avatar: 'U',
  },
  {
    quote: 'Love the automatic rent reminders. No more awkward conversations!',
    author: 'Jasur',
    role: 'Student, INHA University',
    avatar: 'J',
  },
  {
    quote: 'The cleaning schedule feature is a game changer for our apartment.',
    author: 'Dilshod',
    role: 'Software Engineer',
    avatar: 'D',
  },
];

const TRUSTED_BY = ['TASHMI', 'INHA', 'WIUT', 'TUIT', 'Webster'];

function FeatureCard({ feature, index }: { feature: typeof FEATURES[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] as const }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white/[0.03] dark:bg-white/[0.03] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-[#1D9E75]/30 transition-all duration-300"
      style={{
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
        className="mb-4"
      >
        <div className="w-14 h-14 rounded-xl bg-[#1D9E75]/10 dark:bg-[#1D9E75]/10 flex items-center justify-center">
          <feature.icon className={`w-7 h-7 ${feature.color}`} strokeWidth={1.5} />
        </div>
      </motion.div>
      <h3 className="text-lg font-semibold text-slate-50 mb-2">{feature.title}</h3>
      <p className="text-sm text-slate-200 leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0a0b0f]/80 backdrop-blur-lg border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]"></span>
              <span className="text-lg font-bold text-white">FlatMate</span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={scrollToFeatures}
                className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block"
              >
                Features
              </button>
              <Link
                href="/login"
                className="fm-btn fm-btn-primary px-4 py-2 text-sm font-medium rounded-lg"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background with enhanced overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,black_100%)] z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(29,158,117,0.08),transparent_50%)] z-10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(29,158,117,0.05),transparent_50%)] z-10"></div>
        </div>

        {/* Floating UI Elements with Parallax */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-1/4 left-[8%] hidden lg:block z-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/[0.12] backdrop-blur-md border border-white/[0.18] rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1D9E75]/30 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#1D9E75]" />
              </div>
              <div>
                <div className="text-xs text-white/80 font-medium">Rent due</div>
                <div className="text-sm font-medium text-white">250,000 UZS</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: y2, opacity }}
          className="absolute top-1/3 right-[10%] hidden lg:block z-20"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/[0.12] backdrop-blur-md border border-white/[0.18] rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1D9E75]/30 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#1D9E75]" />
              </div>
              <div>
                <div className="text-xs text-white/80 font-medium">Next cleaning</div>
                <div className="text-sm font-medium text-white">Kitchen · Monday</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: y1, opacity }}
          className="absolute bottom-1/4 left-[12%] hidden lg:block z-20"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/[0.12] backdrop-blur-md border border-white/[0.18] rounded-xl p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1D9E75]/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#1D9E75]" />
              </div>
              <div>
                <div className="text-xs text-white/80 font-medium">USD/UZS</div>
                <div className="text-sm font-medium text-white">12,850</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-30 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse"></span>
              <span className="text-xs text-gray-300 font-medium">Apartment management, simplified</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-white"
          >
            Your apartment, run like{' '}
            <span
              className="bg-gradient-to-r from-[#1D9E75] via-[#3de0a9] to-[#fef9f3] bg-clip-text text-transparent"
              style={{ 
                backgroundSize: '200% auto',
              }}
            >
              clockwork
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-slate-100 mb-10 max-w-2xl mx-auto leading-relaxed font-medium tracking-wide"
          >
            FlatMate helps roommates manage rent, expenses, cleaning schedules and more — in one place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link
              href="/login"
              className="group fm-btn fm-btn-dark px-8 py-4 text-base font-semibold rounded-xl flex items-center gap-2 hover:shadow-[0_0_30px_rgba(29,158,117,0.3)] transition-all"
            >
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={scrollToFeatures}
              className="fm-btn fm-btn-ghost px-8 py-4 text-base font-semibold rounded-xl flex items-center gap-2"
            >
              See features
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-sm text-gray-500"
          >
            Used by roommates in Tashkent 🇺🇿
          </motion.div>
        </div>
      </section>

          <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-b from-[#0a0b0f] to-[#0f1117]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white tracking-tight">See FlatMate in action</h2>
                <p className="text-slate-100 text-lg font-medium tracking-wide mb-8">Watch how easy it is to manage your shared apartment</p>
                <Link
                  href="#features"
                  className="group inline-flex items-center gap-2 fm-btn fm-btn-ghost px-8 py-4 text-base font-semibold rounded-xl"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6 lg:px-8 bg-[#0f1117]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white tracking-tight">
              Everything your apartment needs
            </h2>
            <p className="text-slate-100 text-lg max-w-2xl mx-auto font-medium tracking-wide">
              All the tools to run your shared flat smoothly, from rent to chores
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Testimonials */}
      <section className="relative py-24 px-6 lg:px-8 bg-gradient-to-b from-[#0f1117] to-[#0a0b0f]">
        <div className="max-w-5xl mx-auto">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] rounded-full px-6 py-3 mb-12">
              <span className="text-sm text-gray-400">6 Features</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="text-sm text-gray-400">Live Data</span>
              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
              <span className="text-sm text-gray-400">Built for roommates</span>
            </div>
          </motion.div>

          {/* Main Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#1D9E75]/10 to-transparent border border-[#1D9E75]/20 rounded-2xl p-8 sm:p-12 mb-12"
          >
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-[#1D9E75] text-[#1D9E75]" />
              ))}
            </div>
            <blockquote className="text-2xl sm:text-3xl font-medium text-white mb-6 leading-relaxed">
              &ldquo;Finally an app that actually helps us manage the flat without any confusion.&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={`https://ui-avatars.com/api/?name=Ulugbek&background=1D9E75&color=fff`}
                    alt="Ulug&apos;bek"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full"
                  />
                </div>
              <div>
                <div className="text-white font-semibold">Ulug&apos;bek</div>
                <div className="text-slate-200 text-sm">Admin, Tashkent</div>
              </div>
            </div>
          </motion.div>

          {/* Additional Testimonials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {TESTIMONIALS.slice(1).map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-[#1D9E75] text-[#1D9E75]" />
                  ))}
                </div>
                <p className="text-slate-100 mb-4 text-sm leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${testimonial.author}&background=1D9E75&color=fff`}
                    alt={testimonial.author}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  </div>
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.author}</div>
                    <div className="text-slate-200 text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trusted By */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-slate-200 text-sm mb-6 font-medium">Trusted by roommates from</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {TRUSTED_BY.map((institution) => (
                <div
                  key={institution}
                  className="px-6 py-3 rounded-full bg-[#1a1d27] border border-white/5 text-gray-400 font-semibold tracking-wider text-sm hover:text-teal-400 transition-colors"
                >
                  {institution}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 lg:px-8 bg-[#0a0b0f] border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Product</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={scrollToFeatures} className="text-gray-400 hover:text-white text-sm transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Community</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                    Telegram
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">About</h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D9E75]"></span>
                <span className="text-white font-bold text-base">FlatMate</span>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                Making shared living simple and stress-free
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2026 FlatMate • Made with ❤️ in Tashkent, Uzbekistan
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-gray-500 hover:text-white text-xs transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
