# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies needed for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project
COPY . .

# Generate Prisma client with musl binary target
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install system dependencies needed for Prisma
RUN apk add --no-cache openssl

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Set environment variable to let Prisma find the binary
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/query_engine-linux-musl-openssl-3.0.so.node

CMD ["npm", "start"]