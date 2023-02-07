const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/doctors", (req, res) => {
  getAllDoctors(req, res);
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
  createDoctor(res, req.body);
});

router.patch("/doctor-update/:id", (req, res) => {
  const id = req.params.id;
  updateDoctorById(res, req.body, id);
});

async function getAllDoctors(req, res) {
  let connection;
  let pageSize = req.query.pageSize ?? 10;
  let pageNr = req.query.pageNr ?? 1;

  pageSize = parseInt(pageSize);
  pageNr = parseInt(pageNr);

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const queryString = `SELECT d.id_doctor, d.nume, d.data_angajare, null, null FROM doctor d`
    // console.log(queryString);
    const result = await connection.execute(
      // `SELECT d.nume, d.data_angajare, h.nume_spital, s.nume_specializare FROM doctor d, specializare s, spital h
      //     WHERE d.id_specializare = s.id_specializare AND d.id_spital = h.id_spital`,
      queryString,
    );
    let paginatedResult = [];
    result.rows.forEach((row, index) => {
      // console.log(index, row);
      if (index >= ( (pageNr - 1) * pageSize) && index < ( pageNr * pageSize))  {
        paginatedResult.push(row);
      }
    });
    return res.json(paginatedResult);
  } catch (err) {
    console.error('ERR START: ', err, ' err end: ');
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
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
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
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
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
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
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

  console.log("createDoctor");

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    console.log(values);
    let query = `INSERT INTO doctor (nume, data_angajare) VALUES('${values[2]}', TO_DATE('${values[3]}','YYYY-MM-DD'))`;
    console.log(query);
    const result = await connection.execute(
      query
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
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    /*
    {
  "id_spital": 0,
  "id_specializare": 0,
  "nume": "string",
  "data_angajare": "string"
}
     */
    let query = 'UPDATE doctor SET ';


    if (body.hasOwnProperty('nume')) {
      query += `nume = '${body.nume}'`;
    }
    if (body.hasOwnProperty('data_angajare')) {
      query += `data_angajare = TO_DATE(${body.data_angajare},'YYYY-MM-DD')`;
    }

    if (body.hasOwnProperty('id_spital')) {
      query += `, id_spital = ${body.id_spital}`;
    }
    if (body.hasOwnProperty('id_specializare')) {
      query += `, id_specializare = ${body.id_specializare}`;
    }

    query += ` WHERE id_doctor = ${id}`;

    console.log(query);

    const result = await connection.execute(
        query
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