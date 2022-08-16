const express = require('express')
const createError = require('http-errors');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const user = require('./app/controllers/UserController');
const authentication = require('./app/controllers/AuthenticationController');
const apis = require('./app/controllers/ApiController');
const projects = require('./app/controllers/ProjectController');
const models = require('./app/controllers/ModelController');
const heartBeat = require('./app/controllers/HeartBeatController');
const notifications = require('./app/controllers/NotificationController');
const azureMsgQueue = require('./app/controllers/AzureMessageQueueController');
require('./db')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const getApiLogger = require('./app/logger/ApiLogger');



app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(getApiLogger());


app.use('/heartbeat', heartBeat);
app.use('/user', user);
app.use('/auth', authentication);
app.use('/project', projects);
app.use('/notification', notifications);
app.use('/api', apis);
app.use('/model', models);
app.use('/azure_message_queue', azureMsgQueue)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(function(req, res, next) {
  next(createError(404));
});

app.listen(process.env.PORT || 4000);
