const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/appointments_procedures", (req, res) => {
   getAllAppointmentProcedures(res);
});

router.delete("/appointment_procedure-delete/:id_app/:id_procedure", (req, res) => {
    const id_appointment = req.params.id_app;
    const id_procedure = req.params.id_procedure;
    deleteAppointmentProcedureById(res, id_appointment, id_procedure);
 });

router.put("/appointment_procedure-create", (req, res) => {
    createAppointmentProcedure(res, req.body);
 });

async function getAllAppointmentProcedures(res) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT id_consult, id_procedura FROM consult_procedura`, 
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


async function deleteAppointmentProcedureById(res, id_appointment, id_procedure) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `DELETE FROM consult_procedura WHERE id_procedura = :id_procedure AND id_consult = :id_appointment`, 
          [id_procedure, id_appointment],
      );
      connection.commit();
      res.send('Appointment Procedure removed');
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

async function createAppointmentProcedure(res, body) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");

      let values = Object.values(body);
      const result = await connection.execute(
          `INSERT INTO consult_procedura VALUES(:1, :2)`, 
          values,
      );
      connection.commit();
      res.send('Appointment Procedure added');
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