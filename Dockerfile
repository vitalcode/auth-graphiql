FROM mhart/alpine-node:8.6.0 as BUILDER

WORKDIR /app
ADD package.json /app/
RUN npm install

ADD ./src /app/src
ADD ./public /app/public
RUN npm run build

FROM mhart/alpine-node:8.6.0
RUN npm install -g http-server
COPY --from=BUILDER /app/build /app/build

WORKDIR /app/build
EXPOSE 3000
CMD hs -p 3000
