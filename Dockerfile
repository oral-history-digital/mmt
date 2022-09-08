FROM docker.io/library/node:16-bullseye-slim

WORKDIR /app
COPY . .

RUN npm install

ENV MMT_LISTEN_HOST=0.0.0.0
ENV MMT_LISTEN_PORT=3000
CMD ["node", "server.js"]
EXPOSE 3000
