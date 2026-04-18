# Development stage
FROM node:20-alpine AS development
WORKDIR /app

# Install dependencies for healthcheck and database client
RUN apk add --no-cache wget postgresql-client

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Copy and set entrypoint script
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Install dependencies for healthcheck and database client
RUN apk add --no-cache wget postgresql-client

# Copy package files and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy compiled code
COPY --from=builder /app/dist ./dist

# Copy database migrations and config if needed
COPY --from=builder /app/src/core/database/config ./src/core/database/config
COPY --from=builder /app/src/core/database/migrations ./src/core/database/migrations

# Copy entrypoint script
COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "dist/server.js"]