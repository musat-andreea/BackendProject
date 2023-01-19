const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/prescriptions_meds", (req, res) => {
   getAllPrescriptionMeds(res);
});

router.delete("/prescription_med-delete/:id_prescription/:id_med", (req, res) => {
    const id_prescription = req.params.id_prescription;
    const id_med= req.params.id_med;
    deletePrescriptionMedById(res, id_prescription, id_med);
 });

router.put("/prescription_med-create", (req, res) => {
    createPrescriptionMed(res, req.body);
 });

async function getAllPrescriptionMeds(res) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT id_reteta, id_medicament FROM reteta_medicament`, 
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


async function deletePrescriptionMedById(res, id_prescription, id_med) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `DELETE FROM reteta_medicament WHERE id_reteta = :id_prescription AND id_medicament = :id_med`, 
          [id_prescription, id_med],
      );
      connection.commit();
      res.send('Prescription Med removed');
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

async function createPrescriptionMed(res, body) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");

      let values = Object.values(body);
      const result = await connection.execute(
          `INSERT INTO reteta_medicament VALUES(:1, :2)`, 
          values,
      );
      connection.commit();
      res.send('Prescription Med added');
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