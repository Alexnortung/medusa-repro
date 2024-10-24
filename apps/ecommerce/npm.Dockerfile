FROM node:20-slim AS base
WORKDIR /medusa-app

COPY package.json package-lock.json .
RUN npm ci

COPY . .

ENV NODE_ENV=production
RUN npm run build

EXPOSE 9000

CMD npm run predeploy && npm run start

