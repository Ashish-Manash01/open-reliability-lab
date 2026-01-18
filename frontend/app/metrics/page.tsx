'use client';

import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data - structure matches Prometheus metrics style
const latencyData = [
  { time: '00:00', apiGateway: 45, auth: 32, order: 58, payment: 42, chaos: 95 },
  { time: '01:00', apiGateway: 52, auth: 38, order: 62, payment: 48, chaos: 88 },
  { time: '02:00', apiGateway: 48, auth: 35, order: 55, payment: 45, chaos: 92 },
  { time: '03:00', apiGateway: 55, auth: 42, order: 65, payment: 52, chaos: 98 },
  { time: '04:00', apiGateway: 50, auth: 38, order: 60, payment: 50, chaos: 90 },
  { time: '05:00', apiGateway: 58, auth: 45, order: 70, payment: 58, chaos: 105 },
  { time: '06:00', apiGateway: 62, auth: 48, order: 75, payment: 62, chaos: 110 },
];

const throughputData = [
  { time: '00:00', requests: 1200, errors: 45 },
  { time: '01:00', requests: 1400, errors: 52 },
  { time: '02:00', requests: 1100, errors: 38 },
  { time: '03:00', requests: 1600, errors: 68 },
  { time: '04:00', requests: 1300, errors: 48 },
  { time: '05:00', requests: 1800, errors: 75 },
  { time: '06:00', requests: 2100, errors: 92 },
];

const errorRateData = [
  { time: '00:00', 'Auth Service': 2.1, 'Order Service': 3.5, 'Payment Service': 1.2 },
  { time: '01:00', 'Auth Service': 2.4, 'Order Service': 3.8, 'Payment Service': 1.5 },
  { time: '02:00', 'Auth Service': 1.8, 'Order Service': 3.2, 'Payment Service': 1.0 },
  { time: '03:00', 'Auth Service': 3.2, 'Order Service': 4.5, 'Payment Service': 1.8 },
  { time: '04:00', 'Auth Service': 2.2, 'Order Service': 3.5, 'Payment Service': 1.2 },
  { time: '05:00', 'Auth Service': 3.5, 'Order Service': 5.2, 'Payment Service': 2.1 },
  { time: '06:00', 'Auth Service': 4.1, 'Order Service': 6.0, 'Payment Service': 2.5 },
];

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm"
  >
    <h3 className="text-xl font-semibold text-white mb-6">{title}</h3>
    {children}
  </motion.div>
);

export default function Metrics() {
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
          <h1 className="text-5xl font-bold text-white mb-4">Metrics & Performance</h1>
          <p className="text-slate-400 text-lg">
            Historical performance data from Prometheus integration
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: 'Avg Latency', value: '54ms', change: '+2.3%' },
            { label: 'Total Requests', value: '9,600', change: '+12.5%' },
            { label: 'Error Rate', value: '2.8%', change: '-0.5%' },
            { label: 'Uptime', value: '99.95%', change: 'Stable' },
          ].map((metric) => (
            <motion.div
              key={metric.label}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6"
            >
              <p className="text-slate-400 text-sm mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-cyan-400 mb-2">{metric.value}</p>
              <p className={metric.change.includes('+') ? 'text-red-400 text-sm' : 'text-green-400 text-sm'}>
                {metric.change}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Latency Over Time */}
          <ChartCard title="Service Latency (P95)">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.1)" />
                <XAxis dataKey="time" stroke="rgba(226, 232, 240, 0.5)" />
                <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="apiGateway" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="auth" stroke="#10b981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="order" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="payment" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Throughput */}
          <ChartCard title="Request Throughput">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={throughputData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.1)" />
                <XAxis dataKey="time" stroke="rgba(226, 232, 240, 0.5)" />
                <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: 'requests/min', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(226, 232, 240, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="requests" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.1)" />
                <Area type="monotone" dataKey="errors" stroke="#ef4444" fill="rgba(239, 68, 68, 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Error Rate */}
        <ChartCard title="Error Rate by Service">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={errorRateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(226, 232, 240, 0.1)" />
              <XAxis dataKey="time" stroke="rgba(226, 232, 240, 0.5)" />
              <YAxis stroke="rgba(226, 232, 240, 0.5)" label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(226, 232, 240, 0.2)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="Auth Service" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Order Service" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Payment Service" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm"
        >
          <h2 className="text-xl font-bold text-white mb-4">📊 Data Source</h2>
          <p className="text-slate-400 mb-4">
            All metrics are pulled from <span className="text-cyan-400">Prometheus</span> at{' '}
            <span className="font-mono">http://localhost:9090</span>
          </p>
          <p className="text-slate-400">
            Current data shown is simulated. To connect real metrics, configure the Prometheus data source in your
            environment.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
