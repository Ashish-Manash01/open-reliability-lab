'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

const features = [
  {
    icon: '📊',
    title: 'Real-time Observability',
    description: 'Monitor your microservices with live health checks and latency tracking',
  },
  {
    icon: '⚡',
    title: 'Chaos Engineering',
    description: 'Inject failures and observe how your system responds to outages',
  },
  {
    icon: '📈',
    title: 'Comprehensive Metrics',
    description: 'Track throughput, latency, error rates, and more with Prometheus integration',
  },
];

const ctaButtons = [
  { label: 'View Dashboard', href: '/dashboard', color: 'from-cyan-500 to-cyan-600' },
  { label: 'Run Experiments', href: '/chaos', color: 'from-orange-500 to-orange-600' },
  { label: 'Check Metrics', href: '/metrics', color: 'from-purple-500 to-purple-600' },
];

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-500/50 transition"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-orange-500/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          {/* Main Title */}
          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Open Reliability Lab
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Observability • Chaos Engineering • Microservices Reliability
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Master microservices resilience with our comprehensive platform. Monitor real-time
            health, run chaos experiments, and gain deep insights into your system's behavior.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {ctaButtons.map((btn, idx) => (
              <motion.div
                key={btn.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={btn.href}
                  className={`px-8 py-4 rounded-lg font-semibold text-white bg-gradient-to-r ${btn.color} hover:shadow-lg transition transform inline-block`}
                >
                  {btn.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-slate-400 text-sm">Scroll to explore</div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-slate-400 text-lg">Everything you need to build reliable systems</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Services', value: '5+' },
              { label: 'Metrics', value: '100+' },
              { label: 'Real-time', value: '24/7' },
              { label: 'Uptime', value: '99.9%' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center text-slate-400">
        <p>Open Reliability Lab • Built for learning microservices reliability</p>
      </footer>
    </div>
  );
}
