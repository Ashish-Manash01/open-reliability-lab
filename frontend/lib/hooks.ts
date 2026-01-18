import { useEffect, useState } from 'react';
import { HEALTH_CONFIG, HEALTH_ENDPOINTS, API_CONFIG } from './config';
import { apiClient } from './api-client';

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  latencyMs: number;
  checkedAt: number;
}

export function useServiceHealth(healthEndpoint: keyof typeof HEALTH_ENDPOINTS) {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'DOWN',
    latencyMs: 0,
    checkedAt: Date.now(),
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      setIsLoading(true);
      const start = performance.now();

      try {
        const healthUrl = HEALTH_ENDPOINTS[healthEndpoint];
        // Remove the base URL to get just the path
        const path = healthUrl.replace(API_CONFIG.baseURL, '');
        const response = await apiClient.get<{ status: string }>(path);

        const latencyMs = Math.round(performance.now() - start);

        if (response.status === 200 && response.data?.status === 'UP') {
          setHealth({
            status: 'UP',
            latencyMs,
            checkedAt: Date.now(),
          });
        } else {
          setHealth({
            status: 'DOWN',
            latencyMs,
            checkedAt: Date.now(),
          });
        }
      } catch {
        const latencyMs = Math.round(performance.now() - start);
        setHealth({
          status: 'DOWN',
          latencyMs,
          checkedAt: Date.now(),
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();

    const interval = setInterval(checkHealth, HEALTH_CONFIG.refreshInterval);
    return () => clearInterval(interval);
  }, [healthEndpoint]);

  return { health, isLoading };
}
