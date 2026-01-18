# 🚀 Quick Start Guide - Open Reliability Lab

## Complete Setup Instructions

### Part 1: Backend Services (Java 21)

```bash
# Navigate to project root
cd open-reliability-lab

# Install backend dependencies (requires Maven 3.9.6+)
# The backend has 5 microservices that will build and run

# Build all services
mvn clean install

# Start the entire stack using Docker Compose
docker-compose -f infra/docker-compose.yml up -d

# Verify all services are running:
# - API Gateway: http://localhost:8080
# - Auth Service: http://localhost:8081
# - Order Service: http://localhost:8003
# - Payment Service: http://localhost:8004
# - Chaos Service: http://localhost:8005
# - Prometheus: http://localhost:9090
# - Grafana: http://localhost:3000 (admin/admin)
```

### Part 2: Frontend (Next.js 14)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on port 3000)
npm run dev

# Open browser to: http://localhost:3000
```

### Part 3: Access the Application

**Landing Page (Home)**
- URL: http://localhost:3000
- Features: Introduction, key stats, CTAs to explore

**Dashboard** 
- URL: http://localhost:3000/dashboard
- View: Real-time health of all 5 services
- Features: Color-coded status, latency metrics, architecture info

**Metrics**
- URL: http://localhost:3000/metrics
- View: Performance analytics with Recharts
- Charts: Latency trends, throughput, error rates

**Chaos Engineering**
- URL: http://localhost:3000/chaos
- Actions: Trigger failure scenarios
- Experiments: Kill service, inject latency, restart services

---

## 📋 Checklist

Before starting, ensure you have:

- ✅ Java 21 LTS (verify: `java -version`)
- ✅ Maven 3.9.6+ (verify: `mvn -v`)
- ✅ Node.js 18+ (verify: `node -v`)
- ✅ npm 9+ (verify: `npm -v`)
- ✅ Docker & Docker Compose (verify: `docker -v`)

---

## 🔗 Important URLs

### Frontend (Next.js)
- **Home:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **Metrics:** http://localhost:3000/metrics
- **Chaos:** http://localhost:3000/chaos

### Backend Services
- **API Gateway:** http://localhost:8080
  - Health: http://localhost:8080/actuator/health
  - Prometheus metrics: http://localhost:8080/actuator/prometheus

### Observability
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000 (admin/admin)

---

## 🧪 Test the System

### 1. Verify Health Checks
```bash
# Check API Gateway health
curl http://localhost:8080/actuator/health

# Check individual services via gateway
curl http://localhost:8080/auth/actuator/health
curl http://localhost:8080/orders/actuator/health
curl http://localhost:8080/payments/actuator/health
```

### 2. Run a Chaos Experiment
```bash
# Via curl
curl -X POST http://localhost:8080/chaos/latency

# Or use the web UI:
# 1. Go to http://localhost:3000/chaos
# 2. Click "Inject Latency"
# 3. Watch the dashboard update
```

### 3. View Metrics in Prometheus
```
1. Go to http://localhost:9090
2. Search for: http_requests_total
3. See real-time metrics from services
```

---

## 📝 Environment Configuration

### Frontend (.env.local)

```bash
# Optional - defaults to localhost:8080
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080
```

### Backend Services

All services are configured in `services/*/src/main/resources/application.properties`:
- Health endpoint: `/actuator/health`
- Prometheus metrics: `/actuator/prometheus`
- Management port: 8080 (via API Gateway)

---

## 🐛 Troubleshooting

### "Cannot connect to API Gateway"
1. Verify `docker ps` shows all containers running
2. Check `http://localhost:8080` in browser
3. Restart: `docker-compose -f infra/docker-compose.yml restart`

### "Frontend won't start"
1. Verify Node.js: `node -v` (needs 18+)
2. Clear cache: `rm -rf node_modules && npm install`
3. Check port: `lsof -i :3000` (make sure 3000 is free)

### "Services not healthy"
1. Check logs: `docker logs <container-name>`
2. Verify Java 21: `java -version`
3. Check Maven pom.xml: `mvn clean validate`

### "Charts showing mock data"
This is normal! To connect real Prometheus metrics:
1. Configure Prometheus scrape targets
2. Deploy services with monitoring annotations
3. Metrics will appear in real-time

---

## 📚 Next Steps

1. **Explore the Dashboard**
   - Watch real-time health indicators
   - See service latencies
   - Check architecture overview

2. **Run Chaos Experiments**
   - Kill a service and observe recovery
   - Inject latency and see impact
   - Review metrics before/after

3. **Configure Custom Metrics**
   - Add custom Prometheus queries
   - Create Grafana dashboards
   - Set up alerts

4. **Deploy to Cloud** (Optional)
   - Update `NEXT_PUBLIC_API_GATEWAY_URL` for cloud endpoint
   - Use `npm run build` for production
   - Deploy frontend to hosting (Vercel, Netlify, etc.)
   - Deploy backend to Kubernetes or Container Apps

---

## 💡 Pro Tips

- **Monitor in parallel:** Open dashboard + metrics in split view
- **Safe testing:** Run chaos experiments in off-peak hours
- **Team access:** Share frontend URL (no backend access needed for monitoring)
- **Custom dashboards:** Use Grafana for advanced visualization
- **Alerts:** Configure PagerDuty/Slack integration via Prometheus

---

## 🆘 Need Help?

Check these files for detailed docs:
- [Frontend README](frontend/FRONTEND_README.md)
- [Main README](README.md)
- Backend service READMEs in `services/*/README.md`

---

**Happy monitoring and chaos engineering! 🎯**
