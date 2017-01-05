This is a starter project for a Node.js API. Out of the box you get authentication, service and data-access layers, unit and integrations tests, users accounts, and emails using Postmark.

This project is built on:

- Express
- MongoDB
- Mongoose
- JWT
- Oauth2 and lots more

# Getting Started

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

## Running Tests

Unit Tests:

```
make test-unit
```

Integration Tests:

```
make test-int
```

## Endpoints

1) Logging in/registering for an account

```
POST /auth/login

body : {
  identityProvider : GITHUB|GOOGLE,
  accessToken : 'xxx' //access token you've received from the Oauth2 identity provider
}
```

This will return an object:

```
{
  token : 'xxxxx' //JWT that can now be used to make authenticated requests to your API
}
```

2) Get current authenticated users

```
GET /users/me
```

> NOTE : when making authenticated requests your client will need to pass the header:<br>
> ``` x-access-token : 'xxxx' //your JWT token ```

This will return the current user:

```
{
  id : '12345',
  firstName: 'John',
  lastName: 'Doe',
  email: 'jdoe@gmail.com',
  profilePicture: 'https://google.com/johndoe.jpg'
}
```
