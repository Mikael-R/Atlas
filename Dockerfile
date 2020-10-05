FROM node:alpine

WORKDIR /usr/app

COPY . .

RUN yarn install --network-timeout 100000

CMD yarn dev
