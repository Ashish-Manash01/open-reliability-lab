'use client';

import { useServiceHealth, HealthStatus } from '@/lib/hooks';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface HealthCardProps {
  serviceName: string;
  healthEndpoint: 'apiGateway' | 'authService' | 'orderService' | 'paymentService' | 'chaosService';
  icon?: ReactNode;
}

export default function HealthCard({ serviceName, healthEndpoint, icon }: HealthCardProps) {
  const { health, isLoading } = useServiceHealth(healthEndpoint);

  const isHealthy = health.status === 'UP';
  const statusColor = isHealthy ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
  const textColor = isHealthy ? 'text-green-400' : 'text-red-400';
  const borderColor = isHealthy ? 'border-green-500/30' : 'border-red-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-slate-800 border ${borderColor} rounded-lg p-6 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-2xl">{icon}</div>}
          <h3 className="text-lg font-semibold text-white">{serviceName}</h3>
        </div>

        {/* Status Indicator */}
        <motion.div
          animate={{ scale: isHealthy ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 2, repeat: isHealthy ? Infinity : 0 }}
          className={`w-3 h-3 rounded-full bg-gradient-to-br ${statusColor}`}
        />
      </div>

      {/* Status & Latency */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Status:</span>
          <motion.span
            key={health.status}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-semibold ${textColor}`}
          >
            {isLoading ? 'Checking...' : health.status}
          </motion.span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-400">Latency:</span>
          <span className="text-slate-200 font-mono">
            {isLoading ? '-' : `${health.latencyMs}ms`}
          </span>
        </div>

        <div className="text-xs text-slate-500 pt-2">
          Last checked: {new Date(health.checkedAt).toLocaleTimeString()}
        </div>
      </div>

      {/* Pulse animation for healthy services */}
      {isHealthy && (
        <motion.div
          className="mt-4 h-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
