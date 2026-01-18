'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Metrics', href: '/metrics' },
  { label: 'Chaos', href: '/chaos' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-slate-950 border-b border-slate-800 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white hover:text-cyan-400 transition">
          🔬 Open Reliability Lab
        </Link>

        {/* Navigation */}
        <div className="flex gap-8">
          {navItems.map((item) => (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="text-slate-300 hover:text-cyan-400 transition font-medium"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Prometheus Link */}
        <motion.a
          href="http://localhost:9090"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition"
        >
          Prometheus
        </motion.a>
      </div>
    </nav>
  );
}
