'use client';

import { motion } from 'framer-motion';
import HealthCard from '@/components/HealthCard';
import { SERVICE_INFO, HEALTH_ENDPOINTS } from '@/lib/config';

const services = [
  {
    name: SERVICE_INFO.apiGateway.name,
    endpoint: 'apiGateway' as const,
    icon: SERVICE_INFO.apiGateway.icon,
    port: SERVICE_INFO.apiGateway.port,
  },
  {
    name: SERVICE_INFO.authService.name,
    endpoint: 'authService' as const,
    icon: SERVICE_INFO.authService.icon,
    port: SERVICE_INFO.authService.port,
  },
  {
    name: SERVICE_INFO.orderService.name,
    endpoint: 'orderService' as const,
    icon: SERVICE_INFO.orderService.icon,
    port: SERVICE_INFO.orderService.port,
  },
  {
    name: SERVICE_INFO.paymentService.name,
    endpoint: 'paymentService' as const,
    icon: SERVICE_INFO.paymentService.icon,
    port: SERVICE_INFO.paymentService.port,
  },
  {
    name: SERVICE_INFO.chaosService.name,
    endpoint: 'chaosService' as const,
    icon: SERVICE_INFO.chaosService.icon,
    port: SERVICE_INFO.chaosService.port,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">System Dashboard</h1>
          <p className="text-slate-400 text-lg">
            Real-time service health monitoring and latency tracking
          </p>
        </motion.div>

        {/* Health Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {services.map((service) => (
            <HealthCard
              key={service.name}
              serviceName={service.name}
              healthEndpoint={service.endpoint}
              icon={service.icon}
            />
          ))}
        </motion.div>

        {/* Info Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Architecture Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Service Architecture</h2>
            <div className="space-y-3 text-slate-300">
              <p>
                <span className="font-semibold text-cyan-400">API Gateway</span> (8080) - Main entry point,
                forwards requests to all microservices
              </p>
              <p>
                <span className="font-semibold text-cyan-400">Auth Service</span> (8081) - Authentication
                and authorization service
              </p>
              <p>
                <span className="font-semibold text-cyan-400">Order Service</span> (8003) - Handles order
                processing
              </p>
              <p>
                <span className="font-semibold text-cyan-400">Payment Service</span> (8004) - Processes
                payments
              </p>
              <p>
                <span className="font-semibold text-cyan-400">Chaos Service</span> (8005) - Injects failures
                for chaos experiments
              </p>
            </div>
          </motion.div>

          {/* Health Indicators Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm"
          >
            <h2 className="text-2xl font-bold text-white mb-4">How to Read Health Status</h2>
            <div className="space-y-4 text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600" />
                <div>
                  <p className="font-semibold text-green-400">UP</p>
                  <p className="text-sm">Service is running and responding normally</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-rose-600" />
                <div>
                  <p className="font-semibold text-red-400">DOWN</p>
                  <p className="text-sm">Service is unavailable or not responding</p>
                </div>
              </div>
              <div className="pt-4 text-sm text-slate-400">
                <p>Each card checks every 5 seconds and displays latency in milliseconds</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-6">External Services</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Prometheus Metrics', url: 'http://localhost:9090', icon: '📊' },
              { label: 'Grafana Dashboards', url: 'http://localhost:3000', icon: '📈' },
              { label: 'Service Logs', url: '#', icon: '📝' },
            ].map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-cyan-500/50 transition text-center"
              >
                <div className="text-2xl mb-2">{link.icon}</div>
                <p className="text-white font-medium">{link.label}</p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
