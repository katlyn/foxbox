FROM node:13-alpine

WORKDIR /usr/bot

COPY tsconfig.json package.json yarn.lock /usr/bot/

RUN yarn

COPY ./src /usr/bot/src/

RUN yarn build

CMD [ "node", "/usr/bot/dist/index.js" ]
