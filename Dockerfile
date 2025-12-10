## Install Dependencies
FROM node:20-bullseye AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --force


## Runner
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_IONOS_HOST_NAME=s3-eu-central-1.ionoscloud.com
ENV NEXT_PUBLIC_IONOS_BUCKET_NAME=festival

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:client:generate
RUN npm run build

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["npm", "run", "start"]
