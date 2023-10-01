#stage 1 build the code
FROM node:18.12-alpine As builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

#my unit tests are not working so please comment the stage 2 to run docker container

#stage 2 run test
FROM builder as test

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
COPY --from=builder /usr/src/app/dist ./dist

RUN npm run test



# stage 3 run build
FROM test as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY --from=test /usr/src/app/dist ./dist

COPY .env ./dist/

CMD ["node", "dist/main"]