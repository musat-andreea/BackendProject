const express = require("express");
const mongoose = require("mongoose");
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

const { PORT, MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config");
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
mongoose.set('strictQuery', true);

const connectWithRetry = () => {
  mongoose.connect(mongoUrl)
      .then(() => console.log("successfully connected to Mongo"))
      .catch((e) => {
          console.log("NOT successfully connected to Mongo, retrying...")
          setTimeout(connectWithRetry, 5000);
      });
}
connectWithRetry();

app.use(express.json());
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