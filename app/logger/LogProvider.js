const {transports, createLogger, format, log} = require('winston');
const config = require('../../config');
const {getTodaysLogfile} = require('../utils/logUtils');

var LoggerSingletonProvider = function () {
  "use strict";
  if (LoggerSingletonProvider._instance) {
      // This allows the constructor to be called multiple times
      // and refer to the same instance. Another option is to
      // throw an error.
      return LoggerSingletonProvider._instance;
  }
  this.logger = getLogger();
  LoggerSingletonProvider._instance = this;
};
LoggerSingletonProvider.getInstance = function () {
  "use strict";
  return LoggerSingletonProvider._instance?.logger || new LoggerSingletonProvider().logger;
}



function getLogger(){
  const todaysLogFile = getTodaysLogfile();

  const exceptionFolderPath = 'logs/exceptions';

  const logConfiguration = {
    format: format.combine(
      format.timestamp({format:'YYYY-MM-DD HH:mm:ss.SSSS'}),
      format.json()
  ),
    transports: [
      new transports.File({
        level: config.logLevel,
        filename: `logs/${todaysLogFile}`
    })  ],

    exceptionHandlers: [
      new transports.File({ filename: `${exceptionFolderPath}/${todaysLogFile}` })
    ]
  };
  const log = createLogger(logConfiguration);
  return log;
}

module.exports = LoggerSingletonProvider;