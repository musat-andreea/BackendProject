const express = require("express");
const doctors = require("./doctors.js");
const pacients = require("./pacients.js");
const prescriptions = require("./prescriptions.js");
const appointments = require("./appointments.js");
const meds = require("./meds.js");
const procedures = require("./procedures.js");
const app_procedures = require("./appointment_procedure.js");
const prescription_med = require("./prescription_med.js");
const diagnosis = require("./diagnosis.js");
const counties = require("./counties.js");
const cities = require("./cities.js");
const addresses = require("./addresses.js");
const hospitals = require("./hospitals.js");
const fields = require("./fields.js");

const PORT = process.env.PORT || 8008;

const app = express();

app.use(express.json());
app.use('/', doctors);
app.use('/', pacients);
app.use('/', prescriptions);
app.use('/', appointments);
app.use('/', meds);
app.use('/', procedures);
app.use('/', app_procedures);
app.use('/', prescription_med);
app.use('/', diagnosis);
app.use('/', counties);
app.use('/', cities);
app.use('/', addresses);
app.use('/', hospitals);
app.use('/', fields);

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

// const dotenv = require('dotenv').config()

// const app = require('./app')

//
// app.listen(8008, () => {
//     console.log('app is running on port 8008');
// });