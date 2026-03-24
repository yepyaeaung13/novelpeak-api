# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build TypeScript → dist/
RUN npm run build:ts


# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# Copy only needed files
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]