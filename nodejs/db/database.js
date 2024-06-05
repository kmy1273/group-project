const mysql = require('mysql');

const conn = mysql.createConnection({
    host    : "127.0.0.1",
    user    : "root",
    password: "apm6311",
    database: "bomsmes"
});

module.exports = conn;