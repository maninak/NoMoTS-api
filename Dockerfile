# create a file named Dockerfile
FROM node:8

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm i --only=production && npm build

COPY . /app

EXPOSE 8080

CMD ["npm", "start"]