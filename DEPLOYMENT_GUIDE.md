# 📋 Deployment Checklist & Production Guide

## Pre-Deployment Checklist

### ✅ Frontend Setup

- [ ] All npm dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] TypeScript compilation without errors (`tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Build succeeds without warnings (`npm run build`)
- [ ] All pages load without 404s
- [ ] Responsive design tested on mobile/tablet/desktop
- [ ] Dark theme visually correct
- [ ] Animations smooth (60fps)
- [ ] Navigation links work correctly
- [ ] External links (Prometheus, Grafana) configured

### ✅ Backend Setup

- [ ] All 5 services build with Maven (`mvn clean install`)
- [ ] Docker images build successfully
- [ ] Docker Compose runs all services
- [ ] Health endpoints respond (GET `/actuator/health`)
- [ ] All ports are accessible and not conflicting
- [ ] Prometheus scrape targets configured
- [ ] Grafana dashboards accessible
- [ ] Network connectivity between services verified

### ✅ API Integration

- [ ] Health check endpoints returning correct format
- [ ] CORS configured for frontend origin
- [ ] API Gateway routing working for all services
- [ ] Timeout handling working (5s)
- [ ] Retry logic verified with network errors
- [ ] Error responses formatted correctly
- [ ] Prometheus metrics endpoint accessible
- [ ] Health polling updates in real-time

### ✅ Testing

- [ ] Dashboard displays all 5 services
- [ ] Metrics charts rendering without errors
- [ ] Chaos experiments trigger without crashes
- [ ] Run history tracking in chaos page
- [ ] No console errors in browser DevTools
- [ ] Network tab shows expected API calls
- [ ] Response times reasonable (< 5s)
- [ ] Error states display gracefully
- [ ] Mobile navigation responsive

---

## Local Development Verification

### Before pushing to production:

```bash
# 1. Frontend checks
cd frontend
npm run lint              # Must pass
tsc --noEmit             # Must pass
npm run build            # Must succeed

# 2. Run locally
npm run dev              # Verify on localhost:3000

# 3. Backend checks  
cd ..
docker-compose -f infra/docker-compose.yml up -d

# 4. Verify connectivity
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/prometheus

# 5. Test frontend
# - Open http://localhost:3000 in browser
# - Check all pages load
# - Verify health cards show services
# - Test chaos experiment buttons
# - Check metrics charts render
```

---

## Production Deployment Options

### Option 1: Docker (Recommended for Team/Server)

#### 1.1 Create Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "start"]
```

#### 1.2 Update docker-compose.yml

```yaml
# Add to infra/docker-compose.yml
  frontend:
    image: open-reliability-lab-frontend:latest
    build:
      context: ../frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_GATEWAY_URL=http://api-gateway:8080
    depends_on:
      - api-gateway
    networks:
      - orl-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 3
```

#### 1.3 Build and Deploy

```bash
# Build frontend image
docker build -f frontend/Dockerfile -t open-reliability-lab-frontend:latest ./frontend

# Start all services
docker-compose -f infra/docker-compose.yml up -d

# Verify
docker ps              # Should show frontend container
curl http://localhost:3000
```

---

### Option 2: Vercel Deployment (Easiest for Static Hosting)

#### 2.1 Prepare Repository

```bash
# Initialize git if needed
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git push origin main
```

#### 2.2 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link project to GitHub repo
# - Select frontend directory
# - Set environment variable: NEXT_PUBLIC_API_GATEWAY_URL=<your-api-url>
# - Deploy
```

#### 2.3 Configure Backend URL

```env
# Production .env at Vercel dashboard
NEXT_PUBLIC_API_GATEWAY_URL=https://your-api-gateway.example.com
```

---

### Option 3: Self-Hosted Server (AWS/Azure/GCP)

#### 3.1 Build for Production

```bash
cd frontend
npm run build
npm run start    # Test locally first
```

#### 3.2 Deploy on Linux Server

```bash
# SSH into server
ssh user@your-server.com

# Clone repository
git clone <repo-url>
cd open-reliability-lab/frontend

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install dependencies
npm install --production

# Build
npm run build

# Start with PM2
pm2 start npm --name "frontend" -- start
pm2 save

# Enable restart on reboot
pm2 startup
```

#### 3.3 Configure Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/frontend
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        # Forward to Next.js server
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

---

### Option 4: Kubernetes (Cloud-Native)

#### 4.1 Create Kubernetes Manifests

```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: orl
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry.azurecr.io/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_GATEWAY_URL
          value: http://api-gateway:8080
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 500m
            memory: 512Mi
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: orl
spec:
  selector:
    app: frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

#### 4.2 Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace orl

# Build and push image
docker build -t your-registry.azurecr.io/frontend:latest ./frontend
docker push your-registry.azurecr.io/frontend:latest

# Deploy
kubectl apply -f k8s/frontend-deployment.yaml

# Verify
kubectl get pods -n orl
kubectl get svc -n orl
```

---

## Environment Variables

### Frontend (.env.local or platform-specific)

```env
# Required (with default)
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:8080

# Optional
# DEBUG=true
```

### Build-time vs Runtime

```
NEXT_PUBLIC_*      → Available in browser (build-time)
NODE_ENV           → Automatically set by Next.js
                    (development/production)
```

---

## Performance Optimization

### Frontend Optimizations

- [ ] Enable Next.js output analysis: `npm run build -- --analyze`
- [ ] Minimize bundle size
  - Check unused dependencies
  - Use dynamic imports for large components
  - Tree-shake unused code

- [ ] Image optimization (if using images)
  - Use Next.js `<Image>` component
  - Provide multiple sizes with srcSet
  - Use AVIF/WebP formats

- [ ] Caching strategy
  - Set appropriate Cache-Control headers
  - Implement service worker (optional)
  - Use CDN for static assets

### Backend Optimization

- [ ] JVM tuning
  - Heap size: `-Xmx512m` (adjust per service)
  - GC selection: `-XX:+UseG1GC`

- [ ] Connection pooling
  - HikariCP settings in application.properties
  - Tune pool size based on load

- [ ] Monitoring
  - Enable JMX metrics
  - Monitor heap usage
  - Track GC pause times

---

## Security Hardening

### Frontend Security

- [ ] Remove development dependencies from production build
- [ ] Enable CORS only for trusted origins
- [ ] Set secure Content-Security-Policy headers
- [ ] Use HTTPS in production
- [ ] Implement rate limiting on API gateway
- [ ] Validate all user inputs
- [ ] Never expose secrets in client-side code

### Backend Security

- [ ] Enable authentication/authorization
- [ ] Use HTTPS for API communication
- [ ] Implement API key rotation
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security audits
- [ ] Dependency vulnerability scanning

### Deployment Security

- [ ] Use secrets management (Vault, Key Vault)
- [ ] Enable audit logging
- [ ] Restrict network access (firewalls, NSGs)
- [ ] Regular backup and disaster recovery
- [ ] Least privilege access control

---

## Monitoring & Logging

### Frontend Monitoring

```bash
# Application Performance Monitoring (APM)
# Options: Datadog, New Relic, AppDynamics, Sentry

# Error tracking
# Options: Sentry, Rollbar, LogRocket

# Analytics
# Options: Google Analytics, Amplitude, Segment
```

### Backend Monitoring

```bash
# Prometheus metrics are already configured
# Add Alertmanager for notifications:
# - Service down alerts
# - Error rate spikes
# - Latency increase

# Add centralized logging:
# - ELK Stack (Elasticsearch, Logstash, Kibana)
# - Splunk
# - Azure Log Analytics
```

---

## Rollback Strategy

### If deployment fails:

```bash
# Docker: Rollback to previous image
docker-compose down
docker-compose up -d               # Pulls previous tag

# Vercel: Automatic rollback available in dashboard

# Self-hosted: Revert code + rebuild
git revert <commit-hash>
npm run build
pm2 restart frontend

# Kubernetes: Rollback deployment
kubectl rollout undo deployment/frontend -n orl
```

---

## Maintenance Checklist

### Weekly

- [ ] Check application logs for errors
- [ ] Monitor disk space usage
- [ ] Verify backup completion
- [ ] Review Prometheus metrics

### Monthly

- [ ] Update dependencies (`npm update`)
- [ ] Security patches (`npm audit fix`)
- [ ] Database optimization
- [ ] Review cost optimization

### Quarterly

- [ ] Full security audit
- [ ] Load testing
- [ ] Disaster recovery drill
- [ ] Documentation update

---

## Troubleshooting Common Issues

### "Cannot reach API Gateway"

```bash
# Check connectivity
curl -v http://your-api-gateway:8080/actuator/health

# Check CORS headers
curl -i -H "Origin: http://your-frontend-url" \
  http://your-api-gateway:8080/actuator/health

# Check firewall rules
telnet your-api-gateway 8080
```

### "High latency in health checks"

```bash
# Check network latency
ping api-gateway

# Monitor API response times
# Use Prometheus query: histogram_quantile(0.95, rate(...))

# Check service logs
docker logs api-gateway
```

### "Memory leak in frontend"

```bash
# Monitor memory usage
docker stats frontend

# Check for infinite loops
# Check browser DevTools → Memory tab → Heap snapshots

# Review polling intervals
# Check for uncleared intervals in useEffect
```

---

## Success Criteria

### Deployment successful when:

- ✅ Frontend loads within 3 seconds
- ✅ All pages accessible and functional
- ✅ Health checks update every 5 seconds
- ✅ API responses < 1 second (typical)
- ✅ No console errors in browser
- ✅ Metrics charts display correctly
- ✅ Chaos experiments trigger successfully
- ✅ Backend services running smoothly
- ✅ Prometheus collecting metrics
- ✅ Monitoring dashboards functional

---

## Quick Reference Commands

```bash
# Build frontend
cd frontend && npm run build

# Start frontend (production)
npm run start

# Start frontend (development)
npm run dev

# Check frontend health
curl http://localhost:3000

# Check API Gateway health
curl http://localhost:8080/actuator/health

# View Prometheus metrics
curl http://localhost:9090/api/v1/query?query=up

# Docker commands
docker-compose up -d                   # Start all
docker-compose down                    # Stop all
docker-compose logs frontend           # View logs
docker stats                           # View resource usage

# PM2 commands (self-hosted)
pm2 list                               # List processes
pm2 logs frontend                      # View logs
pm2 restart frontend                   # Restart
pm2 stop frontend                      # Stop
```

---

## Support & Escalation

### If issues persist:

1. **Check logs**
   - Frontend: Browser console + server logs
   - Backend: Container logs
   - Prometheus: Query UI

2. **Review metrics**
   - Response times
   - Error rates
   - Resource usage

3. **Reach out**
   - Check README files for detailed docs
   - Review ARCHITECTURE.md for design patterns
   - Check FRONTEND_README.md for component docs

---

**Ready for production deployment! 🚀**

---

*Last Updated: 2024*
*Open Reliability Lab Platform*
