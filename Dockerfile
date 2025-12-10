FROM node:22-alpine AS base

# Install system deps once and enable pnpm via corepack
RUN apk add --no-cache libc6-compat openssl && corepack enable
WORKDIR /app

# Provide a placeholder connection string so Prisma CLI commands run during build.
# The real DATABASE_URL will be set at runtime when the container starts.
# ARG PRISMA_DB_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ENV DATABASE_URL="${PRISMA_DB_URL}"

# Install dependencies (dev + prod) using the lockfile
COPY package.json prisma.config.ts pnpm-lock.yaml ./
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
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/prisma ./src/prisma

EXPOSE 4000

CMD ["node", "dist/index.js"]
