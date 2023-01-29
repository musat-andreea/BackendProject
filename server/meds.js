const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/meds", (req, res) => {
   getAllMeds(res);
});

router.get("/med/:id", (req, res) => {
    let id = req.params.id;
    getMedById(res, id);
 });

router.delete("/med-delete/:id", (req, res) => {
    const id = req.params.id;
    deleteMedById(res, id);
 });

router.put("/med-create", (req, res) => {
    createMed(res, req.body);
 });

router.patch("/med-update/:id", (req, res) => {
    const id = req.params.id;
    updateMedById(res, req.body, id);
 });

async function getAllMeds(res) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT nume_medicament, pret FROM medicament`, 
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

async function getMedById(res, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT nume_medicament, pret FROM medicament
           WHERE id_medicament = :id`, 
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

async function deleteMedById(res, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `DELETE FROM medicament WHERE id_medicament = :id`, 
          [id],
      );
      connection.commit();
      res.send('Med removed');
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

async function createMed(res, body) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      let values = Object.values(body);
      const result = await connection.execute(
          `INSERT INTO medicament VALUES(:1, :2)`, 
          values,
      );
      connection.commit();
      res.send('Med added');
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

async function updateMedById(res, body, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");

      let values = Object.values(body);
      values.push(id);
      const result = await connection.execute(
          `UPDATE medicament
           SET nume_medicament = :1, pret = :2
           WHERE id_medicament = :3`, 
           values,
      );
      connection.commit();
      res.send('Med updated');
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