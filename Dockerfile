# ---------------------------------------------------------
# Build Stage
# ---------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ---------------------------------------------------------
# Production Runner Stage
# ---------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript output
COPY --from=builder /app/dist ./dist

# Security: run as unprivileged node user
USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]
