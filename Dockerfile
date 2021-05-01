FROM node:14-alpine
WORKDIR /usr/build
COPY tsconfig.json package.json package-lock.json /usr/build/
RUN npm ci
COPY ./src /usr/build/src/
RUN npm run build

FROM node:14-alpine
WORKDIR /usr/bot
RUN apk add --no-cache imagemagick
COPY package.json package-lock.json /usr/bot/
RUN npm ci --production
COPY migrations /usr/bot/migrations/
COPY --from=0 /usr/build/dist /usr/bot/dist

CMD [ "node", "/usr/bot/dist/index.js" ]
