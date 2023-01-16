const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const cors = require("cors");
const doctors = require("./doctors.js");
const pacients = require("./pacients.js");
const prescriptions = require("./prescriptions.js");
const appointments = require("./appointments.js");
const users = require("./routes/users.js");

const PORT = process.env.PORT || 8008;

const app = express();

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("../swagger.json");

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose.set('strictQuery', true);

const connectWithRetry = () => {
  mongoose.connect(mongoUrl)
      .then(() => console.log("Successfully connected to Mongo"))
      .catch((e) => {
          console.log("NOT successfully connected to Mongo, retrying...")
          setTimeout(connectWithRetry, 5000);
      });
}
connectWithRetry();

const redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
  legacyMode: true,
});
redisClient.connect().then(() => { console.log('Successfully connected to Redis') })

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: true, // if true prevent client side JS from reading the cookie 
      maxAge: 1000 * 30 // 1000 * 60 * 10 // session max age in miliseconds
  }
}));

app.use(express.json());
app.enable("trust proxy");
app.use(cors({}));
app.use('/', doctors);
app.use('/', pacients);
app.use('/', prescriptions);
app.use('/', appointments);
app.use('/users', users);

// const dotenv = require('dotenv').config()

// const app = require('./app')

//
// app.listen(8008, () => {
//     console.log('app is running on port 8008');
// });