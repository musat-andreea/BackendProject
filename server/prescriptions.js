const router = require('express').Router();
const oracledb = require('oracledb');
var credentials = require('./dbConnection.js');

router.get("/prescriptions", (req, res) => {
  getAllPrescriptions(res);
});

router.get("/prescriptions/:date", (req, res) => {
  let date = req.params.date;
  getPrescriptionsByDate(res, date);
});

router.get("/prescription/:id", (req, res) => {
  let id = req.params.id;
  getPrescriptionById(res, id);
});

router.delete("/prescription-delete/:id", (req, res) => {
  const id = req.params.id;
  deletePrescriptionById(res, id);
});

router.put("/prescription-create", (req, res) => {
  createPrescription(res, req.body);
});

router.patch("/prescription-update/:id", (req, res) => {
  const id = req.params.id;
  updatePrescriptionById(res, req.body, id);
});

async function getAllPrescriptions(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM reteta`,
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

async function getPrescriptionsByDate(res, creationDate) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");
    const result = await connection.execute(
      `SELECT * FROM reteta WHERE data_reteta = TO_DATE(:creationDate,'YYYY-MM-DD')`,
      [creationDate],
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

async function getPrescriptionById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM reteta WHERE id_reteta = :id`,
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

async function deletePrescriptionById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM reteta WHERE id_reteta = :id`,
      [id],
    );
    connection.commit();
    res.send('Prescription removed');
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

async function createPrescription(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const recordNo = await connection.execute(
      `SELECT MAX(id_reteta) FROM reteta`,
    );
    let values = Object.values(body);
    values.unshift(recordNo.rows[0][0] + 1);

    const result = await connection.execute(
      `INSERT INTO reteta VALUES(:1, TO_DATE(:2,'YYYY-MM-DD'), :3)`,
      values,
    );
    connection.commit();
    res.send('Prescription added');
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

async function updatePrescriptionById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE reteta
           SET data_reteta = TO_DATE(:1,'YYYY-MM-DD'), descriere = :2
           WHERE id_reteta = :3`,
      values,
    );
    connection.commit();
    res.send('Prescription updated');
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