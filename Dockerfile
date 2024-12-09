FROM node:18-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm lerna
RUN pnpm install
RUN lerna run build

