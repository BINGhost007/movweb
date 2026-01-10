# Dockerfile for MovieStream Platform

# Stage 1: Build frontend
FROM node:18-alpine as frontend-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine as backend-builder
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server/ ./

# Stage 3: Production image
FROM node:18-alpine
WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/client/build ./client/build

# Copy backend
COPY --from=backend-builder /app/server ./

# Copy database and root files
COPY database/ ./database/
COPY .env.example ./
COPY package.json ./

# Install production dependencies
RUN npm install --production

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Start the application
CMD ["npm", "start"]