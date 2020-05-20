FROM node:13-alpine
RUN apk add --no-cache make gcc g++ python pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev
WORKDIR /usr/bot

COPY tsconfig.json package.json package-lock.json /usr/bot/

RUN yarn

COPY ./src /usr/bot/src/

RUN yarn build

CMD [ "node", "/usr/bot/dist/index.js" ]
