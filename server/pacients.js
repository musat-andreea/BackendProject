const router = require('express').Router();
const oracledb = require('oracledb');
var credentials = require('./dbConnection.js');

router.get("/pacients", (req, res) => {
  getAllPacients(res);
});

router.get("/pacients/:lastName", (req, res) => {
  let lastName = req.params.lastName;
  getPacientsByLastName(res, lastName);
});

router.get("/pacient/:id", (req, res) => {
  let id = req.params.id;
  getPacientById(res, id);
});

router.delete("/pacient-delete/:id", (req, res) => {
  const id = req.params.id;
  deletePacientById(res, id);
});

router.put("/pacient-create", (req, res) => {
  createPacient(res, req.body);
});

router.patch("/pacient-update/:id", (req, res) => {
  const id = req.params.id;
  updatePacientById(res, req.body, id);
});

async function getAllPacients(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM pacient`,
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

async function getPacientsByLastName(res, lastName) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM pacient WHERE nume = :lastName`,
      [lastName],
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

async function getPacientById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM pacient WHERE id_pacient = :id`,
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

async function deletePacientById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM pacient WHERE id_pacient = :id`,
      [id],
    );
    connection.commit();
    res.send('Pacient removed');
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

async function createPacient(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const recordNo = await connection.execute(
      `SELECT MAX(id_pacient) FROM pacient`,
    );
    let values = Object.values(body);
    values.unshift(recordNo.rows[0][0] + 1);

    const result = await connection.execute(
      `INSERT INTO pacient VALUES(:1, :2, :3, TO_DATE(:4,'YYYY-MM-DD'), :5, :6)`,
      values,
    );
    connection.commit();
    res.send('Pacient added');
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

async function updatePacientById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE pacient
           SET nume = :1, prenume = :2, data_nastere = TO_DATE(:3,'YYYY-MM-DD'), email = :4, telefon = :5
           WHERE id_pacient = :6`,
      values,
    );
    connection.commit();
    res.send('Pacient updated');
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