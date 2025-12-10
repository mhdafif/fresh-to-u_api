FROM node:22-alpine AS base

# Install system deps once and enable pnpm via corepack
RUN apk add --no-cache libc6-compat openssl && corepack enable
WORKDIR /app

# Install dependencies (dev + prod) using the lockfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY tsconfig.json ./
COPY src ./src

# Generate the Prisma client and compile the TypeScript sources
RUN pnpm prisma generate --schema src/prisma/schema.prisma
RUN pnpm build

# Trim dev dependencies now that the build is done
RUN pnpm prune --prod

FROM node:22-alpine AS runner

RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]
