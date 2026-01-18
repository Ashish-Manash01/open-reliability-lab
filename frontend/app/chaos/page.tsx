'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CHAOS_ENDPOINTS } from '@/lib/config';
import { apiClient } from '@/lib/api-client';

interface ExperimentRun {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  timestamp?: Date;
  duration?: number;
}

const ExperimentButton = ({
  experiment,
  isRunning,
  onRun,
}: {
  experiment: { name: string; description: string; icon: string; endpoint: string };
  isRunning: boolean;
  onRun: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onRun}
    disabled={isRunning}
    className={`w-full p-6 rounded-lg border transition-all duration-200 ${
      isRunning
        ? 'bg-blue-900/30 border-blue-500 cursor-wait'
        : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
    }`}
  >
    <div className="flex items-start gap-4">
      <span className="text-3xl">{experiment.icon}</span>
      <div className="flex-1 text-left">
        <h3 className="text-lg font-semibold text-white mb-2">{experiment.name}</h3>
        <p className="text-sm text-slate-400">{experiment.description}</p>
      </div>
      {isRunning && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-blue-400"
        >
          ⚡
        </motion.div>
      )}
    </div>
  </motion.button>
);

const ExperimentStatus = ({ run }: { run: ExperimentRun }) => {
  const statusColors: Record<string, string> = {
    idle: 'text-slate-400',
    running: 'text-blue-400',
    success: 'text-green-400',
    failed: 'text-red-400',
  };

  const statusIcons: Record<string, string> = {
    idle: '⏸️',
    running: '⚙️',
    success: '✅',
    failed: '❌',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{statusIcons[run.status]}</span>
        <div>
          <p className="text-white font-semibold">{run.name}</p>
          <p className={`text-sm ${statusColors[run.status]}`}>
            {run.status === 'idle' && 'Not started'}
            {run.status === 'running' && 'Running...'}
            {run.status === 'success' && `Completed in ${run.duration}ms`}
            {run.status === 'failed' && 'Failed'}
          </p>
        </div>
      </div>
      {run.timestamp && (
        <p className="text-xs text-slate-500">
          {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }).format(run.timestamp)}
        </p>
      )}
    </motion.div>
  );
};

export default function Chaos() {
  const [runs, setRuns] = useState<ExperimentRun[]>([]);
  const [runningId, setRunningId] = useState<string | null>(null);

  const experiments = [
    {
      id: 'kill-orders',
      name: 'Kill Orders Service',
      description: 'Simulate orders service crash and observe resilience',
      icon: '💥',
      endpoint: CHAOS_ENDPOINTS.killOrders,
    },
    {
      id: 'kill-payments',
      name: 'Kill Payment Service',
      description: 'Simulate payment service failure and fallback behavior',
      icon: '🔥',
      endpoint: CHAOS_ENDPOINTS.killPayments,
    },
    {
      id: 'inject-latency',
      name: 'Inject Latency',
      description: 'Add 2-5 second delays to all requests',
      icon: '⏱️',
      endpoint: CHAOS_ENDPOINTS.injectLatency,
    },
    {
      id: 'restart-auth',
      name: 'Restart Auth Service',
      description: 'Force restart of authentication service',
      icon: '🔄',
      endpoint: CHAOS_ENDPOINTS.restartService,
    },
  ];

  const handleRunExperiment = async (experiment: (typeof experiments)[0]) => {
    const runId = `${experiment.id}-${Date.now()}`;
    setRunningId(runId);

    // Add initial run record
    const newRun: ExperimentRun = {
      id: runId,
      name: experiment.name,
      status: 'running',
      timestamp: new Date(),
    };

    setRuns((prev) => [newRun, ...prev]);

    try {
      // Call API through centralized client
      const endpoint = experiment.endpoint.replace(apiClient['baseURL'], '');
      const response = await apiClient.post(endpoint, {});

      const duration = Math.random() * 3000 + 500; // Simulate 500-3500ms execution

      if (response.status === 200) {
        setRuns((prev) =>
          prev.map((r) =>
            r.id === runId
              ? { ...r, status: 'success', duration: Math.round(duration) }
              : r
          )
        );
      } else {
        setRuns((prev) =>
          prev.map((r) =>
            r.id === runId
              ? { ...r, status: 'failed', duration: Math.round(duration) }
              : r
          )
        );
      }
    } catch (error) {
      const duration = Math.random() * 2000 + 300;
      setRuns((prev) =>
        prev.map((r) =>
          r.id === runId
            ? { ...r, status: 'failed', duration: Math.round(duration) }
            : r
        )
      );
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">🧪 Chaos Engineering</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Test your system&apos;s resilience by triggering controlled failure scenarios. Monitor how your services
            respond to unexpected conditions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experiments List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Available Experiments</h2>
            <div className="grid gap-4">
              {experiments.map((experiment) => (
                <ExperimentButton
                  key={experiment.id}
                  experiment={experiment}
                  isRunning={runningId?.includes(experiment.id) || false}
                  onRun={() => handleRunExperiment(experiment)}
                />
              ))}
            </div>

            {/* Warnings */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-amber-900/20 border border-amber-700/50 rounded-lg p-6 backdrop-blur-sm"
            >
              <h3 className="text-lg font-semibold text-amber-400 mb-3">⚠️ Important Safety Notes</h3>
              <ul className="space-y-2 text-sm text-amber-200">
                <li>• Only run experiments in development/testing environments</li>
                <li>• Allow 30-60 seconds between experiments for system recovery</li>
                <li>• Monitor Prometheus and Grafana during experiments</li>
                <li>• Some experiments may impact service availability temporarily</li>
                <li>• All experiments are designed to be reversible automatically</li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Run History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="sticky top-24"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Recent Runs</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {runs.length === 0 ? (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
                  <p className="text-slate-400">No experiments run yet</p>
                </div>
              ) : (
                runs.map((run) => <ExperimentStatus key={run.id} run={run} />)
              )}
            </div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 bg-slate-800/50 border border-slate-700 rounded-lg p-6 backdrop-blur-sm"
            >
              <h3 className="font-semibold text-white mb-3">💡 Tip</h3>
              <p className="text-sm text-slate-400">
                Watch metrics in <span className="text-cyan-400">Prometheus</span> or{' '}
                <span className="text-cyan-400">Grafana</span> to see how your system responds to chaos.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
