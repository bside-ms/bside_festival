## Install Dependencies
FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --force


## Runner
FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:migrations:deploy
RUN npm run prisma:client:generate
RUN npm run build -- --no-lint

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]
