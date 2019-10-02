<h1 align="center">GOBARBER - BACKEND</h1>

![reactbadge](https://img.shields.io/badge/11.14.0-NodeJS-green?style=flat-square&logo=node.js)
![reactbadge](https://img.shields.io/badge/1.38.0-Visual%20Code-orange?style=flat-square&logo=visual-studio-code)
![reactbadge](https://img.shields.io/badge/1.17.3-version-red?style=flat-square&logo=yarn)

> Backend para aplicação GoBarber Web e GoBarber Mobile para agendamento de corte de cabelo e barba.

## Install

```sh
yarn
```

## Usage

```sh
yarn dev
```

## Start Redis

```sh
yarn queue
```

## Techs Usage

1. NodeJS
2. Docker
3. Redis
4. Multer
5. Express
6. MongoDB
7. DateFNS
8. Sentry
9. PostGree
10. NodeMailer

## Techs Dev Usage

1. Nodemon
2. Sucrase
3. ESLint
4. Editor Config
5. Prettier

## Docker Commands

MongoDB - docker run --name mongobarber -p 27017:27017 -d -t mongo
Postgress - docker run --name gobarber -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
Redis - docker run --name redisbarber -p 6379:6379 -d -t redis:alpine
