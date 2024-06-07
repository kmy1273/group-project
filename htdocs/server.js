// 필요한 모듈들을 가져옵니다.
const express = require('express'); // Express 프레임워크
const path = require('path'); // 경로 관련 모듈
const fs = require('fs'); // 파일 시스템 모듈
const mysql = require('mysql'); // MySQL 데이터베이스 모듈
const webpack = require('webpack'); // Webpack 모듈 번들러
const chokidar = require('chokidar'); // 파일 시스템 감시 모듈
const webpackDevMiddleware = require('webpack-dev-middleware'); // Webpack 개발 미들웨어
const webpackHotMiddleware = require('webpack-hot-middleware'); // Webpack 핫 미들웨어
const config = require('./webpack.config.js'); // Webpack 설정 파일
const app = express(); // Express 애플리케이션 생성
const port = 3000; // 서버 포트 번호

// MySQL 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: '127.0.0.1', // 데이터베이스 호스트
  user: 'root', // 데이터베이스 사용자 이름
  password: 'apm6311', // 데이터베이스 비밀번호
  database: 'bomsmes' // 데이터베이스 이름
});

// MySQL 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack); // 연결 오류 발생 시 메시지 출력
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId); // 연결 성공 시 메시지 출력
});

// Webpack 컴파일러 생성
let compiler = webpack(config());

// Webpack 컴파일러 설정 함수
function setupCompiler() {
  const newConfig = config(); // 새로운 Webpack 설정 가져오기
  compiler = webpack(newConfig); // 새로운 설정으로 컴파일러 재설정
  console.log('Webpack compiler has been reset.'); // 컴파일러 재설정 완료 메시지 출력
  compiler.hooks.done.tap('DonePlugin', (stats) => {
    console.log('Webpack build finished.'); // 빌드 완료 메시지 출력
    if (stats.hasErrors()) {
      console.error('Build errors:', stats.compilation.errors); // 빌드 오류 발생 시 메시지 출력
    }
  });
}

// Webpack Dev Middleware 설정
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config().output.publicPath, // Webpack 출력 경로
  })
);

// Webpack Hot Middleware 설정
app.use(webpackHotMiddleware(compiler));

// 정적 파일 제공 경로 설정
app.use('/a_sys_mng', express.static(path.join(__dirname, 'a_sys_mng')));

// JSON과 URL 인코딩된 데이터 파싱 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DAO 디렉터리 경로 설정
const daoDir = path.resolve(__dirname, 'a_sys_mng/DAO');

// DAO 디렉터리의 SQL 파일을 읽고 API 엔드포인트 생성
fs.readdir(daoDir, (err, files) => {
  if (err) {
    console.error('Error reading DAO directory:', err); // 디렉터리 읽기 오류 발생 시 메시지 출력
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.sql')) {
      const endpoint = file.replace('.sql', '').toLowerCase(); // 파일 이름에서 엔드포인트 이름 생성
      const sqlFilePath = path.join(daoDir, file); // SQL 파일 경로

      // SQL 파일 내용을 읽고 데이터베이스 쿼리 수행
      app.get(`/api/data-${endpoint}`, (req, res) => {
        fs.readFile(sqlFilePath, 'utf8', (err, sql) => {
          if (err) {
            console.error(`Error reading SQL file (${file}):`, err); // SQL 파일 읽기 오류 발생 시 메시지 출력
            res.status(500).send('Error reading SQL file');
            return;
          }

          connection.query(sql, (err, results) => {
            if (err) {
              console.error(`Error executing SQL query (${file}):`, err); // SQL 쿼리 실행 오류 발생 시 메시지 출력
              res.status(500).send('Error executing SQL query');
              return;
            }

            res.json(results); // 쿼리 결과를 JSON으로 응답
          });
        });
      });
    }
  });
});

// 파일 변경 감시 설정
const watcher = chokidar.watch('./a_sys_mng/JS/*.js', {
  ignored: /node_modules/, // node_modules 디렉터리는 감시하지 않음
  persistent: true, // 지속적으로 감시
});

// 파일 변경 시 Webpack 컴파일러 재설정
watcher.on('change', (file) => {
  console.log(`File ${file} has been changed`); // 파일 변경 시 메시지 출력
  setupCompiler(); // 컴파일러 재설정
});

watcher.on('add', (file) => {
  console.log(`File ${file} has been added`); // 파일 추가 시 메시지 출력
  setupCompiler(); // 컴파일러 재설정
});

watcher.on('unlink', (file) => {
  console.log(`File ${file} has been removed`); // 파일 삭제 시 메시지 출력
  setupCompiler(); // 컴파일러 재설정
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`); // 서버 시작 메시지 출력
});

// 위 코드는 다음과 같은 작업을 수행합니다:

// 1. 필요한 모듈들을 가져옵니다: Express, Path, FS, MySQL, Webpack, Chokidar, Webpack Dev Middleware, Webpack Hot Middleware 및 Webpack 설정 파일을 가져옵니다.
// 2. Express 애플리케이션을 생성하고, 사용할 포트 번호를 설정합니다.
// 3. MySQL 데이터베이스 연결을 설정하고, 연결합니다.
// 4. Webpack 컴파일러를 생성하고, 빌드가 완료되었을 때 메시지를 출력하는 훅을 설정합니다.
// 5. Webpack Dev Middleware 및 Webpack Hot Middleware를 설정하여 Webpack을 사용하여 개발 서버를 구성합니다.
// 6. 정적 파일 제공 경로를 설정하여 특정 디렉터리의 파일들을 제공할 수 있도록 합니다.
// 7. DAO 디렉터리의 SQL 파일들을 읽고, 각 SQL 파일에 대해 API 엔드포인트를 생성합니다. 이 엔드포인트는 SQL 파일의 내용을 읽어 MySQL 데이터베이스에 쿼리를 실행하고, 결과를 JSON으로 반환합니다.
// 8. 파일 변경을 감시하여, 파일이 변경, 추가, 삭제될 때마다 Webpack 컴파일러를 재설정합니다.
// 9. Express 서버를 시작하여 지정된 포트에서 실행합니다.