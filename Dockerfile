FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

ENV PORT=4000

EXPOSE $PORT

CMD ["pnpm", "start:dev"]

