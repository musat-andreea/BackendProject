const router = require('express').Router();
const oracledb = require('oracledb');
var credentials = require('./dbConnection.js');

router.get("/pacients", (req, res) => {
  getAllPacients(req, res);
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

async function getAllPacients(req, res) {
  let connection;
  let pageSize = req.query.pageSize ?? 10;
  let pageNr = req.query.pageNr ?? 1;

  pageSize = parseInt(pageSize);
  pageNr = parseInt(pageNr);

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    // const queryString = `SELECT d.nume, d.data_angajare, null, null FROM pacient p`
    // console.log(queryString);
    const result = await connection.execute(
      `SELECT * FROM pacient ORDER BY ID_PACIENT DESC`,
    );
    let paginatedResult = [];
    result.rows.forEach((row, index) => {
      // console.log(index, row);
      if (index >= ( (pageNr - 1) * pageSize) && index < ( pageNr * pageSize))  {
        paginatedResult.push(row);
      }
    })
    res.json(paginatedResult);
   // res.json(result.rows);
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

    let values = Object.values(body);

    console.log(values);
    const result = await connection.execute(
      `INSERT INTO pacient(nume, prenume, data_nastere, telefon, email, sex) VALUES(:2, :1, TO_DATE(:3,'YYYY-MM-DD'), :4, :5, :6)`,
      values,
    );
    console.log(result);
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
    let query = 'UPDATE pacient SET ';


    if (body.hasOwnProperty('nume')) {
      query += `nume = '${body.nume}'`;
    }
    if (body.hasOwnProperty('prenume') && body['prenume'] != '') {
      query += `, prenume = '${body.prenume}'`;
    }
    if (body.hasOwnProperty('email') && body['email'] != '') {
      query += `, email = '${body.email}'`;
    }
    if (body.hasOwnProperty('telefon') && body['telefon'] != '') {
      query += `, telefon = '${body.telefon}'`;
    }

    query += ` WHERE id_pacient = ${id}`;

    console.log(query);
    const result = await connection.execute(
        query
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