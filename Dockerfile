FROM node:18-bullseye-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build && mv ./dist/* ./public/ && rm -rf ./dist

ENV MMT_LISTEN_HOST=0.0.0.0 \
    MMT_LISTEN_PORT=3000 \
    MMT_USER_FILES_DIR=/app/user_files

EXPOSE 3000
CMD ["node", "server/server.js"]
