const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

app.use(cors()) // 비워두면 모든요청

app.get('/', function (req, res) {
  res.send('Hello World')
})

// app.get('/user/:id', function (req, res) {

//   // GET 방식은 params, query로 받음
//   // POST 방식은 params, body로 받음

//   // const q = req.params; // : 뒤
//   // console.log(q.id)
//   // const q = req.query; // ?로 시작하고 &로 이어붙임
//   // console.log(q.id)
//   const b = req.body;
//   console.log(q.id)

//   res.json({'userId':q.id})
// })

app.get('/sound/:name', function (req, res) {

  const { name } = req.params
  console.log(name)
  // const q = req.query; // ?로 시작하고 &로 이어붙임
  // console.log(q.id)
  if (name == "dog"){
    res.json({'sound':'멍멍'})
  } else if (name == "cat") {
    res.json({'sound':'야옹'})
  } else if (name == "pig") {
    res.json({'sound':'꿀꿀'})
  } else {
    res.json({'sound':'알 수 없음'})
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
