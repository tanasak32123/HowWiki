FROM node:14-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install & npm i -g @nestjs/cli

COPY . .

RUN npm run build

CMD [ "node", "dist/main" ]