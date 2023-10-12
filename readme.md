# SHOUTOUT - PROJECT

This shoutout project is a application allow user to post / delete short messages to their dashboard

- Runtime: <b>Node.js 18.12.1</b>

- Packages manager: <b>Yarn 1.22.4</b>

## APP / UI
### Overview
- Framework: ReactJS / Vite
- Languages: Typescript, TSX, CSS
- State management: react-query
- HTTP api client: axios
- Unit test: react-testing-library, js-dom, vitest, axios-mock-adapter

### Development

1. In the root directory
2. Open ./app folder
3. create .env file
4. copy .example.env content -> .env

```
# in the root directory

cd app

yarn install  # npm install

yarn dev   
```
Open http://localhost:5173/

Starting to register a new account with custom email and password

### Tests
```
yarn test
```

## BACKEND / API
### Overview
- Framework: Nestjs
- Language: Typescript
- Database: MongoDB (Atlas)
- HTTP Architecture: RESTful
- API document: Open API (Swagger - available at: http://localhost:3000/api)
- Unit test: Jest, mongo-server-in-memory

### Development

1. In the root directory
2. Open ./api folder
3. create .env file
4. copy .example.env content -> .env

```
# in the root directory

cd api

yarn install  # npm install

yarn dev   
```
Open http://localhost:3000

### Tests
```
yarn test
```

## CI / CD

Whenever the branch main is changed, it will trigger the testing and deployment flow.

Live version available
- App: http://139.180.156.22/
- Api: http://139.180.156.22:3000/