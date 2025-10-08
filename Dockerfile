## Builder stage: install deps and build the TypeScript app
FROM node:22-alpine AS builder
WORKDIR /app

# Install build-time dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

## Runner stage: smaller image for production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --production

# Copy built artifact and necessary runtime files
COPY --from=builder /app/dist ./dist
# The service reads src/registry/db.json at runtime (process.cwd()/src/registry/db.json)
# so include the db.json from the source into the image
COPY --from=builder /app/src/registry/db.json ./src/registry/db.json

EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/main"]
