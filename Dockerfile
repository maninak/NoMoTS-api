# create a file named Dockerfile
FROM node:8

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm i  && npm build

COPY . /app

EXPOSE 8080
EXPOSE 39262

CMD ["npm", "start"]