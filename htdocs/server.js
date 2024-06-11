const path = require('path');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const chokidar = require('chokidar');

const app = express();
const port = 3000;
const host = '192.168.0.54'; // 서버의 로컬 IP 주소

app.use(express.json()); // JSON 파싱 미들웨어 추가

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'apm6311',
  database: 'bomsmes'
});

// MySQL 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Webpack 컴파일러 설정
const compiler = webpack(config());

app.use(webpackDevMiddleware(compiler, {
  publicPath: config().output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));

// 정적 파일 제공 설정
const serveStatic = (dir) => {
  app.use(`/${path.basename(dir)}`, express.static(dir));
  console.log(`Serving static files from: ${dir}`);
};

// 현재 디렉토리의 모든 하위 디렉토리를 정적 파일로 제공
const baseDir = path.resolve(__dirname);

const watcher = chokidar.watch(baseDir, {
  ignored: /node_modules/,
  persistent: true
});

watcher.on('addDir', (dirPath) => {
  if (fs.statSync(dirPath).isDirectory()) {
    serveStatic(dirPath);
  }
});

// 동적으로 SQL 쿼리를 받아 실행하는 엔드포인트
app.post('/api/query', (req, res) => {
  const { dir, file, params } = req.body;

  if (!dir || !file) {
    res.status(400).send('Directory and file name are required');
    return;
  }

  // SQL 파일 경로 생성
  const sqlFilePath = path.resolve(__dirname, dir, `${file}.js`);

  // SQL 파일 읽기
  fs.readFile(sqlFilePath, 'utf8', (err, sqlTemplate) => {
    if (err) {
      console.error(`Error reading SQL file (${sqlFilePath}):`, err);
      res.status(500).send('Error reading SQL file');
      return;
    }

    // SQL 템플릿을 함수로 실행하여 SQL 쿼리를 동적으로 생성
    let sql;
    try {
      const sqlFunction = eval(sqlTemplate);
      sql = sqlFunction(params);
    } catch (error) {
      console.error('Error executing SQL template:', error);
      res.status(500).send('Error executing SQL template');
      return;
    }

    // SQL 쿼리 실행
    connection.query(sql, (err, results) => {
      if (err) {
        console.error('Error executing SQL query:', err);
        res.status(500).send('Error executing SQL query');
        return;
      }

      res.json(results); // 쿼리 결과를 JSON 형식으로 응답
    });
  });
});

// 서버 시작
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});

// 초기 디렉토리 설정
fs.readdir(baseDir, (err, files) => {
  if (err) {
    console.error('Error reading base directory:', err);
    return;
  }

  files.forEach(file => {
    const fullPath = path.join(baseDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      serveStatic(fullPath);
    }
  });
});
