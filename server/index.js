const express = require("express");
const doctors = require("./doctors.js");
const pacients = require("./pacients.js");
const prescriptions = require("./prescriptions.js");
const appointments = require("./appointments.js");
const checkUserLoggedin = require("./middleware/authMiddleware.js");

const PORT = process.env.PORT || 3002;

const app = express();

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("../swagger.json");

app.use(
  '/api/api-docs',
  checkUserLoggedin,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.use(express.json());
app.use('/api/', doctors);
app.use('/api/', pacients);
app.use('/api/', prescriptions);
app.use('/api/', appointments);


// try {
//   const oracledb = require('oracledb');
//   oracledb.getConnection({ user: "SYS", password: "oracle", connectionString: "oracle:1521/xe" })
//     .then((connection) => {
//       connection.close().then(() => console.log('Connection close'));
//       console.log("Successfully connected to Oracle Database")
//     }
//     );
// } catch (err) {
//   console.error(err);
// }

// const dotenv = require('dotenv').config()

// const app = require('./app')