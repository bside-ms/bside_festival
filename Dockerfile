## Install Dependencies
FROM node:16-alpine AS dependencies
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci



## Build Environment
#FROM node:16-alpine AS builder
#WORKDIR /app
#ENV NEXT_TELEMETRY_DISABLED 1

#COPY --from=dependencies /app/node_modules ./node_modules
#COPY . .
#RUN npm run build



## Production
FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 101 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["npm", "run", "start"]
