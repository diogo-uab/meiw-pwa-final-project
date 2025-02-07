# MEIW - PWA - Final Project (PWA Blog)

Final project for Mestrado em Engenharia Informática e Tecnologia Web - Programação Web Avançada

## Getting started

Start by cloning (or downloading) this repo (`git clone git@github.com:diogo-uab/meiw-pwa-final-project.git`)

### Run with Docker

* Install [Docker](https://docker.com)
* Install [Docker Compose](https://docs.docker.com/compose/)
* Change directory to the root of the project (`cd path/to/meiw-pwa-final-project`)
* Create a `stack.env` file in the root directory, with the same content content as the `stack.env.example` (or simply rename `stack.env.example` to `stack.env`)
  * For local use, the essential variable to have on `stack.env` (it's present on `stack.env.example`) is `PWA_BACKEND__MONGODB_CONNECTION_URL=mongodb://mongo:27017/pwa-blog`. It uses the host from MongoDB container.
* Example run command: `docker-compose -f 'docker-compose.yml' up -d --build`

### Run without Docker

To build and run the applications individually without Docker, check out [pwa-blog/README](./pwa-blog/README.md) for more details.

## Prototype

Head over to the [./prototype](./prototype/) directory to view the wireframes and mockups of the project.

## Postman

A Postman collection with the project endpoints is available in the [./postman](./postman/) directory.\
It also includes environment variables exports for the different API environments (Local, Production, etc).
