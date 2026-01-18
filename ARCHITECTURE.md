# 🏗️ Open Reliability Lab - Architecture & Component Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                    USER BROWSER (Frontend)                      │
│                    http://localhost:3000                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 14 Application (React + TypeScript)             │  │
│  │                                                          │  │
│  │  Routes:                                                 │  │
│  │  ├─ / (Landing Page) [Hero + Features + Stats]         │  │
│  │  ├─ /dashboard (Health Dashboard) [5 Service Cards]    │  │
│  │  ├─ /metrics (Performance Charts) [Latency/Throughput] │  │
│  │  └─ /chaos (Chaos Engineering) [Experiment Buttons]    │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└───────────────────────────────────────────────────────────────┬─┘
                                                                 │
                          HTTP/REST API
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              BACKEND - Java 21 Microservices                   │
│              (Docker Compose)                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ API GATEWAY (Port 8080)                                 │  │
│  │ ├─ /actuator/health → Service Health                   │  │
│  │ ├─ /actuator/prometheus → Prometheus Metrics           │  │
│  │ ├─ /chaos/* → Chaos Experiments                        │  │
│  │ ├─ /auth/* → Route to Auth Service                     │  │
│  │ ├─ /orders/* → Route to Order Service                  │  │
│  │ └─ /payments/* → Route to Payment Service              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────┬──────────────────┬─────────────────┐    │
│  │                  │                  │                 │    │
│  ▼                  ▼                  ▼                 ▼    │
│                                                                 │
│ AUTH SERVICE     ORDER SERVICE    PAYMENT SERVICE  CHAOS       │
│ (Port 8081)      (Port 8003)      (Port 8004)      SERVICE    │
│                                                   (Port 8005)  │
│ Spring Boot 3.2  Spring Boot 3.2  Spring Boot 3.2  Spring Boot│
│ Java 21          Java 21          Java 21          Java 21    │
│                                                                 │
│ Endpoints:       Endpoints:       Endpoints:       Endpoints: │
│ • /auth/login    • /orders        • /payments      • /experiments
│ • /auth/verify   • /health        • /health        • /restart
│ • /health        • /metrics       • /metrics       • /latency
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
           │                                              │
           │                                              │
           └──────────────────┬─────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│            OBSERVABILITY STACK                                 │
│                                                                 │
│  ┌──────────────────────┐        ┌────────────────────┐       │
│  │ PROMETHEUS (9090)    │        │ GRAFANA (3000)     │       │
│  │                      │        │                    │       │
│  │ • Metrics Scrape     │        │ • Pre-built        │       │
│  │ • Time Series DB     │        │ • Dashboards       │       │
│  │ • Query API          │        │ • Alerting         │       │
│  │ • Data Retention     │        │ • Visualization    │       │
│  │ • ServiceMonitor     │        │                    │       │
│  │ • Exporters          │        │ Default: admin/    │       │
│  │                      │        │ admin              │       │
│  └──────────────────────┘        └────────────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Frontend Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     NEXT.JS APP STRUCTURE                       │
└─────────────────────────────────────────────────────────────────┘

app/
├── layout.tsx               [Root Layout]
│   └── Navbar ────────────> [Global Navigation]
│
├── page.tsx                 [Landing Page]
│   ├── Hero Section (Gradient + CTA)
│   ├── Features (3 cards)
│   ├── Statistics (4 cards)
│   └── Footer
│
├── dashboard/page.tsx       [Health Dashboard]
│   ├── Header
│   ├── HealthCard (x5)
│   │   └── useServiceHealth Hook ─┐
│   ├── Architecture Info         │
│   ├── Health Legend             │
│   └── External Links            │
│                                  │
├── metrics/page.tsx         [Performance Metrics]        │
│   ├── Key Metrics Cards          │
│   ├── Latency Chart (Recharts)   │
│   ├── Throughput Chart           │
│   ├── Error Rate Chart           │
│   └── Data Source Info           │
│                                  │
└── chaos/page.tsx           [Chaos Engineering]         │
    ├── Experiment Buttons (x4)    │
    ├── Run History Panel          │
    ├── Live Status Updates        │
    └── Safety Warnings            │
         │
         └─── API Calls via ApiClient
         │
         └─── Uses config.ts for endpoints


components/
├── Navbar.tsx               [Navigation Bar]
│   └── Navigation Links + Prometheus Button
│
└── HealthCard.tsx           [Service Health Card]
    └── Uses useServiceHealth Hook


lib/
├── config.ts                [API Configuration]
│   ├── API_CONFIG (timeout, retries)
│   ├── SERVICES (port mapping)
│   ├── HEALTH_CONFIG (polling)
│   └── CHAOS_ENDPOINTS
│
├── api-client.ts            [HTTP Client]
│   ├── ApiClient class
│   ├── get<T>()
│   ├── post<T>()
│   ├── put<T>()
│   └── delete<T>()
│
└── hooks.ts                 [Custom Hooks]
    └── useServiceHealth(url)
        ├── Auto-polling every 5s
        ├── Error handling
        └── Returns: {health, isLoading}
```

---

## Data Flow Diagram

### Health Check Flow

```
┌─────────────┐
│  Browser    │
│  User opens │
│ /dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  HealthCard Component Mounts        │
│  • Calls useServiceHealth(url)      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  useServiceHealth Hook              │
│  • Starts setInterval (5s)          │
│  • Calls ApiClient.get()            │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  ApiClient.get()                    │
│  • fetch with AbortController       │
│  • Timeout: 3000ms                  │
│  • Retry logic (max 2)              │
│  • Measures latency                 │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Backend: /actuator/health          │
│  Returns: {status: "UP" or "DOWN"}  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Response ──→ HealthStatus          │
│  • status: 'UP' | 'DOWN'            │
│  • latencyMs: number                │
│  • checkedAt: timestamp             │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Component Re-render                │
│  • Show status (green/red)          │
│  • Display latency                  │
│  • Update timestamp                 │
│  • Trigger animation (pulse/fade)   │
└─────────────────────────────────────┘
```

### Chaos Experiment Flow

```
┌──────────────────────┐
│  User clicks button  │
│  "Kill Orders"       │
└─────────┬────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  handleRunExperiment()               │
│  • Create ExperimentRun record       │
│  • Set status: "running"             │
│  • Add to runs state                 │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  fetch POST                          │
│  URL: http://localhost:8080/chaos/   │
│       kill/orders                    │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Backend API Gateway                 │
│  Processes chaos experiment          │
│  Returns: 200 OK or error            │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Update ExperimentRun                │
│  • Set status: "success" / "failed"  │
│  • Calculate duration                │
│  • Timestamp the result              │
│  • Update runs state                 │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  ExperimentStatus Component          │
│  • Show status icon (✅/❌)          │
│  • Display duration                  │
│  • Show timestamp                    │
│  • Animate appearance                │
└──────────────────────────────────────┘
```

---

## Service Communication Map

```
Frontend (localhost:3000)
    │
    ├─→ Health Check: /actuator/health
    │   ├─→ API Gateway (8080) [Primary]
    │   │   └─→ Returns: {status: "UP" | "DOWN"}
    │   │
    │   └─→ Individual Services (via Gateway)
    │       ├─→ Auth (8081/actuator/health)
    │       ├─→ Order (8003/actuator/health)
    │       ├─→ Payment (8004/actuator/health)
    │       └─→ Chaos (8005/actuator/health)
    │
    └─→ Chaos Experiments: /chaos/*
        ├─→ POST /chaos/kill/orders
        ├─→ POST /chaos/kill/payments
        ├─→ POST /chaos/latency
        └─→ POST /chaos/restart

Monitoring Stack
    │
    ├─→ Prometheus (9090)
    │   └─→ Scrapes: /actuator/prometheus (every 15s)
    │       From: All services
    │
    └─→ Grafana (3000)
        └─→ Queries Prometheus
            └─→ Displays dashboards
```

---

## Technology Stack Relationship

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend Stack                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─── Next.js 14 ─────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  ┌─── React 19 ─────────────────────────────────────┐ │ │
│  │  │                                                 │ │ │
│  │  │  ┌─── TypeScript 5 ──────────────────────────┐ │ │ │
│  │  │  │ (Type Safety & IntelliSense)             │ │ │ │
│  │  │  │                                           │ │ │ │
│  │  │  │  Components                              │ │ │ │
│  │  │  │  ├─ Navbar (Framer Motion)              │ │ │ │
│  │  │  │  ├─ HealthCard (useServiceHealth)       │ │ │ │
│  │  │  │  └─ Pages                               │ │ │ │
│  │  │  │     ├─ Landing (CTA Cards)              │ │ │ │
│  │  │  │     ├─ Dashboard (Health Grid)          │ │ │ │
│  │  │  │     ├─ Metrics (Recharts)               │ │ │ │
│  │  │  │     └─ Chaos (Experiment Controller)    │ │ │ │
│  │  │  │                                           │ │ │ │
│  │  │  │  Utilities                               │ │ │ │
│  │  │  │  ├─ config.ts (Endpoints)               │ │ │ │
│  │  │  │  ├─ api-client.ts (HTTP Client)         │ │ │ │
│  │  │  │  └─ hooks.ts (useServiceHealth)         │ │ │ │
│  │  │  │                                           │ │ │ │
│  │  │  └───────────────────────────────────────── │ │ │
│  │  │                                              │ │ │
│  │  │  ┌─── Styling ─────────────────────────────┐ │ │
│  │  │  │                                         │ │ │
│  │  │  │ Tailwind CSS 4 + Custom CSS            │ │ │
│  │  │  │ • Color Variables                      │ │ │
│  │  │  │ • Animations (@keyframes)              │ │ │
│  │  │  │ • Responsive Grid System               │ │ │
│  │  │  │ • Glass Effect / Gradient              │ │ │
│  │  │  │                                         │ │ │
│  │  │  └─────────────────────────────────────── │ │ │
│  │  │                                              │ │ │
│  │  │  ┌─── External Libraries ──────────────────┐ │ │
│  │  │  │                                         │ │ │
│  │  │  │ • Framer Motion 11 (Animations)        │ │ │
│  │  │  │ • Recharts 2.12 (Charts)               │ │ │
│  │  │  │ • Fetch API (HTTP Client)              │ │ │
│  │  │  │                                         │ │ │
│  │  │  └─────────────────────────────────────── │ │ │
│  │  │                                             │ │
│  │  └────────────────────────────────────────────── │
│  │                                                │
│  └──────────────────────────────────────────────── │
│                                                    │
│  ┌─ Build & Deployment ─────────────────────────┐ │
│  │                                              │ │
│  │ • npm run dev (Development)                  │ │
│  │ • npm run build (Production Build)           │ │
│  │ • npm run start (Production Server)          │ │
│  │ • Docker Ready (Alpine Node 18+)             │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## State Management

### Component State

```
Dashboard Page
├── Health Cards (via useServiceHealth hook)
│   └── Local state: health, isLoading
│       └── Polling: 5s interval
│
Chaos Page
├── Runs state: ExperimentRun[]
│   ├── Populated on experiment trigger
│   ├── Updated on completion
│   └── Displayed in history panel
│
Landing Page
├── No state (static content)
│
Metrics Page
├── Mock data (hardcoded)
│   └── Ready for API integration
```

### Global State (if needed in future)

```
Possible additions:
├── User Authentication
├── Theme Preference (Dark/Light)
├── User Settings
└── Recent Experiments Cache
```

---

## Error Handling Strategy

```
API Call Flow
    │
    ├─→ fetch() with AbortController
    │   └─→ Timeout: 3000ms
    │       └─→ Abort if exceeded
    │
    ├─→ Response received
    │   ├─→ OK (status 200)
    │   │   └─→ Parse & return data
    │   │
    │   └─→ Error (status 4xx/5xx)
    │       └─→ Retry logic
    │           ├─→ Retry 1/2
    │           ├─→ Retry 2/2
    │           └─→ Return error
    │
    └─→ Network error / Timeout
        └─→ Retry logic
            └─→ Return error after max retries

UI Response
    ├─→ Success
    │   └─→ Display data
    │
    ├─→ Loading
    │   └─→ Show skeleton/spinner
    │
    └─→ Error
        └─→ Show error message + retry button
```

---

## Performance Considerations

### Optimization Strategies

```
1. Code Splitting
   ├─ Next.js automatic route splitting
   └─ Lazy loading where applicable

2. Image Optimization
   ├─ Next.js <Image> component (future)
   └─ SVG/emoji for icons (lightweight)

3. CSS Optimization
   ├─ Tailwind CSS purging
   ├─ Custom CSS variables
   └─ Minimal framework overhead

4. API Calls
   ├─ Retry logic for resilience
   ├─ Timeout handling (5s)
   └─ Polling intervals (5s for health)

5. Bundle Size
   ├─ Framer Motion: ~40KB
   ├─ Recharts: ~100KB
   ├─ Core app: ~50KB
   └─ Total (gzipped): ~190KB
```

---

## Security Considerations

```
Frontend Security
├─ Environment Variables
│  └─ NEXT_PUBLIC_API_GATEWAY_URL (secure default)
│
├─ CORS Handling
│  └─ Backend must allow frontend origin
│
├─ XSS Protection
│  └─ React prevents injection by default
│
├─ CSRF Protection
│  └─ Implement CSRF tokens if needed
│
└─ Content Security Policy
   └─ Configure in next.config.js if needed
```

---

## Deployment Architecture

```
┌────────────────────────────────────────┐
│   Local Development                    │
├────────────────────────────────────────┤
│ Browser → localhost:3000               │
│      ↓                                  │
│ Next.js Dev Server (npm run dev)       │
│      ↓                                  │
│ API Gateway → localhost:8080           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│   Production (Cloud)                   │
├────────────────────────────────────────┤
│ Browser → your-domain.com              │
│      ↓                                  │
│ Next.js Server                         │
│ (Vercel / Self-hosted)                 │
│      ↓                                  │
│ API Gateway → cloud-api.example.com    │
└────────────────────────────────────────┘
```

---

## Summary

The Open Reliability Lab frontend follows a **clean, modular architecture** with:

- ✅ Separation of concerns (lib, components, pages)
- ✅ Type-safe implementations (TypeScript)
- ✅ Reusable utilities (ApiClient, hooks)
- ✅ Component composition (Navbar, HealthCard)
- ✅ Centralized configuration (config.ts)
- ✅ Professional UI with animations
- ✅ Responsive design (mobile → desktop)
- ✅ Error handling & retry logic
- ✅ Performance optimized

This architecture is **scalable and maintainable** for future enhancements!

---

*Diagram created for Open Reliability Lab Platform*
