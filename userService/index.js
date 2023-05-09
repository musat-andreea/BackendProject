const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const redis = require("redis");
const RedisStore = require("connect-redis")(session);
const users = require("./routes/users.js");

const app = express();

const { APPLICATION_PORT, MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("../config/users-config.js");

app.listen(APPLICATION_PORT, () => {
  console.log(`User service listening on ${APPLICATION_PORT}`);
});

// Comment mongo config if running node app without docker integration
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose.set('strictQuery', true);

const connectWithRetry = () => {
  mongoose.connect(mongoUrl)
    .then(() => console.log("Successfully connected to Mongo"))
    .catch((e) => {
      console.log(e);
      console.log("NOT successfully connected to Mongo, retrying...")
      setTimeout(connectWithRetry, 5000);
    });
}
connectWithRetry();

// Comment redis config if running node app without docker integration
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
app.use('/api/users', users);