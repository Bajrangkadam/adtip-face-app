const express = require('express');
const bodyParser = require('body-parser');
const helmet = require("helmet");
const cors = require('cors');
const routes = require('./routes/api-routes');
const logger = require('./utils/logger');
//const utils = require('./utils/utils');

const app = express();
const port = 7071
const IPAddress = `127.0.0.1`

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb',extended: true}));
app.use(helmet());
app.use(cors())

// CORS
app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api', routes)

process.on("uncaughtException", e => {
  logger.error(`uncaughtException : ${e.message}`);
  console.log("uncaughtException: " + e);
});

process.on("unhandledRejection", (e) => {
  logger.error(`unhandledRejection : ${e.message}`);
  console.log("unhandledRejection: " + e);
});

//utils.sendNotification("tet","tesr");

app.get('/', (req, res) => res.send('Welcome !!'))

// path handler middleware
app.use((req, res, next) => {
  logger.error(req.path + ' Not found');
  res.status(404).send({
    status: 404,
    message: req.path + ' Not found',
    data: []
  })
});
// error handler middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).send(
    {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
      data: []
    });
})

app.listen(process.env.PORT || port, () => {
  console.log(`Server started and running on http://${IPAddress}:${port}`);
  logger.info(`Server started and running on http://${IPAddress}:${port}`);
})