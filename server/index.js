const express = require("express");

const PORT = process.env.PORT || 8008;

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

const swaggerUi = require("swagger-ui-express");
swaggerDocument = require("../swagger.json");

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);
//
// app.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });

// const dotenv = require('dotenv').config()

// const app = require('./app')

//
// app.listen(8008, () => {
//     console.log('app is running on port 8008');
// });
