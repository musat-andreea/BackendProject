const oracledb = require('oracledb');

module.exports = {
    username: 'SYS',
    password: 'oracle',
    connectionString: 'oracle:1521/orcl',
    privilege: oracledb.SYSDBA,
};