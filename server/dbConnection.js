
// const oracledb = require('oracledb');
//
// module.exports = {
//     username: 'SYS',
//     password: 'oracle',
//     connectionString: 'oracle:1521/orcl',
//     privilege: oracledb.SYSDBA,
// };
const oracledb = require('oracledb');

module.exports = {
    username: 'AndreeaM',
    password: 'ANDREEAM',
    connectionString: 'oracle-105547-0.cloudclusters.net:10197/xe',
    //database: 'Cloud'
    //privilege: oracledb.SYSDBA,
};

// module.exports = {
//     username: 'ADMIN',
//     password: 'AndreeaMusat98*',
//     connectionString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.eu-frankfurt-1.oraclecloud.com))(connect_data=(service_name=gf9d3f591220d7b_medeea_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))',
//     //database: 'Cloud'
//     // privilege: 'medeea_high',
// };