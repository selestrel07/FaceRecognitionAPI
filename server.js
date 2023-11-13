const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
//controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const ENV = process.env;

const db = knex({
    client: 'pg',
    connection: {
      host : ENV.DATABASE_URL,
      port : ENV.DATABASE_PORT,
      user : ENV.DATABASE_USER,
      password : ENV.DATABASE_USER_PASSWORD,
      database : ENV.DATABASE_NAME
    }
  });

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApiCall());

const PORT = ENV.PORT;
app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});