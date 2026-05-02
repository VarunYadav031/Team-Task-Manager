# Multi-stage Dockerfile for full-stack application
FROM node:20-slim AS frontend-builder

# Build frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Copy production environment variables for frontend
COPY frontend/.env.production .env.production

# Build frontend
RUN npm run build

# Backend stage
FROM node:20-slim AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm ci

# Copy backend source code
COPY backend/ ./

# Production stage
FROM node:20-slim

WORKDIR /app

# Copy backend dependencies and source
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend ./backend

# Copy built frontend files
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set environment variables
ENV NODE_ENV=production

# Install additional dependencies for crypto support
RUN apt-get update && apt-get install -y openssl

# Expose port
EXPOSE 8080

# Start the application
WORKDIR /app/backend
CMD ["npm", "start"]