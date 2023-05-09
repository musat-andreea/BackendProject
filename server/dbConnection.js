
const oracledb = require('oracledb');

module.exports = {
    username: 'BDD_CENTRALIZAT1',
    password: 'distribuit',
    connectionString: 'localhost:1521/orcl11pdb',
    privilege: oracledb.default,
};
//const oracledb = require('oracledb');
//
// module.exports = {
//     username: 'AndreeaM',
//     password: 'ANDREEAM',
//     connectionString: 'oracle-105547-0.cloudclusters.net:10197/xe',
//     //database: 'Cloud'
//     //privilege: oracledb.SYSDBA,
// };