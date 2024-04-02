FROM node:20.10.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json package-lock.json nodemon.json tsconfig.json ./
RUN npm install
COPY src/ ./src/
COPY assets/ ./assets/
EXPOSE 8080
CMD [ "npm", "start"]
