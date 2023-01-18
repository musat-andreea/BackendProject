const router = require('express').Router();
const oracledb = require('oracledb');
var credentials = require('./dbConnection.js');

router.get("/appointments", (req, res) => {
  getAllAppointments(res);
});

router.get("/appointment/:id", (req, res) => {
  let id = req.params.id;
  getAppointmentById(res, id);
});

router.delete("/appointment-delete/:id", (req, res) => {
  const id = req.params.id;
  deleteAppointmentById(res, id);
});

router.put("/appointment-create", (req, res) => {
  createAppointment(res, req.body);
});

router.patch("/appointment-update/:id", (req, res) => {
  const id = req.params.id;
  updateAppointmentById(res, req.body, id);
});

async function getAllAppointments(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT id_consult, p.nume, p.prenume, d.nume_diagnostic_initial, do.nume,  c.pret, c.data_consult, c.discount, c.detalii
          FROM consult c, pacient p, diagnostic d, doctor do
          WHERE c.id_pacient = p.id_pacient
          AND c.id_diagnostic = d.id_diagnostic
          AND c.id_doctor = do.id_doctor`,
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

async function getAppointmentById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT id_consult, p.nume, p.prenume, d.nume_diagnostic_initial, do.nume,  c.pret, c.data_consult, c.discount, c.detalii
          FROM consult c, pacient p, diagnostic d, doctor do
          WHERE c.id_pacient = p.id_pacient
          AND c.id_diagnostic = d.id_diagnostic
          AND c.id_doctor = do.id_doctor AND c.id_consult = :id`,
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

async function deleteAppointmentById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM consult WHERE id_consult = :id`,
      [id],
    );
    connection.commit();
    res.send('Appointment removed');
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

async function createAppointment(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const recordNo = await connection.execute(
      `SELECT MAX(id_consult) FROM consult`,
    );
    let values = Object.values(body);
    values.unshift(recordNo.rows[0][0] + 1);
    const result = await connection.execute(
      `INSERT INTO consult VALUES(:1, :2, :3, :4, :5, :6, TO_DATE(:7,'YYYY-MM-DD'), :8, :9)`,
      values,
    );
    connection.commit();
    res.send('Appointment added');
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

async function updateAppointmentById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString });
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE consult
           SET pret = :1, discount = :2, data_consult = TO_DATE(:3,'YYYY-MM-DD'), detalii = :4, id_doctor = :5
           WHERE id_consult = :6`,
      values,
    );
    connection.commit();
    res.send('Appointment updated');
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