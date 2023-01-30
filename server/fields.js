const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/fields", (req, res) => {
  getAllFields(res);
});

router.get("/fields/:id", (req, res) => {
  let id = req.params.id;
  getFieldsById(res, id);
});

router.delete("/field-delete/:id", (req, res) => {
  const id = req.params.id;
  deleteFieldById(res, id);
});

router.put("/field-create", (req, res) => {
  createField(res, req.body);
});

router.patch("/field-update/:id", (req, res) => {
  const id = req.params.id;
  updateFieldById(res, req.body, id);
});

async function getAllFields(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM specializare`,
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

async function getFieldsById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM specializare WHERE id_Specializare = :id`,
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

async function deleteFieldById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM specializare WHERE id_specializare = :id`,
      [id],
    );
    connection.commit();
    res.send('Field removed');
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

async function createField(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const recordNo = await connection.execute(
        `SELECT MAX(id_specializare) FROM specializare`,
    );
    let values = Object.values(body);
    values.unshift(recordNo.rows[0][0] + 1);
    console.log(values);
    const result = await connection.execute(
      `INSERT INTO specializare(id_specializare, nume_specializare, categorie) VALUES(:1, :2, :3)`,
      values,
    );
    connection.commit();
    res.send('Field added');
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

async function updateFieldById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE specializare
           SET nume_specializare = :1, categorie = :2
           WHERE id_specializare = :4`,
      values,
    );
    connection.commit();
    res.send('Field updated');
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