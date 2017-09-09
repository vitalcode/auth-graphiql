FROM mhart/alpine-node:8.4.0

WORKDIR /app
ADD package.json /app/
RUN npm install

ADD . /app

EXPOSE 3000
CMD npm start
