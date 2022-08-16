const expressWinston = require('express-winston');
const {transports, createLogger, format, log} = require('winston');
const config = require('../../config');
const {getTodaysLogfile} = require('../utils/logUtils');

const routeBlackList = ['/api-docs'];

function getLogger() {
    const todaysLogFile = getTodaysLogfile();

    var isMetaDataNeeded = false;

    if(config.logLevel === 'debug'){
        console.log('Log level is debug');
        expressWinston.responseWhitelist.push('body');
        isMetaDataNeeded = true;
    }
    const logger =  expressWinston.logger({
        transports: [
          new transports.File({            
            level: config.logLevel,
            filename: `logs/${todaysLogFile}`
        }),
        ],
        meta: isMetaDataNeeded, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP {{res.statusCode}} {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
        colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
        ignoreRoute: ignoreBlackListRoute
      })// ignore route not working properly when route is /notification
    return logger;
}

const ignoreBlackListRoute = function (req, res) {
   var shouldIgnore = false;

   routeBlackList.forEach(function(route){
      if(req.originalUrl.includes(route) || req.url.includes(route)){
         shouldIgnore = true;
      }
   });

   return shouldIgnore;
}

module.exports = getLogger;

