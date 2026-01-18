# Open Reliability Lab - Frontend

Professional observability and chaos engineering UI built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 🎯 Overview

This is a modern, responsive frontend application for monitoring microservices health, visualizing performance metrics, and running chaos engineering experiments. It connects to a Spring Boot microservices backend via REST APIs.

## 🚀 Features

- **Real-time Service Health Monitoring** - Live status checks for all microservices
- **Performance Metrics Dashboard** - Charts for latency, throughput, and error rates using Recharts
- **Chaos Engineering UI** - Trigger and monitor chaos experiments
- **Professional Dark Theme** - Tailored for long monitoring sessions
- **Responsive Design** - Mobile-friendly with desktop optimization
- **Smooth Animations** - Framer Motion for delightful UX
- **Retry Logic** - Resilient API client with automatic retries

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout with Navbar
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles and animations
│   ├── dashboard/
│   │   └── page.tsx             # Service health dashboard
│   ├── metrics/
│   │   └── page.tsx             # Performance metrics charts
│   └── chaos/
│       └── page.tsx             # Chaos experiments page
├── components/                   # Reusable components
│   ├── Navbar.tsx               # Navigation bar
│   └── HealthCard.tsx           # Service health status card
├── lib/                         # Utilities and helpers
│   ├── config.ts               # API configuration and endpoints
│   ├── api-client.ts           # HTTP client with retry logic
│   └── hooks.ts                # Custom React hooks
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 14+ |
| **Language** | TypeScript | 5+ |
| **UI Framework** | React | 19+ |
| **Styling** | Tailwind CSS | 4+ |
| **Animations** | Framer Motion | 11+ |
| **Charts** | Recharts | 2.12+ |
| **HTTP Client** | Fetch API | Native |

## 🔧 Setup & Installation

### Prerequisites

- Node.js 18+ or npm 9+
- Backend services running (see main README)

### Installation Steps

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at **http://localhost:3000**

### Environment Variables

Create a `.env.local` file (optional):

```env
# API Gateway URL (defaults to http://localhost:8080)
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
```

## 📄 Pages

### 🏠 Landing Page (`/`)

Professional landing page with:
- Hero section with CTA buttons
- Feature highlights
- Key statistics cards
- Footer with links

**Route:** `/`

### 📊 Dashboard (`/dashboard`)

Real-time service monitoring with:
- Health status cards for all 5 microservices
- Color-coded status (🟢 UP, 🔴 DOWN)
- Live latency metrics
- Service architecture information
- Health indicator legend
- Quick links to Prometheus & Grafana

**Route:** `/dashboard`

**Features:**
- Auto-refreshes every 5 seconds
- Real-time latency display
- Service dependency information
- Architecture documentation

### 📈 Metrics (`/metrics`)

Performance analytics with Recharts visualizations:
- **Latency Chart** - Service latency over time (P95 percentile)
- **Throughput Chart** - Request volume and error counts
- **Error Rate Chart** - Error percentage by service
- **Key Metrics** - Average latency, total requests, error rate, uptime

**Route:** `/metrics`

**Data Source:** Prometheus (configured at http://localhost:9090)

### 🧪 Chaos (`/chaos`)

Chaos engineering experiment runner:
- **Kill Orders** - Simulate orders service failure
- **Kill Payment** - Simulate payment service failure
- **Inject Latency** - Add 2-5s delays to requests
- **Restart Auth** - Force restart of auth service
- **Run History** - Track experiment executions with status and duration

**Route:** `/chaos`

**Features:**
- Click to run experiments
- Real-time execution status
- Duration tracking
- Success/failure indicators
- Safety warnings

## 🧩 Components

### `Navbar`

Global navigation component with:
- Links to Dashboard, Metrics, Chaos
- External link to Prometheus
- Responsive design
- Framer Motion animations

```typescript
// Usage: Automatically included in root layout
import Navbar from '@/components/Navbar';
```

### `HealthCard`

Reusable health status card for services:
- Real-time health polling
- Color-coded status
- Latency display
- Pulsing animation for healthy services

```typescript
import HealthCard from '@/components/HealthCard';

<HealthCard 
  serviceName="Order Service"
  healthUrl="http://localhost:8003/actuator/health"
  icon="📦"
/>
```

## 🔌 API Client

### Configuration (`lib/config.ts`)

Centralized configuration for all API endpoints:

```typescript
export const API_CONFIG = {
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  retries: 2,
};

export const SERVICES = {
  apiGateway: 'http://localhost:8080',
  authService: 'http://localhost:8081',
  orderService: 'http://localhost:8003',
  paymentService: 'http://localhost:8004',
  chaosService: 'http://localhost:8005',
};

export const CHAOS_ENDPOINTS = {
  killOrders: 'http://localhost:8080/chaos/kill/orders',
  killPayments: 'http://localhost:8080/chaos/kill/payments',
  injectLatency: 'http://localhost:8080/chaos/latency',
  restartService: 'http://localhost:8080/chaos/restart',
};
```

### API Client (`lib/api-client.ts`)

Reusable HTTP client with automatic retries and timeout handling:

```typescript
import { ApiClient } from '@/lib/api-client';

const client = new ApiClient();

// GET request
const response = await client.get<HealthStatus>(
  'http://localhost:8080/actuator/health'
);

if (response.status === 200) {
  console.log(response.data);
}

// POST request
const result = await client.post(
  'http://localhost:8080/chaos/kill/orders',
  {}
);
```

**Features:**
- Automatic retry logic (configurable attempts)
- Request timeout handling (5s default)
- Typed responses with generic `<T>`
- Error handling with detailed messages
- Timestamp tracking

### Custom Hooks (`lib/hooks.ts`)

#### `useServiceHealth`

Monitor service health with automatic polling:

```typescript
import { useServiceHealth } from '@/lib/hooks';

function MyComponent() {
  const { health, isLoading } = useServiceHealth(
    'http://localhost:8003/actuator/health'
  );

  return (
    <div>
      <p>Status: {health?.status}</p>
      <p>Latency: {health?.latencyMs}ms</p>
    </div>
  );
}
```

**Returns:**
- `health` - Current health status with `status`, `latencyMs`, `checkedAt`
- `isLoading` - Boolean indicating if health check is in progress

**Behavior:**
- Auto-refreshes every 5 seconds
- Cleanup on unmount
- Error handling built-in

## 🎨 Styling & Theming

### Color Palette

```css
--background: #0f172a      /* Dark slate background */
--foreground: #f1f5f9      /* Light text */
--accent-cyan: #06b6d4     /* Primary accent */
--accent-green: #10b981    /* Success/UP status */
--accent-amber: #f59e0b    /* Warning */
--accent-purple: #8b5cf6   /* Accent color */
```

### Custom Classes

```css
.gradient-text      /* Gradient text effect */
.gradient-border    /* Gradient border effect */
.glass              /* Glass morphism effect */
.glow               /* Glowing text animation */
.float              /* Floating animation */
```

## 📦 Build & Deployment

### Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
```

### Production Build

```bash
npm run build        # Build optimized bundle
npm run start        # Start production server
```

### Docker

See main README for Docker deployment instructions.

## 🔗 API Integration

The frontend expects the following backend services running:

| Service | Port | Health Endpoint |
|---------|------|-----------------|
| API Gateway | 8080 | `/actuator/health` |
| Auth Service | 8081 | `/actuator/health` |
| Order Service | 8003 | `/actuator/health` |
| Payment Service | 8004 | `/actuator/health` |
| Chaos Service | 8005 | `/actuator/health` |

### Health Check Format

Expected response from `/actuator/health`:

```json
{
  "status": "UP"
}
```

### Prometheus Integration

- **URL:** http://localhost:9090
- **Query:** Prometheus metrics API at `/api/v1/query`
- **Grafana:** http://localhost:3000

## 📊 Monitoring

### Prometheus Metrics

The backend services expose metrics at:
- `http://localhost:8080/actuator/prometheus` (via API Gateway)
- Individual service metrics endpoints

**Scrape interval:** 15 seconds (configurable)

### Grafana

Access pre-configured dashboards:
- **URL:** http://localhost:3000
- **Default credentials:** admin / admin

## 🚨 Error Handling

### Automatic Retry Logic

The API client automatically retries failed requests:
- **Max Retries:** 2 (configurable)
- **Retry Delay:** Exponential backoff
- **Timeout:** 5 seconds per request

### Error Display

Errors are displayed to users with:
- Service status indicators
- Connection error messages
- Timeout notifications
- Fallback UI states

## 🧪 Testing

```bash
# Run linting
npm run lint

# Type checking
tsc --noEmit
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts Documentation](https://recharts.org)

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use components from `lib/` for API calls
3. Keep configuration in `lib/config.ts`
4. Use Framer Motion for animations
5. Maintain dark theme consistency

## 📝 License

See main repository LICENSE file.

---

**Built with ❤️ for the Open Reliability Lab**
