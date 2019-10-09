# type-graphql-app

generate jwt secret

```js
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

add to .env file

```env
JWT_SECRET=your_secret_key
```

start server

```
npm start
```
