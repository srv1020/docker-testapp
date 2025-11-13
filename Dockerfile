# ---------- Stage 1: Build stage ----------
FROM node:20-alpine AS deps

# Set working directory
WORKDIR /app
# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./
# Install all dependencies (including devDependencies if needed for build)
RUN npm ci --omit=dev

# ---------- Stage 2: Production stage ----------
FROM node:20-alpine

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

CMD ["node", "server.js"]