const express = require("express");
const doctors = require("./doctors.js");
const pacients = require("./pacients.js");
const prescriptions = require("./prescriptions.js");
const appointments = require("./appointments.js");

const PORT = process.env.PORT || 8008;

const app = express();

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("../swagger.json");

app.use(
  '/api/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.json());
app.use('/', doctors);
app.use('/', pacients);
app.use('/', prescriptions);
app.use('/', appointments);

// const dotenv = require('dotenv').config()

// const app = require('./app')