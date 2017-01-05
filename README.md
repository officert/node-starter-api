This is a starter project for a Node.js API. Out of the box you get authentication, service and data-access layers, unit and integrations tests, users accounts, and emails using Postmark.

This project is built on:

Express
MongoDB
Mongoose
JWT
Oauth2
and lots more

## Getting Started

1) npm install
```
npm install
```

2) Setup symlinks - this will create symlinks from `node_modules` to various folders within the `src` directory to make `require`ing modules easier (no relative paths).
```
make post-install
```

3) Add your configuration settings

You'll need to enter your own configuration settings for things like your Mongo DB name, JWT secret and Postmark credentials.

Search for the string `xxxx-replaceme-xxxx` for any config variables that you need to replace.


4) Start the app
```
make dev
```


#### Running Tests

Unit Tests:
```
make test-unit
```

Integration Tests:
```
make test-int
```
