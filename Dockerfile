FROM docker.io/library/node:16-bullseye-slim

#VOLUME user_files
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV MMT_LISTEN_HOST=0.0.0.0
ENV MMT_LISTEN_PORT=3000
ENV MMT_USER_FILES_DIR=/app/user_files
CMD ["node", "server/server.js"]
EXPOSE 3000
