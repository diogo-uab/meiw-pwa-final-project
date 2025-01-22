# ---------------------------------- Builder --------------------------------- #
FROM node:22-alpine AS base

WORKDIR /app

COPY ./package.json ./yarn.lock ./
COPY ./backend/package.json ./backend/
COPY ./shared/package.json ./shared/

RUN yarn install

COPY ./shared ./shared/
RUN yarn workspace @pwa/shared build

COPY ./backend/ts*.json ./backend/nest-cli.json backend/src/ ./backend/
RUN yarn workspace backend build

# ---------------------------------- Runner ---------------------------------- #
FROM node:22-alpine

WORKDIR /app

COPY --from=base /app/package.json /app/yarn.lock ./
COPY --from=base /app/backend/package.json ./backend/
COPY --from=base /app/shared/package.json ./shared/

RUN yarn install --production

COPY --from=base /app/shared/dist/ ./shared/dist/

COPY --from=base /app/backend/dist/ ./backend/dist/

ENTRYPOINT [ "node", "backend/dist/main.js" ]
