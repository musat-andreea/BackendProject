const oracledb = require('oracledb');
const router = require('express').Router();
var credentials = require('./dbConnection.js');

router.get("/addresses", (req, res) => {
  getAllAddresses(res);
});

router.get("/addresses/:id", (req, res) => {
  let id = req.params.id;
  getAddressesById(res, id);
});

router.delete("/address-delete/:id", (req, res) => {
  const id = req.params.id;
  deleteAddressById(res, id);
});

router.put("/address-create", (req, res) => {
  createAddress(res, req.body);
});

router.patch("/address-update/:id", (req, res) => {
  const id = req.params.id;
  updateAddressById(res, req.body, id);
});

async function getAllAddresses(res) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT a.strada, a.cod_postal, o.nume_oras, (SELECT nume_judet FROM judet where id_judet = o.id_judet) FROM adresa a, oras o
      WHERE a.id_oras = o.id_oras`,
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

async function getAddressesById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `SELECT a.strada, a.cod_postal, o.nume_oras, (SELECT nume_judet FROM judet where id_judet = o.id_judet) FROM adresa a, oras o
      WHERE a.id_oras = o.id_oras AND id_adresa = : id`,
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

async function deleteAddressById(res, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    const result = await connection.execute(
      `DELETE FROM adresa WHERE id_adresa = :id`,
      [id],
    );
    connection.commit();
    res.send('Adress removed');
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

async function createAddress(res, body) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    const result = await connection.execute(
      `INSERT INTO adresa(id_oras, strada, cod_postal) VALUES(:1, :2, :3)`,
      values,
    );
    connection.commit();
    res.send('Address added');
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

async function updateAddressById(res, body, id) {
  let connection;

  try {
    connection = await oracledb.getConnection({ user: credentials.username, password: credentials.password, connectionString: credentials.connectionString, privilege: credentials.privilege })
    console.log("Successfully connected to Oracle Database");

    let values = Object.values(body);
    values.push(id);
    const result = await connection.execute(
      `UPDATE adresa
           SET id_oras = :1, strada = :2, cod_postal = :3
           WHERE id_adresa = :4`,
      values,
    );
    connection.commit();
    res.send('Address updated');
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