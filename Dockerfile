FROM node:18-alpine

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm ci --omit=dev && npm cache clean --force --loglevel=error

COPY --chown=node:node server ./server/
COPY --chown=node:node client ./client/
COPY --chown=node:node public ./public/
COPY --chown=node:node .adminjs ./.adminjs/
COPY --chown=node:node vite.config.js ./
COPY --chown=node:node tsconfig.json ./
RUN npm run build && mv ./dist/* ./public/ && rm -rf ./dist

ENV MMT_LISTEN_HOST=0.0.0.0 \
    MMT_LISTEN_PORT=3000 \
    MMT_USER_FILES_DIR=/app/user_files

EXPOSE 3000
CMD ["node", "server/server.js"]
