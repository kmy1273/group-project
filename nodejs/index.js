const express = require('express');

// DB 연결
const conn = require('./db/database.js');
conn.connect();

const app = express();
const PORT = process.env.port || 3001;

app.get("/", (req, res) => {
  const selectQuery = "SELECT * FROM TBBS0013D WHERE 1 = 1";
  conn.query(selectQuery, (err,result) => {
    // res.send("success!");
    res.send(result);
  });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
});