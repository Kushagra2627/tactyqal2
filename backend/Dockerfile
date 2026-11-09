FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/db/migrations ./src/db/migrations
COPY --from=builder /app/scripts ./scripts
COPY tsconfig.json ./

RUN mkdir -p uploads

EXPOSE 5000

CMD ["sh", "-c", "npx tsx src/db/migrate.ts && npx tsx scripts/seed.ts && node dist/server.js"]
