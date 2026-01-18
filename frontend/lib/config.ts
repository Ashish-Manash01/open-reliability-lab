// API Configuration - All requests go through API Gateway
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL || 'http://localhost:8080',
  timeout: 5000,
  retries: 2,
} as const;

// Service health endpoints - All routed through API Gateway
export const HEALTH_ENDPOINTS = {
  apiGateway: `${API_CONFIG.baseURL}/actuator/health`,
  authService: `${API_CONFIG.baseURL}/auth/actuator/health`,
  orderService: `${API_CONFIG.baseURL}/orders/actuator/health`,
  paymentService: `${API_CONFIG.baseURL}/payments/actuator/health`,
  chaosService: `${API_CONFIG.baseURL}/chaos/actuator/health`,
} as const;

// Service information for display (non-functional)
export const SERVICE_INFO = {
  apiGateway: { name: 'API Gateway', port: '8080', icon: '🚪' },
  authService: { name: 'Auth Service', port: '8081', icon: '🔐' },
  orderService: { name: 'Order Service', port: '8003', icon: '📦' },
  paymentService: { name: 'Payment Service', port: '8004', icon: '💳' },
  chaosService: { name: 'Chaos Service', port: '8005', icon: '⚡' },
} as const;

// Health check configuration
export const HEALTH_CONFIG = {
  timeout: 3000,
  refreshInterval: 5000,
} as const;

// Chaos experiment endpoints
export const CHAOS_ENDPOINTS = {
  killOrders: `${API_CONFIG.baseURL}/chaos/kill/orders`,
  killPayments: `${API_CONFIG.baseURL}/chaos/kill/payments`,
  injectLatency: `${API_CONFIG.baseURL}/chaos/latency`,
  restartService: `${API_CONFIG.baseURL}/chaos/restart`,
} as const;
