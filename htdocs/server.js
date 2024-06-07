const express = require('express');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const webpack = require('webpack');
const chokidar = require('chokidar');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'apm6311',
  database: 'bomsmes'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

let compiler = webpack(config());

function setupCompiler() {
  const newConfig = config();
  compiler = webpack(newConfig);
  console.log('Webpack compiler has been reset.');
  compiler.hooks.done.tap('DonePlugin', (stats) => {
    console.log('Webpack build finished.');
    if (stats.hasErrors()) {
      console.error('Build errors:', stats.compilation.errors);
    }
  });
}

app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config().output.publicPath,
  })
);

app.use(webpackHotMiddleware(compiler));

app.use('/a_sys_mng', express.static(path.join(__dirname, 'a_sys_mng')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const daoDir = path.resolve(__dirname, 'a_sys_mng/DAO');
fs.readdir(daoDir, (err, files) => {
  if (err) {
    console.error('Error reading DAO directory:', err);
    return;
  }

  files.forEach(file => {
    if (file.endsWith('.sql')) {
      const endpoint = file.replace('.sql', '').toLowerCase();
      const sqlFilePath = path.join(daoDir, file);

      app.get(`/api/data-${endpoint}`, (req, res) => {
        fs.readFile(sqlFilePath, 'utf8', (err, sql) => {
          if (err) {
            console.error(`Error reading SQL file (${file}):`, err);
            res.status(500).send('Error reading SQL file');
            return;
          }

          connection.query(sql, (err, results) => {
            if (err) {
              console.error(`Error executing SQL query (${file}):`, err);
              res.status(500).send('Error executing SQL query');
              return;
            }

            res.json(results);
          });
        });
      });
    }
  });
});

const watcher = chokidar.watch('./a_sys_mng/JS/*.js', {
  ignored: /node_modules/,
  persistent: true,
});

watcher.on('change', (file) => {
  console.log(`File ${file} has been changed`);
  setupCompiler();
});

watcher.on('add', (file) => {
  console.log(`File ${file} has been added`);
  setupCompiler();
});

watcher.on('unlink', (file) => {
  console.log(`File ${file} has been removed`);
  setupCompiler();
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
