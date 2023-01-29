const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/cities", (req, res) => {
  getAllCities(res);
});

router.get("/cities/:id", (req, res) => {
  let id = req.params.id;
  getCitiesById(res, id);
});

router.delete("/city-delete/:id", (req, res) => {
  const id = req.params.id;
  deleteCityById(res, id);
});

router.put("/city-create", (req, res) => {
  createCity(res, req.body);
});

router.patch("/city-update/:id", (req, res) => {
  const id = req.params.id;
  updateCityById(res, req.body, id);
});

async function getAllCities(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM oras`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getCitiesById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM oras WHERE id_oras = : id`,
      [id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function deleteCityById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM oras WHERE id_oras = :id`,
      [id],
    );
    connection.commit();
    res.send('City removed');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function createCity(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    const result = await connection.execute(
      `INSERT INTO oras(id_judet, nume_oras) VALUES(:1, :2)`,
      values,
    );
    connection.commit();
    res.send('County added');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function updateCityById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE oras
           SET id_judet = :1, nume_oras = :2
           WHERE id_oras = :3`,
      values,
    );
    connection.commit();
    res.send('City updated');
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports = router;