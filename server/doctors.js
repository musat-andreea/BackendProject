const oracledb = require('oracledb');
const router = require('express').Router();

router.get("/doctors", (req, res) => {
   getAllDoctors(res);
});

router.get("/doctors/:name", (req, res) => {
    let name = req.params.name;
    console.log(name);
    getDoctorsByLastName(res, name);
 });

router.get("/doctor/:id", (req, res) => {
    let id = req.params.id;
    getDoctorById(res, id);
 });

router.delete("/doctor-delete/:id", (req, res) => {
    const id = req.params.id;
    deleteDoctorById(res, id);
 });

router.put("/doctor-create", (req, res) => {
  console.log(req.body);
    createDoctor(res, req.body);
 });

router.patch("/doctor-update/:id", (req, res) => {
    const id = req.params.id;
    updateDoctorById(res, req.body, id);
 });

async function getAllDoctors(res) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: "c##integration", password: "03121998Alina", connectionString: "localhost/orcl"});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT d.nume, d.data_angajare, h.nume_spital, s.nume_specializare FROM doctor d, specializare s, spital h
          WHERE d.id_specializare = s.id_specializare AND d.id_spital = h.id_spital`, 
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

async function getDoctorsByLastName(res, name) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: "c##integration", password: "03121998Alina", connectionString: "localhost/orcl"});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT d.nume, d.data_angajare, h.nume_spital, s.nume_specializare FROM doctor d, specializare s, spital h
          WHERE d.id_specializare = s.id_specializare AND d.id_spital = h.id_spital AND nume = :name`, 
          [name],
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

async function getDoctorById(res, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: "c##integration", password: "03121998Alina", connectionString: "localhost/orcl"});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `SELECT d.nume, d.data_angajare, h.nume_spital, s.nume_specializare FROM doctor d, specializare s, spital h
          WHERE d.id_specializare = s.id_specializare AND d.id_spital = h.id_spital AND d.id_doctor = :id`, 
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

async function deleteDoctorById(res, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: "c##integration", password: "03121998Alina", connectionString: "localhost/orcl"});
      console.log("Successfully connected to Oracle Database");
  
      const result = await connection.execute(
          `DELETE FROM doctor WHERE id_doctor = :id`, 
          [id],
      );
      connection.commit();
      res.send('Doctor removed');
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

async function createDoctor(res, body) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: "c##integration", password: "03121998Alina", connectionString: "localhost/orcl"});
      console.log("Successfully connected to Oracle Database");
  
      const recordNo = await connection.execute(
        `SELECT MAX(id_doctor) FROM doctor`, 
      );
      let values = Object.values(body);
      values.unshift(recordNo.rows[0][0] + 1);
      const result = await connection.execute(
          `INSERT INTO doctor VALUES(:1, :2, :3, :4, TO_DATE(:5,'YYYY-MM-DD'))`, 
          values,
      );
      connection.commit();
      res.send('Doctor added');
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

async function updateDoctorById(res, body, id) {
    let connection;
  
    try {
      connection = await oracledb.getConnection({ user: "c##integration", password: "03121998Alina", connectionString: "localhost/orcl"});
      console.log("Successfully connected to Oracle Database");

      let values = Object.values(body);
      values.push(id);
      const result = await connection.execute(
          `UPDATE doctor
           SET id_spital = :1, id_specializare = :2, nume = :3, data_angajare = TO_DATE(:4,'YYYY-MM-DD')
           WHERE id_doctor = :5`, 
           values,
      );
      connection.commit();
      res.send('Doctor updated');
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