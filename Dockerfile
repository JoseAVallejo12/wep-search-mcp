# ---------------------------------------------------------
# Build Stage
# ---------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests for server and React view
COPY package*.json ./
COPY view/package*.json ./view/

# Install root dependencies
RUN npm ci

# Install view dependencies and build React app
WORKDIR /app/view
RUN npm ci
COPY view/ ./
RUN npm run build

# Build server TypeScript
WORKDIR /app
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build:server

# ---------------------------------------------------------
# Production Runner Stage
# ---------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript output and built React view
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/view/dist ./view/dist

# Security: run as unprivileged node user
USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]
