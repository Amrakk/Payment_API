FROM node:20.18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build:node

EXPOSE 5000
CMD [ "node", "build.node/index.js" ]