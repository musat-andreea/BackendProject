const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/procedures", (req, res) => {
   getAllProcedures(res);
});

router.get("/procedure/:id", (req, res) => {
    let id = req.params.id;
    getProcedureById(res, id);
 });

router.delete("/procedure-delete/:id", (req, res) => {
    const id = req.params.id;
    deleteProcedureById(res, id);
 });

router.put("/procedure-create", (req, res) => {
    createProcedure(res, req.body);
 });

router.patch("/procedure-update/:id", (req, res) => {
    const id = req.params.id;
    updateProcedureById(res, req.body, id);
 });

async function getAllProcedures(res) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT nume_procedura, informatii FROM procedura`, 
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

async function getProcedureById(res, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT nume_procedura, informatii FROM procedura
           WHERE id_procedura = :id`, 
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

async function deleteProcedureById(res, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `DELETE FROM procedura WHERE id_procedura = :id`, 
          [id],
      );
      connection.commit();
      res.send('Procedure removed');
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

async function createProcedure(res, body) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");
  
      const recordNo = await connection.execute(
        `SELECT MAX(id_procedura) FROM procedura`, 
      );
      let values = Object.values(body);
      values.unshift(recordNo.rows[0][0] + 1);
      const result = await connection.execute(
          `INSERT INTO procedura VALUES(:1, :2, :3)`, 
          values,
      );
      connection.commit();
      res.send('Procedure added');
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

async function updateProcedureById(res, body, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString});
      console.log("Successfully connected to Oracle Database");

      let values = Object.values(body);
      values.push(id);
      const result = await connection.execute(
          `UPDATE procedura
           SET nume_procedura = :1, informatii = :2
           WHERE id_procedura = :3`, 
           values,
      );
      connection.commit();
      res.send('Procedure updated');
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