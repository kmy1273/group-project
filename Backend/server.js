const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const PORT = 8888;

const app = express();
app.use(cors());

const db = mysql.createConnection({
    host     : "127.0.0.1",
    user     : "root",
    port     : "3306",
    password : "apm6311",
    database : "bomsmes"
})

app.get('/', (req, res) => {
    return res.json("From Backend Side");
});

app.get('/TBBS0013D', (req, res) => {
    const sql = "SELECT * FROM TBBS0013D";
    db.query(sql, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
})

app.listen(PORT, () => {
    console.log("listening");
})