# CRUD-api

## Clone repository

```bash
git clone https://github.com/RVitaly1978/crud-api.git
```

## Checkout to `develop` branch

```bash
git checkout develop
```

## Install dependencies

Node.js required version is **20 LTS**

```bash
npm install
```

## Create a `.env` file (see `.env.example`) in the root directory with the following content:

```
PORT=4000
```

## Build production application

```bash
npm run build
```

## Run application

```bash
# in develop mode
npm run start:dev

# in production mode
npm run start:prod

# in multi instances mode
npm run start:multi
```

## Test application

***Note:*** Terminate all your processes in split terminals before run test process

```bash
npm run test
npm run test:verbose
```

## Endpoints available

```
GET     http://localhost:4000/api/users
POST    http://localhost:4000/api/users
GET     http://localhost:4000/api/users/{id}
PUT     http://localhost:4000/api/users/{id}
DELETE  http://localhost:4000/api/users/{id}
```
