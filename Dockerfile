FROM node:20-alpine
RUN npm i -g pnpm
WORKDIR /usr/build
COPY tsconfig.json package.json pnpm-lock.yaml /usr/build/
RUN pnpm install
COPY ./src /usr/build/src/
RUN npm run build

FROM node:15-alpine
RUN npm i -g pnpm
WORKDIR /usr/bot
COPY package.json pnpm-lock.yaml /usr/bot/
RUN pnpm install --prod
COPY migrations /usr/bot/migrations/
COPY --from=0 /usr/build/dist /usr/bot/dist

CMD [ "node", "/usr/bot/dist/index.js" ]
