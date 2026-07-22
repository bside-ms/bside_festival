FROM node:20-bullseye AS base
WORKDIR /app
ENV RUNNING_IN_DOCKER=1
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./

## Development
FROM base AS development
ENV NODE_ENV=development
RUN npm ci --force
COPY . .
RUN DATABASE_URL="mysql://prisma-generate-only:not-used@localhost:3306/prisma_generate_only" npm run prisma:client:generate

EXPOSE 3000

CMD ["npm", "run", "dev"]


## Install Dependencies
FROM base AS dependencies
RUN npm ci --force


## Runner
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV RUNNING_IN_DOCKER=1
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_IONOS_HOST_NAME=s3-eu-central-1.ionoscloud.com
ENV NEXT_PUBLIC_IONOS_BUCKET_NAME=festival

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
# Prisma 7 generation and Next's build-time module evaluation require a valid URL string, but do not connect here.
RUN DATABASE_URL="mysql://prisma-generate-only:not-used@localhost:3306/prisma_generate_only" npm run prisma:client:generate
RUN DATABASE_URL="mysql://prisma-generate-only:not-used@localhost:3306/prisma_generate_only" npm run build

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]
