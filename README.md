Wraps GraphiQL providing support for bearer token and arbitrary URL. Great for testing GraphQL services secured with OAuth2.0

## Running with Docker

`docker run -it -p3000:3000 jonwood/auth-graphiql`

The service will now be listening on `http://localhost:3000`. To run on a
different port change the first 3000 in the command, for example
`docker run -it -p3001:3000 jonwood/auth-graphiql` will listen on port
3001 instead.

#### Install dependencies
```
npm install
```


#### Run
```
npm start
```

#### Injoy

Provide URL and token. Introspection info will be fetched on each URL update.
