# Inventory & Warehouse Management — MVP

A deliberately small MERN app whose real purpose is to serve as a practice
target for containerization: Docker, Kubernetes (StatefulSet + PVC for
MongoDB), and Helm.

## Status
- [x] Phase 1 — Backend scaffolding, config, error handling, User model
- [ ] Phase 2 — Auth + Product/StockMovement CRUD endpoints
- [ ] Phase 3 — Frontend scaffolding wired to the API
- [ ] Phase 4 — Dockerize backend, frontend, docker-compose with MongoDB
- [ ] Phase 5 — Kubernetes manifests (Deployments, StatefulSet+PVC, Ingress)
- [ ] Phase 6 — Helm chart

## Backend — local setup (once Phase 2 is done)
```
cd backend
cp .env.example .env
npm install
npm run dev
```
