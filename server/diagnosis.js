const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/diagnosis", (req, res) => {
  getAllDiagnosis(res);
});

router.get("/diagnosis/:id", (req, res) => {
  let id = req.params.id;
  getDiagnosisById(res, id);
});

router.delete("/diagnosis-delete/:id", (req, res) => {
  const id = req.params.id;
  deleteDiagnosisById(res, id);
});

router.put("/diagnosis-create", (req, res) => {
  createDiagnosis(res, req.body);
});

router.patch("/diagnosis-update/:id", (req, res) => {
  const id = req.params.id;
  updateDiagnosisById(res, req.body, id);
});

async function getAllDiagnosis(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM diagnostic`,
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

async function getDiagnosisById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT * FROM diagnostic WHERE id_diagnostic = : id`,
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

async function deleteDiagnosisById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM diagnostic WHERE id_diagnostic = :id`,
      [id],
    );
    connection.commit();
    res.send('Diagnosis removed');
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

async function createDiagnosis(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");
    
    let values = Object.values(body);
    const result = await connection.execute(
      `INSERT INTO diagnostic(denumire_diagnostic) VALUES(:1)`,
      values,
    );
    connection.commit();
    res.send('Diagnosis added');
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

async function updateDiagnosisById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE diagnostic
           SET denumire_diagnostic = :1
           WHERE id_diagnostic = :2`,
      values,
    );
    connection.commit();
    res.send('Diagnosis updated');
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