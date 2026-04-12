# ─────────────────────────────────────
#  Stage 1 – deps
#  Install only production dependencies
# ─────────────────────────────────────
FROM node:24-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN apk add --no-cache python3 make g++ pkgconf cairo-dev pango-dev jpeg-dev giflib-dev \
    && npm ci --omit=dev

# ─────────────────
#  Stage 2 – runner
#  Lean final image
# ─────────────────
FROM node:24-alpine AS runner

LABEL org.opencontainers.image.authors="Francisco José Rodríguez Afonso" \
      org.opencontainers.image.documentation="https://fjrodafo.github.io/DiscordAPP/" \
      org.opencontainers.image.source="https://github.com/FJrodafo/DiscordAPP" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="FJrodafo" \
      org.opencontainers.image.licenses="CC0-1.0" \
      org.opencontainers.image.title="DiscordAPP" \
      org.opencontainers.image.description="A simple Discord Application made in JavaScript!"

# Add non-root user for security
RUN apk add --no-cache curl cairo pango jpeg giflib \
    && addgroup --system --gid 1001 appgroup \
    && adduser --system --uid 1001 --ingroup appgroup appuser

WORKDIR /app

# Copy installed dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source (config.json is NOT included – provided at runtime)
COPY src/ ./src/
COPY dashboard/ ./dashboard/
COPY package.json ./

# The dashboard will look for a free port starting at 3000
EXPOSE 3000

USER appuser

CMD ["npm", "start"]
