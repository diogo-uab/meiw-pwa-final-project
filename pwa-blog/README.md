# PWA Blog

Project with Yarn Workspaces for PWA Blog [front-end](./frontend/), [back-end](./backend/) and [@pwa/shared](./shared)

## Getting started

### Requirements

* Install [Node.js](https://nodejs.org/en) (version should be between 20 and 22)
* Install [Yarn](https://yarnpkg.com/getting-started) (v1.22.*)
* Setup a [MongoDB](https://www.mongodb.com/) instance

### Build and Run

* Run `yarn install` on the root of the project (`meiw-pwa-final-project/pwa-blog`)
* Build the [shared](./shared/) package
  * Change directory to the `shared` directory (`cd shared`)
  * Run `yarn build`
* Run the [backend](./backend/)
  * Change directory to the `backend` directory (`cd backend`)
  * Run `PWA_BACKEND__MONGODB_CONNECTION_URL=mongodb://<host>:<port>/<db> yarn start`
    * Alternatively, change `mongodbConnectionURL` configuration on [backend/src/config/env.ts](./backend/src/config/env.ts) with the desired MongoDB connection URL and run `yarn start`
  * By default, the backend will listen on port `3000`
* Run the [frontend](./frontend/)
  * Change directory to the `frontend` directory (`cd frontend`)
  * Run `yarn dev`
  * By default, the frontend will listen on port `5173`
