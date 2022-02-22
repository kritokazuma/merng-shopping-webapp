FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

ENV PORT=4000

EXPOSE $PORT 27017

CMD ["pnpm", "start:dev"]

