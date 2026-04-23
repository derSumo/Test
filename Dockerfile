# ---- Build Stage ----
FROM node:22-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---- Runtime Stage ----
FROM node:22-alpine

# Install yt-dlp dependencies: python3 + ffmpeg
RUN apk add --no-cache python3 ffmpeg curl

# Install yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && \
    chmod +x /usr/local/bin/yt-dlp

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY . .

# Music directory (will be overridden by volume in production)
RUN mkdir -p public/music

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]
