FROM node:16

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install

COPY . .

ENV PORT=4000

EXPOSE 4000

CMD ["npm", "start"]

