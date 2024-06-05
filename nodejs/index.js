// const express = require('express');
// const cors = require('cors');
// const userRoutes = require('./routes/userRoutes');

// // DB 연결
// const conn = require('./db/database.js');
// conn.connect();

// const app = express();
// const PORT = process.env.port || 3001;

// app.use(express.json());
// var cors = require('cors');
// app.use(cors());

// app.use('/api', userRoutes); // user 라우트 연결

// // app.get("/", (req, res) => {
// //   const selectQuery = "SELECT * FROM TBBS0013D WHERE 1 = 1";
// //   conn.query(selectQuery, (err,result) => {
// //     if(err) throw err;
// //     else res.send("success!");
// //     // res.send(result);
// //   });
// // });

// app.listen(PORT, () => {
//   console.log(`Running on port ${PORT}`)
// });