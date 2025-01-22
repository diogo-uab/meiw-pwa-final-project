# ----------------------------- Build environment ---------------------------- #
FROM node:22-alpine AS build

WORKDIR /app

COPY ./pwa-blog/package.json ./pwa-blog/yarn.lock ./
COPY ./pwa-blog/frontend/package.json ./frontend/
COPY ./pwa-blog/shared/package.json ./shared/

RUN yarn install

COPY ./pwa-blog/shared ./shared
RUN yarn workspace @pwa/shared build

COPY ./pwa-blog/frontend/ ./frontend
RUN yarn workspace frontend build

# -------------------------- Production environment -------------------------- #
FROM nginx:stable-alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/
COPY nginx/conf.d /etc/nginx/conf.d
