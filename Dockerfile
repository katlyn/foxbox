FROM node:14-alpine
RUN apk add --no-cache make gcc g++ python pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev
WORKDIR /usr/build
COPY tsconfig.json package.json package-lock.json /usr/build/
RUN npm install
COPY ./src /usr/build/src/
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/bot
RUN apk add --no-cache make gcc g++ python pkgconfig pixman-dev cairo-dev pango-dev libjpeg-turbo-dev giflib-dev
COPY package.json package-lock.json /usr/bot/
RUN npm install --production
COPY migrations /usr/bot/migrations/
COPY --from=0 /usr/build/dist /usr/bot/dist

CMD [ "node", "/usr/bot/dist/index.js" ]
