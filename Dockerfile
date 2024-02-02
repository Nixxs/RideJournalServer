FROM node:19-alpine

ARG NODE_ENV
ARG DB_NAME
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_HOST
ARG DB_PORT
ARG PORT

ENV NODE_ENV=$NODE_ENV
ENV DB_NAME=$DB_NAME
ENV DB_USERNAME=$DB_USERNAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_HOST=$DB_HOST
ENV DB_PORT=$DB_PORT
ENV PORT=$PORT

WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000

CMD [ "npm", "run", "start-dev" ]